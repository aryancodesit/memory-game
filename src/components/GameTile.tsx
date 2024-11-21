import React from 'react';
import { cn } from '../utils/cn';

interface GameTileProps {
  color: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

const getHighlightColor = (baseColor: string) => {
  const colorMap: Record<string, string> = {
    'bg-red-500': 'bg-red-400',
    'bg-blue-500': 'bg-blue-400',
    'bg-green-500': 'bg-green-400',
    'bg-yellow-500': 'bg-yellow-400',
    'bg-purple-500': 'bg-purple-400',
    'bg-pink-500': 'bg-pink-400',
    'bg-indigo-500': 'bg-indigo-400',
    'bg-cyan-500': 'bg-cyan-400',
    'bg-orange-500': 'bg-orange-400',
    'bg-teal-500': 'bg-teal-400',
    'bg-lime-500': 'bg-lime-400',
    'bg-emerald-500': 'bg-emerald-400',
    'bg-rose-500': 'bg-rose-400',
    'bg-amber-500': 'bg-amber-400',
    'bg-sky-500': 'bg-sky-400',
    'bg-fuchsia-500': 'bg-fuchsia-400',
  };
  return colorMap[baseColor] || baseColor;
};

export function GameTile({ color, isActive, onClick, disabled }: GameTileProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'aspect-square w-full max-w-[110px] rounded-lg transition-all duration-200 transform hover:scale-102',
        'shadow-lg hover:shadow-xl active:scale-98',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isActive ? getHighlightColor(color) : color,
        isActive && 'ring-4 ring-white ring-opacity-50 scale-105 z-10 animate-pulse'
      )}
      aria-label={`Game tile ${color}`}
    />
  );
}