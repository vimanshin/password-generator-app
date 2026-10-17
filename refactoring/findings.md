# Находки

## Мёртвый код

| ID | Файл | Проблема | Решение | Риск |
| --- | --- | --- | --- | --- |
| F1 | `src/scss/abstracts/_mixins.scss:14-30`, `_variables.scss:6-7` | Миксины `desktop`, `tablet-only` и `$breakpoint-desktop` нигде не используются (Grep: 0 вызовов) | Удалить (YAGNI; вернуть из Git при надобности) | 🟢 |
| F2 | `src/scss/components/.gitkeep` | Папка давно не пустая, `.gitkeep` лишний | Удалить | 🟢 |
| F3 | `src/scripts/password.ts:13,26,71` | `CHARACTER_SETS`, `getRandomIndex`, `shuffle` экспортируются, но используются только внутри модуля | Убрать `export` | 🟢 |

## SCSS: повторяющиеся наборы

| ID | Файл | Проблема | Решение | Риск |
| --- | --- | --- | --- | --- |
| F4 | `_password-display.scss:16-19,97-100`, `_settings.scss:125-128,177-180,228-231` | Фокус-кольцо `outline: 2px solid green-200` + `outline-offset` повторено 5 раз | Миксин `focus-ring($offset: 2px)` в `_mixins.scss` | 🟢 |
| F5 | `_password-display.scss:90,102-104`, `_settings.scss:20-26,159-161,182-184,217-219,235-237` | Пара «`transition … 0.2s ease` + `reduced-motion { transition: none }`» повторена 4 раза, `0.2s ease` — 7 раз | Миксин `transition($properties...)`, который сам добавляет reduced-motion | 🟡 media-блок сместится в выводе CSS; specificity та же |

## SCSS: магические и лишние значения

| ID | Файл | Проблема | Решение | Риск |
| --- | --- | --- | --- | --- |
| F6 | `_settings.scss:12-13,75,84,94,102,107` | Размеры слайдера `28px`, `8px` и производное `-10px` записаны вручную | Локальные `$slider-thumb-size`, `$slider-track-height`, `margin-top` через `math.div` | 🟢 |
| F7 | `_password-display.scss:46`, `_settings.scss:56,188`, `_strength.scss:54` | `color: var(--color-grey-200)` дублирует цвет, унаследованный от `:root` | Удалить | 🟢 |
| F8 | `_password-display.scss:108` | `calc(17.5rem / 16)` — единственное место, где px пересчитан формулой, а не записан `rem` + комментарий | `1.09375rem; // 17.5` | 🟢 |

## TypeScript

| ID | Файл | Проблема | Решение | Риск |
| --- | --- | --- | --- | --- |
| F9 | `src/main.ts:53-55,147-170` | `resetCopyStatus` + `showCopiedStatus` вручную повторяют протокол `createAnnouncer` (очистить → пауза → записать), плюс отдельный модульный таймер | Опциональный `hideAfterMs` в `createAnnouncer`; статус копирования — третий announcer | 🟡 тайминги |
| F10 | `src/main.ts:226-237` | Две одинаковые ветки валидации (`announce('')` + `setHint` + `return`); submit смешивает проверку и генерацию | Функция `getSettingsHint(length, setCount): string` — пустая строка = настройки валидны | 🟢 |

## Рассмотрено и НЕ объединяем

- `display: flex; flex-direction: column; gap` ×5 — три строки раскладки читаются лучше миксина.
- «preset-4 на mobile → preset-3 на tablet» ×5 — общий миксин разнёс бы media query по каждому элементу и сломал единый tablet-блок компонента.
- `&:empty { visually-hidden }` ×2 — разные live region с разными комментариями «зачем»; миксин уже есть.
- 4 одинаковых `.settings__option` в HTML — статическая разметка без шаблонизатора; генерировать через TS ради DRY — потеря прогрессивного улучшения.
- `28px` у `.strength__bar` и у ползунка — совпадение чисел, а не смысла.
