import { useState, useEffect, useCallback } from 'react';

const TOTAL_TIME = 3 * 60; // 3 minutes in seconds

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isActive, setIsActive] = useState(false);

  const startTimer = useCallback(() => {
    setTimeLeft(TOTAL_TIME);
    setIsActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(TOTAL_TIME);
    setIsActive(false);
  }, []);

  useEffect(() => {
    let interval: number;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    isActive,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  };
}