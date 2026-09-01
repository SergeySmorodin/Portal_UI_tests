# Отчеты

https://sergeysmorodin.github.io/Portal_UI_tests/

# Инициализация Playwright проекта

`npm init playwright@latest`

# Установить

- Type Script
  `npm install -D typescript @types/node`
- Для .env файлов
  `npm install -D dotenv`
- Для форматирования кода
  `npm install -D prettier`

# Создать tsconfig.json

`npx tsc --init`

# Линтер и форматирование

- Проверить линтером (ESLint):
  `npm run lint`
- Автоисправить по линтеру:
  `npm run lint:fix`
- Проверить форматирование (Prettier, ничего не меняет):
  `npm run format:check`
- Исправить форматирование:
  `npm run format`

# Проверка типов

`npm run typecheck`

# Единая проверка (lint + формат + типы)

`npm run check`

# Запустить тесты

- Все тесты: `npm test`
- По области:
  - `npm run test:login` — авторизация
  - `npm run test:main` — главная страница
  - `npm run test:lk` — профиль (ЛК)
  - `npm run test:tdo` — договоры/проекты
  - `npm run test:counterparties` — компании/кураторы
  - `npm run test:certification` — сертификация
  - `npm run test:workflows` — multi-user сценарии
- Головной режим: `npm run test:headed`
- UI-режим: `npm run test:ui`

# Сохранить историю отчета

`npm run report:save`

# Посмотреть отчет

`npx playwright show-report`
