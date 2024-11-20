import { useRef } from "react";

const useSleep = (ms: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  return {
    sleep: () => {
      return new Promise((resolve) => {
        timer.current = setTimeout(() => {
          resolve(true);
        }, ms);
      });
    },
    cancel: () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
  };
};
export default useSleep;
