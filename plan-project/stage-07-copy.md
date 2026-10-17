# Этап 07. Копирование

**Статус:** ✅ готово

## Цель

Копирование через `navigator.clipboard.writeText`, состояние COPIED, объявление через `aria-live`.

## Раскладка

—

## Токены

См. [tokens.md](tokens.md) — раздел «Поле пароля».

## Субагенты

`ts-writer`

## Критерии готовности

- Совпадение с Figma на 375 / 768 / 1440.
- `npm run check` без ошибок.
- Ошибка Clipboard API обработана, в пустом состоянии копировать нечего.

## Факт реализации

Внесено ассистентом по просьбе пользователя, 2026-10-16. Файлы: новый `src/scripts/clipboard.ts`, `src/main.ts` (импорт, константы, `copyButton`/`copyStatus`, `copyStatusTimer`, `resetCopyStatus`, `showCopiedStatus`, `selectPasswordForManualCopy`, `handleCopyClick`, сброс статуса в `handleFormSubmit`, слушатель `click`).

### Решения

- `copyText(text): Promise<boolean>` — обёртка над Clipboard API без DOM, никогда не отклоняется: проверка `'clipboard' in navigator` (secure context) + `try/catch` вокруг `await`.
- Пустой пароль → подсказка «Generate a password first», без `disabled` (кнопка остаётся в порядке Tab).
- Live region: очистка → пауза 100 мс → «Copied» → скрытие через 2000 мс. Один таймер `number | undefined` через `window.setTimeout` (без конфликта с типами Node).
- Защита от гонки: результат копирования не показывается, если пароль успел смениться.
- Ошибка → фокус и выделение пароля, подсказка про Ctrl+C. Новая генерация сбрасывает статус и таймер.

### Проверка

`npm run check` ✅ (8 модулей). Playwright (Chromium, 768), консоль пустая:

| Сценарий                         | Результат                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Клик при пустом поле             | подсказка «Generate a password first», clipboard не вызван                              |
| Клик после генерации             | `navigator.clipboard.readText()` = сгенерированный пароль; COPIED виден                 |
| Через 2 с                        | статус очищен                                                                           |
| Повторный клик через 1.5 с       | таймер сброшен: виден на +1.5 с, скрыт к +2.3 с                                         |
| Generate сразу после копирования | статус очищен, позже «Copied» не появляется                                             |
| `writeText` отклонён (подмена)   | COPIED нет, фокус в поле, пароль выделен, подсказка про Ctrl+C, unhandled rejection нет |

Не проверено вживую: отсутствие `navigator.clipboard` вне secure context (http по IP) — ветка покрыта той же логикой `return false`.
