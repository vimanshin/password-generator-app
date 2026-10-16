# Этап 05. Сила пароля и кнопка

**Статус:** ✅ готово

## Цель

Блок STRENGTH с 4 полосками и цветами уровней через `data-strength`, кнопка GENERATE.

## Раскладка

Flex-строка, `space-between`.

## Токены

См. [tokens.md](tokens.md) — разделы «Блок силы», «Кнопка GENERATE».

## Субагенты

`scss-writer`

## Критерии готовности

- Совпадение с Figma на 375 / 768 / 1440.
- `npm run check` без ошибок.
- Все 4 уровня и пустое состояние переключаются сменой одного атрибута.

## Факт реализации

Внесено ассистентом по просьбе пользователя, 2026-10-16. Файлы: новый `src/scss/components/_strength.scss`, `src/style.scss` (`@use 'scss/components/strength'`), `src/scss/components/_settings.scss` (`__footer`, `__generate`, `__generate-icon`, `__hint` + tablet).

### Решения

- Уровень — `data-strength` на `.strength`; каждый уровень задаёт только `--strength-color`, полоски красит одно правило со списком `:nth-child(-n + N)`.
- Высота блока силы — `min-height` 56 / 72 + центрирование (вертикальные 22px в Figma не из токенов).
- Пустой `__level` — `display: none` (live region — весь `#strength`); пустой `__hint` — `:empty` + `visually-hidden` (сам live region).
- Кнопка: рамка 2px green-200 всегда, на hover меняются только фон и цвет; стрелка `currentColor`; размеры иконки заданы явно.
- Подсказка — orange-400 (6.01:1 на grey-800); red-500 даёт 4.44:1 и не проходит AA.

### Проверка

`npm run check` ✅. Playwright (Chromium), консоль пустая, горизонтальной прокрутки нет.

| Ширина | Блок силы | Блок → кнопка | Кнопка | Шрифты (label / level / button) |
| ------ | --------- | ------------- | ------ | ------------------------------- |
| 375    | 311×56    | 16            | 311×56 | 16 / 18 / 16                    |
| 768    | 476×72    | 32            | 476×65 | 18 / 24 / 18                    |

Уровни: пусто — 0 полосок, уровень скрыт; too-weak — 1 red; weak — 2 orange; medium — 3 yellow; strong — 4 green. Hover кнопки: фон прозрачный, текст и стрелка green-200, высота 65 без прыжка. Tab → outline с offset 2px. Видимая подсказка: orange-400, 32px под кнопкой на tablet. Стрелка в одной строке с текстом.

Расхождения с Figma — [issues.md](issues.md):

- #5 исправлено по решению пользователя: на tablet+ у `.settings` padding снизу `--spacing-500` (40; в Figma 41) — карточка 527px вместо 528.
- #6 принято пользователем: строки чекбоксов на mobile 20px против 21 в Figma (−3px по карточке).
