export interface VPNConfig {
  siteUrl: string;
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

// Читаем переменные окружения (уже загружены в playwright.config.ts)
export const config: VPNConfig = {
  siteUrl: process.env.BASE_URL || 'https://example.com',
  login: process.env.LOGIN || '',
  password: process.env.PASSWORD || '',
  headless: (process.env.HEADLESS || 'false').toLowerCase() === 'true',
  timeouts: {
    short: base,
    normal: base * 2,
    long: base * 3,
  },
};
