import { useState, useCallback } from "react";

export function useSingleCall() {
  const [calledIds, setCalledIds] = useState<{ [key: string]: boolean }>({});

  const callOnce = useCallback(
    (id: string | number, fn: () => void) => {
      if (calledIds[id]) return;
      setCalledIds(prev => ({ ...prev, [id]: true }));
      fn();
    },
    [calledIds]
  );

  const hasBeenCalled = (id: string | number) => !!calledIds[id];

  return { callOnce, hasBeenCalled };
}