# Этап 1. Мёртвый код

**Статус:** 🟡 в работе · **Findings:** F1, F2, F3 · **Риск:** 🟢 · **Writer:** scss-writer, ts-writer

## Контроль риска

- Grep перед удалением: 0 использований `mixins.desktop`, `mixins.tablet-only`, `$breakpoint-desktop`
- Скомпилированный CSS не должен измениться ни на байт (неиспользуемые миксины ничего не выводят)
- JS-бандл: Rollup и так выкидывал неиспользуемые экспорты — ожидаем идентичный или эквивалентный вывод

## До → после

- `@mixin desktop {…}`, `@mixin tablet-only {…}`, `$breakpoint-desktop` → удалены
- `export function shuffle` → `function shuffle` (аналогично `getRandomIndex`, `CHARACTER_SETS`)

## Критерии готовности

- [ ] `npm run check` зелёный
- [ ] CSS совпадает с baseline
- [ ] Grep по удалённым именам пуст

## Факт реализации

—
