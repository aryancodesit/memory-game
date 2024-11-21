import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../utils/cn';

interface TimerProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
  theme: 'light' | 'dark';
}

export function Timer({ timeLeft, formatTime, theme }: TimerProps) {
  const isLowTime = timeLeft <= 30;
  const bgClass = theme === 'light' 
    ? isLowTime ? 'bg-red-100' : 'bg-white/50'
    : isLowTime ? 'bg-red-500/20' : 'bg-white/10';
  const textClass = theme === 'light' ? 'text-indigo-600' : 'text-white';

  return (
    <div className={cn('flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300', bgClass)}>
      <Clock className={cn('w-5 h-5', isLowTime ? 'text-red-400' : 'text-blue-400')} />
      <span className={cn(textClass, isLowTime && 'animate-pulse')}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}