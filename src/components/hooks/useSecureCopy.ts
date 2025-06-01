// src/presentation/hooks/useSecureCopy.ts
import { useTranslation } from 'react-i18next';
import { useFlashStore } from '@happykiller/sunny-ui';

/**
 * Custom hook to handle secure copy to clipboard with flash feedback
 * @returns copy function with flash and i18n feedback
 */
export const useSecureCopy = () => {
  const flash = useFlashStore();
  const { t } = useTranslation();

  /**
   * Copies the given value to clipboard and shows a flash message
   * @param value the string to copy
   * @param label i18n key suffix (e.g. "cb.number")
   */
  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    flash.open(t(`chest.copy.${label}`));
  };

  return copy;
};
