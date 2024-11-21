import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Sun, Moon } from 'lucide-react';
import { GameTile } from './components/GameTile';
import { ScoreBoard } from './components/ScoreBoard';
import { playNote, initAudio } from './services/audioService';
import { useTimer } from './hooks/useTimer';
import { useTheme } from './hooks/useTheme';
import { cn } from './utils/cn';

const COLORS = [
  { name: 'red', class: 'bg-red-500' },
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'yellow', class: 'bg-yellow-500' },
  { name: 'purple', class: 'bg-purple-500' },
  { name: 'pink', class: 'bg-pink-500' },
  { name: 'indigo', class: 'bg-indigo-500' },
  { name: 'cyan', class: 'bg-cyan-500' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'teal', class: 'bg-teal-500' },
  { name: 'lime', class: 'bg-lime-500' },
  { name: 'emerald', class: 'bg-emerald-500' },
  { name: 'rose', class: 'bg-rose-500' },
  { name: 'amber', class: 'bg-amber-500' },
  { name: 'sky', class: 'bg-sky-500' },
  { name: 'fuchsia', class: 'bg-fuchsia-500' },
];

const INITIAL_DELAY = 1000;
const SEQUENCE_DELAY = 500;

function App() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [canPlayerClick, setCanPlayerClick] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const { timeLeft, isActive, startTimer, stopTimer, resetTimer, formatTime } = useTimer();
  const { theme, toggleTheme } = useTheme();

  const generateSequence = useCallback(() => {
    const newSequence = [...sequence, Math.floor(Math.random() * COLORS.length)];
    setSequence(newSequence);
    return newSequence;
  }, [sequence]);

  const playSequence = useCallback(async (currentSequence: number[]) => {
    setCanPlayerClick(false);
    await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY));

    for (let i = 0; i < currentSequence.length; i++) {
      setActiveIndex(currentSequence[i]);
      playNote(currentSequence[i]);
      await new Promise(resolve => setTimeout(resolve, SEQUENCE_DELAY));
      setActiveIndex(null);
      await new Promise(resolve => setTimeout(resolve, SEQUENCE_DELAY / 2));
    }

    setCanPlayerClick(true);
  }, []);

  const endGame = useCallback(() => {
    setGameOver(true);
    setIsPlaying(false);
    stopTimer();
    setBestScore(Math.max(bestScore, currentScore));
  }, [bestScore, currentScore, stopTimer]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      endGame();
    }
  }, [timeLeft, isActive, endGame]);

  const startGame = useCallback(() => {
    initAudio();
    setSequence([]);
    setPlayerSequence([]);
    setCurrentScore(0);
    setGameOver(false);
    setIsPlaying(true);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (isPlaying && sequence.length === 0) {
      const newSequence = generateSequence();
      playSequence(newSequence);
    }
  }, [isPlaying, sequence.length, generateSequence, playSequence]);

  const handleTileClick = (index: number) => {
    if (!canPlayerClick) return;

    playNote(index);
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      endGame();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setCurrentScore(score => score + sequence.length);
      setPlayerSequence([]);
      const newSequence = generateSequence();
      setTimeout(() => playSequence(newSequence), INITIAL_DELAY);
    }
  };

  return (
    <div 
      className={cn(
        'min-h-screen transition-colors duration-300 flex flex-col items-center justify-center p-4',
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' 
          : 'bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900'
      )}
    >
      <button
        onClick={toggleTheme}
        className={cn(
          'absolute top-4 right-4 p-2 rounded-full transition-colors duration-200',
          theme === 'light' 
            ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600' 
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
        )}
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className={cn('w-8 h-8', theme === 'light' ? 'text-indigo-600' : 'text-white')} />
          <h1 className={cn('text-4xl font-bold', theme === 'light' ? 'text-indigo-600' : 'text-white')}>
            Sequence Memory
          </h1>
        </div>
        <p className={cn('opacity-80', theme === 'light' ? 'text-indigo-600' : 'text-white')}>
          Remember the sequence and repeat it!
        </p>
      </div>

      <ScoreBoard
        currentScore={currentScore}
        bestScore={bestScore}
        level={sequence.length || 1}
        timeLeft={timeLeft}
        formatTime={formatTime}
        theme={theme}
      />

      <div className={cn(
        'grid grid-cols-4 gap-2 p-2 rounded-xl mb-6 max-w-[480px] w-full mx-auto',
        theme === 'light' ? 'bg-white/50' : 'bg-black/20'
      )}>
        {COLORS.map((color, index) => (
          <GameTile
            key={color.name}
            color={color.class}
            isActive={activeIndex === index}
            onClick={() => handleTileClick(index)}
            disabled={!canPlayerClick}
          />
        ))}
      </div>

      {!isPlaying && (
        <button
          onClick={startGame}
          className={cn(
            'px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 font-semibold',
            theme === 'light'
              ? 'bg-indigo-500 text-white hover:bg-indigo-600'
              : 'bg-white/10 text-white hover:bg-white/20'
          )}
        >
          {gameOver ? 'Try Again' : 'Start Game'}
        </button>
      )}

      {gameOver && (
        <div className={cn('mt-4 text-center', theme === 'light' ? 'text-indigo-600' : 'text-white')}>
          <p className="text-xl font-semibold">Game Over!</p>
          <p className="opacity-80">
            {timeLeft === 0 ? 'Time\'s up!' : 'Wrong sequence!'}<br />
            Final Score: {currentScore}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;