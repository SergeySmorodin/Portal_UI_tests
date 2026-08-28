export interface AppConfig {
  login: string;
  password: string;
  headless: boolean;
  timeouts: {
    short: number;
    normal: number;
    long: number;
  };
}

const base = parseInt(process.env.DEFAULT_TIMEOUT || '5000', 10);

const login = process.env.LOGIN;
const password = process.env.PASSWORD;
if (!login || !password) {
  throw new Error('LOGIN and PASSWORD must be set in the .env file');
}

// Читаем переменные окружения (уже загружены в playwright.config.ts)
export const config: AppConfig = {
  login,
  password,
  headless: (process.env.HEADLESS || 'false').toLowerCase() === 'true',
  timeouts: {
    short: base,
    normal: base * 2,
    long: base * 3,
  },
};
