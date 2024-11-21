import React from 'react';
import { Trophy, Medal, Timer as LevelIcon } from 'lucide-react';
import { Timer } from './Timer';
import { cn } from '../utils/cn';

interface ScoreBoardProps {
  currentScore: number;
  bestScore: number;
  level: number;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  theme: 'light' | 'dark';
}

export function ScoreBoard({ currentScore, bestScore, level, timeLeft, formatTime, theme }: ScoreBoardProps) {
  const bgClass = theme === 'light' ? 'bg-white/50' : 'bg-white/10';
  const textClass = theme === 'light' ? 'text-indigo-600' : 'text-white';

  return (
    <div className="flex gap-4 mb-8 flex-wrap justify-center">
      <div className={cn('flex items-center gap-2 px-4 py-2 rounded-lg', bgClass)}>
        <Trophy className="w-5 h-5 text-yellow-400" />
        <span className={textClass}>Score: {currentScore}</span>
      </div>
      <div className={cn('flex items-center gap-2 px-4 py-2 rounded-lg', bgClass)}>
        <Medal className="w-5 h-5 text-purple-400" />
        <span className={textClass}>Best: {bestScore}</span>
      </div>
      <div className={cn('flex items-center gap-2 px-4 py-2 rounded-lg', bgClass)}>
        <LevelIcon className="w-5 h-5 text-green-400" />
        <span className={textClass}>Level: {level}</span>
      </div>
      <Timer timeLeft={timeLeft} formatTime={formatTime} theme={theme} />
    </div>
  );
}