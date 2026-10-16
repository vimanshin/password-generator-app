# Полный план

Согласован 2026-10-16.

## Решения

- Брейкпоинт один: `$breakpoint-tablet` (768px). Tablet и desktop в макете идентичны, миксин `desktop` не нужен.
- Раскладка — только Flexbox: все блоки одномерные.
- Иконки копирования и стрелки — inline-SVG с `fill="currentColor"`, чтобы менять цвет на hover из CSS.
- Длина пароля: 0–20, стартовое состояние — Empty (длина 0, плейсхолдер).
- Генерация: `crypto.getRandomValues`, не `Math.random`.
- Если длина 0 или не выбран ни один набор символов — пароль не генерируется, пользователь видит подсказку.

### Формула силы (L — длина, n — число включённых наборов)

| Уровень  | Условие        | Полосок | Цвет       |
| -------- | -------------- | ------- | ---------- |
| STRONG   | L ≥ 12 и n ≥ 3 | 4       | green-200  |
| MEDIUM   | L ≥ 8 и n ≥ 2  | 3       | yellow-300 |
| WEAK     | L ≥ 6          | 2       | orange-400 |
| TOO WEAK | иначе          | 1       | red-500    |

Проверка по макету: 10 символов, 3 набора → MEDIUM ✔.

## Этапы

- [x] 00. Подготовка base — фон, высота экрана, отступы страницы · `scss-writer`
- [x] 01. Разметка всего приложения и раскладка колонки · `html-writer`, `scss-writer`
- [x] 02. Поле пароля: Empty / Filled / Copied, hover иконки · `scss-writer`
- [x] 03. Слайдер Character Length: свой `input[type=range]` · `scss-writer`
- [x] 04. Чекбоксы через `appearance: none` · `scss-writer`
- [x] 05. Блок силы (`data-strength`) и кнопка GENERATE · `scss-writer`
- [x] 06. Логика генерации, силы и заливки слайдера · `ts-writer`
- [ ] 07. Копирование в буфер, состояние COPIED, `aria-live` · `ts-writer`
- [ ] 08. Финал: woff2, Playwright 375/768/1440, `final-review`, README · `final-review`

## Критерии готовности каждого этапа

- Совпадение с Figma на 375 / 768 / 1440.
- `npm run check` без ошибок.
- hover и focus-visible работают, консоль Playwright пустая.
