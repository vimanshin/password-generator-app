# Этап 2. Миксины focus-ring и transition

**Статус:** ✅ готово · **Findings:** F4, F5 · **Риск:** 🟡 · **Writer:** scss-writer

## Контроль риска

- Specificity всех селекторов не меняется — меняется только источник деклараций
- `@media (prefers-reduced-motion)` остаётся на прежнем месте; `transition` у трёх элементов переезжает в повторный блок селектора ниже `:hover`/`:focus-visible` (Dart Sass выводит декларации после вложенных правил отдельным блоком). Ни `:hover`, ни `:focus-visible` `transition` не задают — каскад тот же
- Значения (2px, green-200, 0.2s ease) не меняются

## До → после

- `outline: 2px solid var(--color-green-200); outline-offset: 2px;` ×5 → `@include mixins.focus-ring;` / `focus-ring(0)`
- `transition: a 0.2s ease, b 0.2s ease;` + `@include mixins.reduced-motion { transition: none; }` ×4 → `@include mixins.transition(a, b);`

## Критерии готовности

- [x] CSS отличается от baseline только порядком правил
- [x] Focus-кольца и hover-переходы визуально прежние

## Факт реализации

- `npm run check`: ✅
- JS: побайтно идентичен baseline
- CSS: множество «контекст | селектор | декларация» совпадает (315 = 315); отличие — позиция трёх `transition`
- Скриншоты: mobile — 0 различий; tablet/desktop — шум ±1/255 в градиенте фона между загрузками страницы. Подмена CSS на baseline в той же странице дала 0 различий → рефакторинг рендер не менял
- Фокус (Tab): поле пароля 2px/2px, copy 2px/0, слайдер, чекбокс, Generate 2px/2px ✅
- Hover Generate: цвет и фон как прежде ✅; reduced-motion: `transition: none` у copy, checkbox, Generate ✅
- Console: 0 errors / 0 warnings
- Коммит: `057689b`
