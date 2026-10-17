# Этап 1. Мёртвый код

**Статус:** ✅ готово · **Findings:** F1, F2, F3 · **Риск:** 🟢 · **Writer:** scss-writer, ts-writer

## Контроль риска

- Grep перед удалением: 0 использований `mixins.desktop`, `mixins.tablet-only`, `$breakpoint-desktop`
- Скомпилированный CSS не должен измениться ни на байт (неиспользуемые миксины ничего не выводят)
- JS-бандл: Rollup и так выкидывал неиспользуемые экспорты — ожидаем идентичный или эквивалентный вывод

## До → после

- `@mixin desktop {…}`, `@mixin tablet-only {…}`, `$breakpoint-desktop` → удалены
- `export function shuffle` → `function shuffle` (аналогично `getRandomIndex`, `CHARACTER_SETS`)

## Критерии готовности

- [x] `npm run check` зелёный
- [x] CSS совпадает с baseline
- [x] Grep по удалённым именам пуст

## Факт реализации

- `npm run check`: ✅
- CSS и JS: побайтно идентичны baseline (те же хеши `index-B0wyysqq.css`, `index-CdAF9u24.js`) — скриншоты совпадают автоматически
- Grep по `breakpoint-desktop`, `tablet-only`, `mixins.desktop`: 0 совпадений
- Попутно: `refactoring/baseline` добавлен в `.prettierignore`
- Коммит: `ec0d5d6`
