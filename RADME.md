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

# Проверка кода prettier

- Только проверка (ничего не меняет):
  `npx prettier --check .`
- Исправить форматирование:
  `npx prettier --write .`

# Проверить типы

`npx tsc --noEmit`

# Запустить тесты

`npm test`

# Посмотреть отчет

`npx playwright show-report`
