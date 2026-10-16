// Значения совпадают с контрактом data-strength в index.html и SCSS
export type StrengthLevel = 'too-weak' | 'weak' | 'medium' | 'strong';

// Подписи для #strength-level; заглавными их делает CSS
export const STRENGTH_LABELS: Record<StrengthLevel, string> = {
  'too-weak': 'Too weak',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
};

// Пороги из таблицы «Формула силы» в plan-project/full-plan.md
const STRONG_RULE = { minLength: 12, minSets: 3 } as const;
const MEDIUM_RULE = { minLength: 8, minSets: 2 } as const;
const WEAK_MIN_LENGTH = 6;

// Функция: оценивает силу пароля по длине и числу использованных наборов
// Принимает: длину пароля и количество выбранных наборов символов
// Возвращает: уровень силы для атрибута data-strength
export function getStrength(length: number, setCount: number): StrengthLevel {
  if (length >= STRONG_RULE.minLength && setCount >= STRONG_RULE.minSets) {
    return 'strong';
  }

  if (length >= MEDIUM_RULE.minLength && setCount >= MEDIUM_RULE.minSets) {
    return 'medium';
  }

  if (length >= WEAK_MIN_LENGTH) {
    return 'weak';
  }

  return 'too-weak';
}
