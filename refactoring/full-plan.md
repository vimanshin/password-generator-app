# Полный план рефакторинга

Правило: структура меняется, результат — нет. Каждый этап — отдельный коммит.

## Проверка каждого этапа

1. `npm run check`
2. Сравнение `dist/assets/css/*.css` и `dist/assets/js/*.js` с `baseline/compiled.*`
3. Скриншоты mobile 375 / tablet 768 / desktop 1440 против `screenshots/baseline/`
4. Console без новых ошибок; hover/focus; генерация и копирование
5. Grep по удалённым/переименованным идентификаторам
6. `git diff` — только изменения текущего этапа

## Checklist

- [x] Этап 0. Baseline — [stage-00-baseline.md](stage-00-baseline.md)
- [x] Этап 1. Мёртвый код (F1–F3) — [stage-01-dead-code.md](stage-01-dead-code.md)
- [ ] Этап 2. Миксины focus-ring и transition (F4, F5) — [stage-02-mixins.md](stage-02-mixins.md)
- [ ] Этап 3. Магические и лишние значения SCSS (F6–F8) — [stage-03-scss-values.md](stage-03-scss-values.md)
- [ ] Этап 4. TypeScript: announcer и валидация (F9, F10) — [stage-04-typescript.md](stage-04-typescript.md)
- [ ] Этап 5. Финальная проверка — [stage-05-final.md](stage-05-final.md)
