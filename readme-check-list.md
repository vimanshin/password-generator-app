# Шаблон Vite + TypeScript + SCSS

Стартовая заготовка для учебных frontend-проектов: Vite, TypeScript в строгом режиме, SCSS с mobile-first, Prettier, ESLint и Stylelint. Настроена под работу с Claude Code: главная инструкция — `AGENTS.md`, субагенты, skills и правила — в `.claude/`.

> Claude Code читает `AGENTS.md` только если в проекте **нет** `CLAUDE.md` (нужна версия v2.1.277+). Не создавай `CLAUDE.md` рядом — иначе `AGENTS.md` будет молча проигнорирован. Исключение: в сессиях без телеметрии и через Amazon Bedrock `AGENTS.md` не читается — там нужен `CLAUDE.md` из одной строки `@AGENTS.md`.

---

## Быстрый старт

Нужен **Node 24 или новее** — версия закреплена в `engines` и `.nvmrc`. Проверить текущую: `node -v`. Если пользуешься менеджером версий Node:

```bash
nvm use      # nvm для macOS/Linux: сам читает версию из .nvmrc
nvm use 24   # nvm-windows: версию нужно указать явно
```

Затем:

```bash
npm install
npm run dev
```

Откроется `http://localhost:5173/` с пустой страницей — демо-контента в шаблоне нет.

> Мажорная версия `@types/node` в `package.json` намеренно совпадает с версией Node. Будешь переходить на Node новее — подними и типы: иначе они пообещают API, которого в твоём Node нет, и код упадёт уже после успешной проверки.

> `typescript` закреплён на `~6.0` намеренно: `typescript-eslint` пока поддерживает только TypeScript ниже 6.1. Не поднимай TypeScript до 7, пока это ограничение не снимут — проверить: `npm view typescript-eslint peerDependencies`.

---

## Чек-лист нового проекта

Пройди сверху вниз — займёт минут десять и убережёт от сюрпризов на деплое.

### 1. Переименовать проект

- [ ] `package.json` → поле `name`: заменить `project-name` на имя проекта (латиница, kebab-case)
- [ ] `index.html` → `<title>`: заменить `Название проекта`
- [ ] `index.html` → `<html lang="ru">`: язык **реального контента**. Если тексты английские — поставить `en`

### 2. Проверить базовый путь

- [ ] `vite.config.ts` → `base`

Оставь `'/'`, если сайт живёт в корне домена. Для GitHub Pages и любого размещения в подпапке поставь `'/имя-репозитория/'` — иначе абсолютные ссылки вида `/icons.svg` дадут 404, а сборка об этом не предупредит.

### 3. Добавить графику

- [ ] `public/favicon.svg` — свой favicon и строка `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` в `<head>` файла `index.html`
- [ ] `public/icons.svg` — SVG-спрайт, если он нужен проекту (оптимизатор изображений в `vite.config.ts` его намеренно не трогает)
- [ ] `src/assets/` — картинки и шрифты макета

> `public/` — для файлов с неизменным URL. Всё остальное клади в `src/assets/` и импортируй: тогда Vite добавит хеш в имя и настроит кеширование. Файлы `.gitkeep` в пустых папках нужны только чтобы git сохранил структуру — удали их, когда в папке появятся настоящие файлы.

### 4. Задать токены макета

- [ ] `src/scss/base/_global.scss` — цвета, шрифты и другие CSS-переменные из Figma в `:root`
- [ ] `src/scss/abstracts/_variables.scss` — проверить брейкпоинты `768px` / `1024px` под макет

### 5. Проверить, что всё живо

```bash
npm run check
```

### 6. Поставить проект под git

- [ ] Создать репозиторий и первый коммит чистого шаблона:

```bash
git init
git add .
git commit -m "chore: чистый шаблон"
```

Без git не работают `/code-review` и `/refactor`, а первый коммит — точка, к которой всегда можно откатиться.

---

## Работа с Claude Code

1. `/project-plan <ссылка на Figma с node-id>` — Claude изучит макет и предложит план по этапам. План сохраняется в `plan-project/`, поэтому работу можно продолжить в новой сессии.
2. На каждом этапе субагенты `html-writer`, `scss-writer`, `ts-writer` дают код в чат, ты переносишь его руками и сообщаешь о готовности. Записать код в файл сам Claude будет только по флагу `--write` или прямой просьбе.
3. Claude проверяет этап: `npm run check`, сверка с Figma, рендер на mobile/tablet/desktop через Playwright.
4. В конце — `final-review`: полная проверка проекта и соответствия макету.
5. Когда вёрстка готова — `/refactor` для чистки кода без изменения внешнего вида.

После изменения `AGENTS.md` или файлов в `.claude/` перезапусти сессию: инструкции загружаются при старте.

**Плагины и коннекторы.** `.claude/settings.json` включает только плагин Playwright — он нужен для проверки рендера. `/code-review` встроен в Claude Code, отдельный плагин `code-review` не ставь: он лишь дублирует команду. Figma подключается коннектором в настройках claude.ai, а не плагином.

---

## Команды

| Команда                   | Что делает                                                     |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Dev-сервер с горячей перезагрузкой                             |
| `npm run typecheck`       | Только проверка типов, без сборки — быстро                     |
| `npm run build`           | Проверка типов, затем production-сборка в `dist/`              |
| `npm run preview`         | Локальный просмотр собранного `dist/`                          |
| `npm run check`           | Prettier + Stylelint + ESLint + `build`. Основная перед сдачей |
| `npm run format`          | Prettier переписывает файлы                                    |
| `npm run format:check`    | Prettier только проверяет форматирование, ничего не меняя      |
| `npm run lint:ts`         | ESLint: `any`, `!`, лишние `as`, забытый `console`, `==`       |
| `npm run lint:ts:fix`     | ESLint чинит, что умеет, автоматически                         |
| `npm run lint:styles`     | Stylelint: порядок свойств, BEM, `!important`                  |
| `npm run lint:styles:fix` | Stylelint чинит стили автоматически                            |

**Важно:** Vite не проверяет типы — он их срезает при сборке. Проверку делает `tsc --noEmit`, встроенный в `build`. Поэтому зелёный `vite build` сам по себе ничего не доказывает, а `npm run build` — доказывает.

---

## Структура

```text
├── AGENTS.md                     # главная инструкция для Claude Code
├── .claude/                      # субагенты, skills, rules, настройки
├── index.html
├── public/                       # файлы с неизменным URL: favicon, спрайт
├── src/
│   ├── assets/                   # картинки и шрифты, импортируемые из кода
│   ├── scss/
│   │   ├── abstracts/
│   │   │   ├── _variables.scss   # брейкпоинты и другие $-токены сборки
│   │   │   └── _mixins.scss      # tablet/desktop, visually-hidden, reduced-motion
│   │   ├── base/
│   │   │   └── _global.scss      # CSS-переменные, reset, базовые элементы
│   │   └── components/           # по файлу на блок
│   ├── main.ts                   # точка входа TypeScript
│   └── style.scss                # точка сборки стилей, только @use
├── eslint.config.js              # правила ESLint
├── stylelint.config.mjs          # правила Stylelint: BEM, порядок свойств
├── package.json                  # зависимости и npm-скрипты
├── tsconfig.json                 # настройки проверки типов
└── vite.config.ts                # сборка, алиас @, оптимизация картинок
```

Правь только `index.html`, `src/` и `public/`. Папка `dist/` создаётся сборкой — её не редактируют.

---

## Как пользоваться каркасом SCSS

`style.scss` — только точка сборки, правил в нём нет. Новый блок:

1. создай `src/scss/components/_имя-блока.scss`;
2. подключи его в `src/style.scss` строкой `@use 'scss/components/имя-блока';`;
3. внутри партиала подключи то, что нужно: `@use '../abstracts/mixins';`

`abstracts/` не подключается в `style.scss` намеренно: переменные и миксины сами по себе ничего не выводят в CSS, их импортирует тот файл, которому они нужны.

```scss
@use '../abstracts/mixins';

.card {
  // Базовые стили — мобильные, без media query
  padding: 1rem;

  &__title {
    font-size: 1.25rem;

    @include mixins.desktop {
      font-size: 1.75rem;
    }
  }

  // Медиа-правила — в конце блока, после вложенных селекторов
  @include mixins.tablet {
    padding: 2rem;
  }
}
```

Порядок внутри блока проверяет Stylelint: свойства → вложенные селекторы → `@include` и `@media`.

Готовые миксины: `tablet` (от 768px), `desktop` (от 1024px), `tablet-only` (закрытый диапазон), `visually-hidden`, `reduced-motion`.

---

## Правила кода

Общие правила — в `AGENTS.md`, подробные по HTML, SCSS и TypeScript — в инструкциях субагентов (`.claude/agents/`). Коротко:

**Кто что проверяет**

- `tsc` — сходятся ли типы
- ESLint (`eslint.config.js`) — хороший ли это код: `any`, `!`, лишние `as`, `==`, забытый `console`
- Prettier — как всё отформатировано
- Stylelint — SCSS: порядок свойств и BEM

Границы не размыты намеренно: правил форматирования в ESLint нет, а проверок типов нет в Stylelint.

**TypeScript**

- Строгий режим: `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
- `any` и non-null assertion `!` не используются. Если элемент может отсутствовать — проверка на `null` и early return
- `enum` и `namespace` запрещены настройкой `erasableSyntaxOnly`: наборы констант оформляй через `as const`
- Импорт только типов пишется как `import type`
- Экспортируемым функциям — явные типы параметров и результата. Локальным переменным тип обычно не нужен
- В `src/` не используй `process`, `Buffer`, `require` и `node:*`: типы Node видны во всём проекте ради `vite.config.ts`, поэтому `tsc` промолчит, а браузер упадёт. Вместо `process.env` — `import.meta.env`

**SCSS**

- BEM: `.block`, `.block__element`, `.block--modifier`
- Mobile-first: базовые стили без media query, расширения через миксины
- Media Queries Level 4: `@media (width >= 768px)`, не `min-width`
- Порядок свойств задаёт `stylelint-config-recess-order`

**HTML**

- Семантические теги, один `h1`, осмысленный `alt` у изображений
- JS-хуки через `data-js`, отдельно от классов стилей

---

## Алиас `@`

`@` указывает на `src/`:

```ts
import '@/style.scss';
```

Он объявлен **в двух местах** — `resolve.alias` в `vite.config.ts` и `paths` в `tsconfig.json`. Если поменяешь в одном, поменяй и в другом: иначе сборка пройдёт, а редактор подчеркнёт импорт красным (или наоборот).
