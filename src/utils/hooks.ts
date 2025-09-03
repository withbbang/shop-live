import { use, useCallback, useEffect, useRef, useState } from 'react';
import { KeyValueFormType } from './types';

/**
 * input, textarea, select tag 훅
 * @param {KeyValueFormType} keyValueFormType key - value 객체
 */
export function useChangeHook(keyValueFormType: KeyValueFormType) {
  const [form, setForm] = useState<KeyValueFormType>(keyValueFormType);

  const useChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const { name, value } = e.currentTarget;

      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setForm],
  );

  return { form, setForm, useChange };
}

export function useIntervalHook(callback: Function, delay: number | null) {
  const savedCallback = useRef<Function>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
