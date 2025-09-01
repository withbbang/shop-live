import { useCallback, useState } from 'react';
import { KeyValueForm } from './types';

/**
 * input, textarea, select tag 훅
 * @param {KeyValueForm} keyValueForm key - value 객체
 */
export function useChangeHook(keyValueForm: KeyValueForm) {
  const [form, setForm] = useState<KeyValueForm>(keyValueForm);

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
