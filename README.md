# Frontend Mentor — решение челленджа «Генератор паролей»

Это решение [челленджа «Password generator app» на Frontend Mentor](https://www.frontendmentor.io/challenges/password-generator-app-Mr8CLycqjh). Челленджи Frontend Mentor помогают прокачать навыки программирования на реалистичных проектах.

## Содержание

- [Обзор](#обзор)
  - [Задача](#задача)
  - [Скриншот](#скриншот)
  - [Ссылки](#ссылки)
- [Мой процесс](#мой-процесс)
  - [Стек технологий](#стек-технологий)
  - [Чему я научился](#чему-я-научился)
  - [Что дальше](#что-дальше)
  - [Полезные ресурсы](#полезные-ресурсы)
- [Автор](#автор)

## Обзор

### Задача

Пользователи должны иметь возможность:

- Генерировать пароль на основе выбранных параметров
- Копировать сгенерированный пароль в буфер обмена
- Видеть оценку надёжности сгенерированного пароля
- Видеть оптимальную раскладку интерфейса в зависимости от размера экрана устройства
- Видеть состояния hover и focus у всех интерактивных элементов на странице

### Скриншот

![Генератор паролей: сгенерированный пароль, длина 10, уровень Medium](./screenshot.jpg)

### Ссылки

- Рабочая версия сайта: [vimanshin.github.io/password-generator-app](https://vimanshin.github.io/password-generator-app)

## Мой процесс

### Стек технологий

- Семантичная разметка HTML5 и доступность: `fieldset`/`legend`, live regions, `aria-*`
- SCSS: модули `@use`, BEM, mobile-first, Media Queries Level 4 (`width >=`)
- Flexbox и container queries
- TypeScript в строгом режиме, без фреймворков
- [Vite](https://vite.dev/) — dev-сервер и сборка
- Prettier, ESLint (typescript-eslint) и Stylelint

### Чему я научился

**Криптостойкая случайность без перекоса.** `Math.random()` для паролей не годится — он предсказуем. Я использую `crypto.getRandomValues()`, а случайный индекс получаю через rejection sampling: простой остаток `% length` дал бы modulo bias, и часть символов выпадала бы чаще.

```ts
const limit = UINT32_RANGE - (UINT32_RANGE % optionCount);

while (true) {
  crypto.getRandomValues(buffer);
  const randomValue = buffer[0];
  if (randomValue === undefined) throw new Error('Буфер пуст');
  if (randomValue < limit) return randomValue % optionCount;
}
```

Порядок символов перемешивается алгоритмом Фишера–Йетса, а в пароле гарантированно есть символ из каждого выбранного набора.

**Container queries.** Пароль из 20 символов не помещался в поле на мобильном, особенно когда рядом появлялась надпись «Copied». Media query тут не поможет: ширина окна не меняется. Container query реагирует на ширину самого поля:

```scss
.password-display__field {
  container-type: inline-size;
}

.password-display__value {
  // 20 моноширинных символов ≈ 12em
  font-size: min(1.5rem, 100cqi / 12);
}
```

**Состояния на родителе, стили на детях.** TypeScript меняет один атрибут `data-strength`, а CSS сам выбирает цвет и количество полосок через `:nth-child(-n + 3)`. TS ничего не знает о дизайне.

**Live regions для скринридеров.** Регион должен существовать в DOM пустым с самой загрузки. Повторный одинаковый текст скринридер не озвучит, поэтому я сначала очищаю регион, а через 100 мс записываю текст — для этого маленькая фабрика `createAnnouncer` на замыкании.

**Свои контролы без потери доступности:**

- чекбоксы — `appearance: none` прямо на `input`, без трюка «спрятать input и нарисовать `label::before`»;
- слайдер — отдельные правила для `::-webkit-slider-thumb` и `::-moz-range-thumb`: объединять их через запятую нельзя;
- фокус поля пароля — рамка на родителе через `:has(:focus-visible)`.

**TypeScript без `any` и `!`.** Сужение типа DOM-элементов через `instanceof` в универсальном хелпере `getElement(id, HTMLInputElement)`, union строковых литералов и `as const` вместо `enum`, честная обработка `undefined` при `noUncheckedIndexedAccess`.

### Что дальше

- Включить ESLint-правила `no-floating-promises` и `no-misused-promises` в первом проекте с `fetch`.
- Добавить модульные тесты для чистых функций `generatePassword` и `getStrength`.
- Проверять вёрстку в Firefox и Safari, а не только в Chromium.

### Полезные ресурсы

- [MDN: Crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
- [MDN: CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [MDN: Clipboard.writeText()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)

## Автор

- Frontend Mentor — [@vimanshin](https://www.frontendmentor.io/profile/vimanshin)
- GitHub — [@vimanshin](https://github.com/vimanshin)
