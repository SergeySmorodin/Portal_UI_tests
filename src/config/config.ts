export interface VPNConfig {
    siteUrl: string;
    login: string;
    password: string;
    timeout: number;
    headless: boolean;
  }
  
  // Просто читаем переменные окружения (уже загружены в playwright.config.ts)
  export const config: VPNConfig = {
    siteUrl: process.env.BASE_URL || 'https://example.com',
    login: process.env.LOGIN || '',
    password: process.env.PASSWORD || '',
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '3000', 10),
    headless: (process.env.HEADLESS || 'false').toLowerCase() === 'true',
  };
  