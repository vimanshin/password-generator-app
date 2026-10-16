// Сначала идут переменные и свойства, затем вложенные селекторы и в конце адаптивные правила.
const contentOrder = [
  'dollar-variables',
  'custom-properties',
  'declarations',
  'rules',
  'at-rules',
];

/**
 * @see https://stylelint.io/user-guide/configure/
 * @type {import('stylelint').Config}
 */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  ignoreFiles: ['dist/**', 'node_modules/**'],
  rules: {
    // Запрещаем !important, чтобы каскад оставался предсказуемым.
    'declaration-no-important': true,

    // Сохраняем стандартное CSS-значение currentColor в принятом написании.
    'value-keyword-case': ['lower', { ignoreKeywords: ['currentColor'] }],
    // BEM: block, block__element, block--modifier, block__element--modifier.
    // Значение по умолчанию из stylelint-config-standard-scss допускает
    // только kebab-case и отвергает разделители __ и --.
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$',
      {
        message: (selector) =>
          `Ожидается BEM-имя: block, block__element, block--modifier (получено "${selector}")`,
      },
    ],

    // Prettier корректно форматирует CSS font shorthand вида 18px/145%.
    // SCSS-правило ошибочно принимает этот слеш за математический оператор.
    'scss/operator-no-unspaced': null,

    // Сохраняем mobile-first структуру: базовые стили, вложенные правила, @media.
    'order/order': [contentOrder, { unspecified: 'bottom' }],
  },
};
