import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

/**
 * Конфиг ESLint во flat-формате — единственном, который поддерживает ESLint.
 *
 * Здесь намеренно НЕ подключён большой готовый пресет. Включены только правила,
 * которые уже описаны словами в инструкциях субагентов: ESLint не вводит новых
 * требований, а механически проверяет принятые.
 *
 * Разделение обязанностей:
 *   tsc     — сходятся ли типы;
 *   ESLint  — хороший ли это код;
 *   Prettier — как он отформатирован.
 * Правила форматирования сюда не добавляй: это зона Prettier.
 *
 * @see https://typescript-eslint.io/getting-started
 */
export default defineConfig(
  {
    // dist собирается Vite, node_modules не наш код
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.ts'],

    // base подключает парсер TypeScript и плагин, но не включает ни одного
    // правила — набор ниже полностью наш
    extends: [tseslint.configs.base],

    languageOptions: {
      parserOptions: {
        // Разрешает правила, которым нужна информация о типах.
        // Берёт настройки из tsconfig.json рядом с этим файлом.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // Два главных запрета проекта. tsc их не ловит:
      // явный any и non-null assertion для компилятора совершенно легальны
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Приведение типа, которое ничего не меняет, — признак недопонимания
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Забытая отладка. Предупреждение, а не ошибка: во время работы console нужен
      'no-console': 'warn',

      // Базовая гигиена
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  }
);
