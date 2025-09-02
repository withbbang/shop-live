import { useCallback, useState } from 'react';
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
