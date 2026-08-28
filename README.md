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

# Проверить типы

`npx tsc --noEmit`

# Запустить тесты

`npm test`

# Сохранить историю отчета

`npm run report:save`

# Посмотреть отчет

`npx playwright show-report`
