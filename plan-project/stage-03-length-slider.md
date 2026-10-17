# Этап 03. Слайдер длины

**Статус:** ✅ готово

## Цель

Строка «Character Length + значение» и свой `input[type=range]`.

## Раскладка

Flex-строка, `space-between`.

## Токены

См. [tokens.md](tokens.md) — разделы «Карточка опций», «Слайдер».

## Субагенты

`scss-writer`

## Критерии готовности

- Совпадение с Figma на 375 / 768 / 1440.
- `npm run check` без ошибок.
- Одинаковый вид в Chromium и Firefox (`::-webkit-slider-thumb`, `::-moz-range-thumb`).

## Факт реализации

Внесено ассистентом по просьбе пользователя, 2026-10-16. Файл: `src/scss/components/_settings.scss` (переписан целиком).

### Решения

- `__length` — Flex-колонка, gap 8 / 16; `__length-header` — Flex `space-between`.
- Ползунок описан локальными миксинами `slider-thumb` и `slider-thumb-hover` и подключён в отдельные правила `::-webkit-slider-thumb` / `::-moz-range-thumb`: через запятую их писать нельзя.
- Заливка: Chromium/Safari — `linear-gradient` с жёсткой границей в `var(--fill)`; Firefox — нативный `::-moz-range-progress`.
- WebKit-ползунок центрирован `margin-top: -10px` = (8 − 28) / 2. У ползунка явный `box-sizing: border-box` и прозрачная рамка 2px — на hover меняется только цвет, размер не прыгает.
- Фокус — outline 2px green-200 вокруг всего слайдера, как у поля пароля. Геометрия 28 / 8 — в px.

### Контракт для TS (этап 06)

На каждый `input` и при загрузке: `slider.style.setProperty('--fill', \`${((value - min) / (max - min)) * 100}%\`)`.

### Проверка

`npm run check` ✅. Playwright (Chromium 155), консоль пустая:

| Ширина | Строка                             | Строка → слайдер | Слайдер |
| ------ | ---------------------------------- | ---------------- | ------- |
| 375    | 311×32, подпись 16/20, число 24/32 | 8                | 311×28  |
| 768    | 476×42, подпись 18/24, число 32/42 | 16               | 476×28  |

Заливка при `--fill: 50%` совпадает с макетом; hover — ползунок grey-850 с рамкой green-200; Tab → outline, ArrowRight меняет значение.

Firefox через Playwright MCP не проверялся — см. [issues.md](issues.md) #3.
