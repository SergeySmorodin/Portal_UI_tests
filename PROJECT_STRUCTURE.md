# Portal_UI_tests — структура проекта и анализ

## Обзор

Проект — автотесты UI на **Playwright + TypeScript** для web-портала. Архитектура — **Page Object Model (POM)** с разделением на локаторы, данные и фикстуры. Код — на **ESM** (`"type": "module"` в `package.json`), TypeScript-часть транслируется Playwright'ом. Авторизация — через `global-setup` + `storageState` (логин выполняется один раз, состояние переиспользуется тестами). Поддерживается multi-user запуск (несколько аккаунтов через `LOGIN_2/3`). Тесты запускаются через npm-скрипты, отчёты публикуются на GitHub Pages.

---

## Дерево проекта

```
Portal_UI_tests/
├── .env                      # Секреты/конфигурация (в gitignore)
├── .env.example              # Шаблон переменных окружения (вкл. LOGIN_2/PASSWORD_2)
├── .gitignore
├── .prettierrc               # Конфиг форматирования
├── eslint.config.mjs         # ESLint (eslint recommended + typescript-eslint + prettier)
├── package.json              # Скрипты и зависимости; "type": "module"
├── playwright.config.ts      # Конфигурация Playwright (проекты, storageState)
├── global-setup.ts           # Единый логин → сохранение storageState в playwright/.auth/
├── tsconfig.json             # Конфигурация TypeScript
├── README.md                 # Инструкции по установке/запуску
│
├── playwright-report/        # HTML-отчёт (генерируется)
├── test-results/             # Артефакты (генерируется)
├── test-results.json         # JSON-отчёт (генерируется)
├── playwright/.auth/         # storageState пользователей (генерируется, в gitignore)
│
├── scripts/
│   ├── save-report.js        # Сборка/публикация отчёта в ветку reports + GH Pages (ESM)
│   └── recon/                # Разовые вспомогательные развед-скрипты (ESM, *.mjs)
│
└── src/
    ├── config/
    │   └── config.ts         # Чтение env; ВАЛИДАЦИЯ LOGIN/PASSWORD (fail-fast); таймауты
    │
    ├── types/
    │   └── index.ts          # Интерфейсы данных (UserCredentials, Contract, Company, ...)
    │
    ├── data/                 # «Фабрики» тестовых данных
    │   ├── api.ts                     # Пути API-эндпоинтов
    │   ├── user-factory.ts            # admin/regular/withWrongPassword/empty (без захардкоженных кред)
    │   ├── company-factory.ts         # валидный ИНН/ОГРН (контрольные суммы)
    │   ├── contract-factory.ts
    │   ├── curator-factory.ts
    │   ├── project-factory.ts
    │   └── certification-factory.ts
    │
    ├── utils/
    │   └── date.ts           # Утилиты дат (formatDmy/formatYmd, сегодня, +месяцы/годы, random)
    │
    ├── locators/             # Локаторы, выделенные в отдельные модули
    │   ├── login-page.locators.ts
    │   ├── main-page.locators.ts
    │   ├── lk-page.locators.ts
    │   ├── contract-page.locators.ts   # вкл. managerToggle/workTypeSelect для строк договора
    │   ├── project-page.locators.ts
    │   ├── company-page.locators.ts
    │   ├── curator-page.locators.ts
    │   ├── certification-page.locators.ts
    │   └── header.locators.ts
    │
    ├── pages/                # Page Object-модели (фабричные функции)
    │   ├── base-page.ts              # Общие действия + хелперы выпадающих списков
    │   ├── login/login-page.ts
    │   ├── main/main-page.ts
    │   ├── profile/lk-page.ts
    │   ├── tdo/contract-page.ts      # + createContractsListPage
    │   ├── tdo/project-page.ts       # + createProjectsListPage
    │   ├── counterparties/company-page.ts  # + createCompaniesListPage
    │   ├── counterparties/curator-page.ts  # + createCuratorsListPage
    │   └── certification/certification-page.ts
    │
    ├── fixtures/
    │   └── test-fixtures.ts  # Кастомные fixtures: страницы + testConfig + createUserPage
    │
    └── tests/                # Спеки, сгруппированы по функционалу (по директориям)
        ├── login_page/login-page.spec.ts
        ├── main_page/main-page.spec.ts
        ├── profile_page/lk-page.spec.ts
        ├── tdo_page/contract-page.spec.ts
        ├── tdo_page/project-page.spec.ts
        ├── counterparties_page/company-page.spec.ts
        ├── counterparties_page/curator-page.spec.ts
        ├── certification_page/certification-page.spec.ts
        └── workflows/example-multi-user.spec.ts   # шаблон multi-user сценария
```

---

## Авторизация и multi-user

- **`global-setup.ts`** запускается до тестов: открывает браузер, логинится и сохраняет `storageState` каждого пользователя в `playwright/.auth/<id>.json`.
- `playwright.config.ts` подключает `globalSetup` и задаёт `storageState` для основных проектов; отдельный проект `chromium-login` (без `storageState`) используется для тестов самой авторизации.
- Основной пользователь — `user1` (логин/пароль из `LOGIN`/`PASSWORD`). Доп. пользователи `user2`/`user3` добавляются автоматически, если заданы `LOGIN_2/PASSWORD_2` (и `_3`).
- Фикстура `createUserPage(userId)` создаёт `{ page, context }` из сохранённого `storageState` конкретного пользователя — для multi-user сценариев.
- Фикстура `authenticatedPage` — пас-сквозная (на вход идёт `page` уже авторизованный через `storageState`).

## Как устроен слой (паттерны)

### Page Object (`src/pages/*`)
Каждая страница — **фабричная функция** `createXxxPage(page)`, возвращает объект методов. Все модели наследуют базовые действия через `...createBasePage(page)`. Отдельно вынесены страницы-«списки» (`createContractsListPage`, `createProjectsListPage`, `createCompaniesListPage`, `createCuratorsListPage`, `createCertificationSearchPage`).

`base-page.ts` содержит общие действия (`navigate/openRelative/click/fill`) и хелперы выпадающих списков: `selectRandomOption`, `selectRandomFromList`, `openSearchableDropdown`, `selectRandomFromSearchable`, `addRowAndSelectFromSearchable`, `addRowAndSelectRandomOption`. Хелперы **проверяют пустой список** и бросают внятную ошибку вместо `NaN`-индекса.

### Локаторы (`src/locators/*`)
Локаторы каждой страницы выделены в собственную фабрику `createXxxPageLocators(page)`. Часть локаторов — «умные» (по ролям/тексту: `getByRole`, `getByText`, `getByPlaceholder`). Часть — привязана к вёрстке UI-фреймворка (`.max-h-60`, `button:has(i.fa-chevron-down)`, `select:not([name="status"])`) — такие сосредоточены в модулях локаторов для удобства сопровождения.

### Данные (`src/data/*`)
`xxxFactory.xxx(overrides)` генерируют тестовые объекты (уникальные имена, контрольные суммы ИНН/ОГРН, даты через `src/utils/date.ts`). `api.ts` хранит пути API для проверки ответов в `runAndCheckResponse`. Креды не захардкожены — берутся из `config` (валидированный `.env`).

### Fixtures (`src/fixtures/test-fixtures.ts`)
Наследуют `test` Playwright и инжектят все Page Object'ы. Дополнительно:
- `testConfig` — экземпляр конфигурации;
- `authenticatedPage` — авторизованная `page` (через `storageState`);
- `createUserPage(userId)` — создание `{page, context}` под конкретного пользователя для multi-user.

### Конфигурация
- `playwright.config.ts` и `global-setup.ts` читают `.env`; ключевой момент — загрузка `dotenv` **первым импортом** (из-за хойстинга ESM-импортов), иначе `config` вычислится до загрузки env.
- `src/config/config.ts` читает env и **валидирует** наличие `LOGIN`/`PASSWORD` — при их отсутствии падает с понятной ошибкой вместо подстановки фейковых кредов.
- В проекте нет хардкода `BASE_URL` в POM (используются относительные пути `openRelative` + `baseURL` Playwright).

---

## npm-скрипты

- `npm test` — весь набор; `test:headed`, `test:ui`, `test:debug`, `test:report`, `test:chromium`.
- Per-area скрипты **по директориям** (новые спеки подхватываются сами): `test:login`, `test:main`, `test:lk`, `test:tdo`, `test:counterparties`, `test:certification`, `test:workflows`.
- Качество: `lint`, `lint:fix`, `format`, `format:check`, `typecheck` (`tsc --noEmit`), единый `check` = `lint && format:check && typecheck`.
- `report:save` — публикация истории отчётов.

