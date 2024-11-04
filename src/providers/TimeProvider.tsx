import { createContext, ReactNode, useEffect, useState } from 'react';

export const TimeContext = createContext(new Date());

interface Props {
  children: ReactNode;
}

export default function TimeProvider(props: Props) {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // Calculate the delay until the next minute
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    const millisecondsUntilNextMinute =
      secondsUntilNextMinute * 1000 - now.getMilliseconds();

    // Initial timeout to sync with the minute boundary
    const initialTimeout = setTimeout(() => {
      setTime(new Date());

      // After syncing with minute boundary, start the interval
      const interval = setInterval(() => {
        setTime(new Date());
      }, 60000);

      // Cleanup interval on unmount or when effect re-runs
      return () => clearInterval(interval);
    }, millisecondsUntilNextMinute);

    // Cleanup initial timeout if component unmounts before it fires
    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <TimeContext.Provider value={time}>{props.children}</TimeContext.Provider>
  );
}
