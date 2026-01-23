import { Language, LocalizedItem } from '../types';

/**
 * Get localized text from a LocalizedItem based on current language
 */
export const getLocalizedText = (item: LocalizedItem, lang: Language): string => {
  return item[lang] || item.en;
};

/**
 * Get localized text from a Record with language keys
 */
export const localize = <T extends Record<Language, string>>(messages: T, lang: Language): string => {
  return messages[lang];
};
