import { useEffect, useRef } from "react";

type MaybePromise<T> = Promise<T> | T
export default function useOnMount(callback: () => MaybePromise<void>) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      callback()
    }
  }, [callback])
}