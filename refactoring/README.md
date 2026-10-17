# Рефакторинг: password-generator-app

## Статус

- Этап 0 (baseline) — ✅ готово
- Текущий этап: 2 — миксины focus-ring и transition

## Baseline

- Исходный коммит: `e6e08e9` (рабочее дерево чистое)
- Baseline-коммит: `724c623` — для `git diff 724c623` и `/code-review`
- `npm run check`: ✅ проходит (Prettier, Stylelint, ESLint, tsc, vite build)
- Console errors / warnings до рефакторинга: **нет** (0 / 0)
- Скриншоты: `screenshots/baseline/` — mobile 375 (empty, filled), tablet 768, desktop 1440.
  Состояние filled: длина 12, Upper+Lower+Numbers, пароль подменён на `PTx1f5DaFX!@`, сила STRONG.
- Скомпилированный результат: `baseline/compiled.css`, `baseline/compiled.js` —
  после SCSS-этапов сравниваем с ним вывод `dist/` (идеал — побайтное совпадение или только перестановка правил).

## Оглавление

- [findings.md](findings.md) — находки и риски
- [issues.md](issues.md) — проблемы вне scope рефакторинга
- [full-plan.md](full-plan.md) — план
