import { useState, useEffect } from 'react';

export const useNotification = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (current !== null || queue.length === 0) return;
    setCurrent(queue[0]);
    setQueue((prev) => prev.slice(1));
  }, [queue, current]);

  useEffect(() => {
    if (current === null) return;
    const timer = setTimeout(() => setCurrent(null), 3000);
    return () => clearTimeout(timer);
  }, [current]);

  const addNotification = (message: string) => {
    setQueue((prev) => [...prev, message]);
  };

  return {
    current,
    addNotification,
  };
};