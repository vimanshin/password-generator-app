# Этап 01. Разметка приложения

**Статус:** ✅ готово

## Цель

Семантичная разметка всего интерфейса и раскладка колонки: заголовок, поле пароля, форма настроек.

## Раскладка

Flex-колонка: `h1` → блок «поле пароля + карточка опций».

## Токены

См. [tokens.md](tokens.md) — разделы «Страница», «Поле пароля», «Карточка опций».

## Субагенты

`html-writer`, `scss-writer`

## Критерии готовности

- Совпадение с Figma на 375 / 768 / 1440.
- `npm run check` без ошибок.
- У всех полей есть подписи, дерево доступности в Playwright snapshot читается логично.

## Факт реализации

Внесено ассистентом по просьбе пользователя, 2026-10-16.

Файлы: `index.html`, `src/style.scss`, `src/scss/base/_global.scss` (сброс `h1`/`p`, `font: inherit` у `input`/`button`, `.visually-hidden`), новые `src/scss/components/_generator.scss`, `_password-display.scss`, `_settings.scss`.

### Решения

- Пароль — `readonly <input>` с `placeholder`: Empty без TS, плейсхолдер не зачитывается как значение.
- Живые регионы `#copy-status`, `#generator-hint` (`role="status"`) и `#strength` (`aria-live="polite"`, `aria-atomic`) пусты с загрузки.
- Чекбоксы в `<fieldset>` с visually-hidden `<legend>Character types</legend>`.
- Капс — через `text-transform` (этапы 02, 05), в HTML обычный регистр.
- BEM-блоки: `generator`, `password-display`, `settings`, `strength`. Хуки для TS — `id` и `data-*`.
- `div.settings__footer` оборачивает блок силы, кнопку и подсказку: свой шаг 16/32 и пустая подсказка не съедает `gap` карточки. Стили — этап 05.
- Колонка: `gap` 16 / 24 + `margin-block-end` 8 у заголовка на tablet. Высота поля пароля — `min-height` 64 / 80.

### Контракты для TS (этапы 06–07)

`#generator-form` (submit) · `#password` (`.value`) · `#copy-button` · `#copy-status` (очистить → записать «Copied») · `#password-length` · `#length-value` · `#include-uppercase|lowercase|numbers|symbols` · `#strength[data-strength]` = `""` / `too-weak` / `weak` / `medium` / `strong` · `#strength-level` · `#generator-hint`.

### Проверка

`npm run check` ✅. Playwright, консоль пустая, горизонтальной прокрутки нет:

| Ширина | Заголовок    | Поле пароля          | Карточка |
| ------ | ------------ | -------------------- | -------- |
| 375    | y 64, 16/20  | y 100, 343×64        | y 180    |
| 768    | y 133, 24/32 | x 114, y 197, 540×80 | y 301    |
| 1440   | x 450, y 133 | y 197, 540×80        | y 301    |

Все позиции совпадают с Figma. Дерево доступности: heading, textbox «Generated password», button «Copy password», slider «Character Length», group «Character types» с 4 checkbox, button «Generate».

### Известное и ожидаемое (решается на следующих этапах)

- Внутренности — браузерные контролы без стилей (02–05).
- Пустой `#copy-status` занимает 16px `gap` в поле пароля (02).
- SVG стрелки переносится под текст кнопки: `display: block` из reset (05).
