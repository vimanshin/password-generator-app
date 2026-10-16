# Этап 02. Поле пароля

**Статус:** ✅ готово

## Цель

Пароль, плейсхолдер Empty, кнопка копирования с hover, состояние Copied.

## Раскладка

Flex-строка: `input` с `flex: 1` забирает свободное место, статус и кнопка прижаты вправо (`space-between` не понадобился).

## Токены

См. [tokens.md](tokens.md) — раздел «Поле пароля».

## Субагенты

`scss-writer`

## Критерии готовности

- Совпадение с Figma на 375 / 768 / 1440.
- `npm run check` без ошибок.
- Иконка меняет цвет на hover, у кнопки виден focus-visible.

## Факт реализации

Внесено ассистентом по просьбе пользователя, 2026-10-16. Файл: `src/scss/components/_password-display.scss` (переписан целиком).

### Решения

- `__value`: `flex: 1` + `min-width: 0`, без браузерных рамки и фона, `text-overflow: ellipsis`; Preset 2 → 1. `::placeholder` grey-700 с `opacity: 1` (Firefox).
- Фокус поля — outline на всей `.password-display` через `:has(.password-display__value:focus-visible)`; у `input` свой outline снят.
- Пустой `#copy-status` — `:empty` + миксин `visually-hidden`: вне flex-потока, но live region остаётся в дереве доступности. От TS нужна только смена `textContent`; очищать через `textContent = ''`, тег держать в одну строку.
- Отступ COPIED → иконка: 8 (mobile, отрицательный `margin-inline-end` от `gap` 16) / 16 (tablet).
- Кнопка: зона клика 41.5×44 / 45×48 через `padding` + отрицательный `margin` (WCAG 2.5.5), hover grey-200 с `transition`, отключённым в `reduced-motion`.

### Проверка

`npm run check` ✅. Playwright, консоль пустая:

| Состояние   | 375                                                    | 768                    |
| ----------- | ------------------------------------------------------ | ---------------------- |
| Empty       | placeholder grey-700, opacity 1; статус 1×1 вне потока | —                      |
| Filled      | 24/32, grey-200                                        | 32/42                  |
| Copied      | COPIED 16px, uppercase, green-200, отступ 8.4          | 18px, отступ 16.2      |
| Иконка      | 17.5×20, правый край 343                               | 21×24, правый край 622 |
| 20 символов | без горизонтальной прокрутки                           | —                      |

Фокус: Tab на кнопке — outline 2px green-200; Shift+Tab на поле — outline на всей коробке. Hover кнопки — grey-200.

Замечено: Chromium показывает `:focus-visible` на readonly-поле и при клике мышью (для текстовых полей это стандартное поведение). Оставлено: клик по полю — это выделение пароля, рамка подтверждает фокус.
