import { ChromeAPIError } from '../error-handling';

export const ENV = {
  BE_URL: import.meta.env.VITE_BE_URL || 'http://localhost:8080',
};

export class ConfigService {
  private static instance: ConfigService;
  private config: Record<string, string> = {};

  private constructor() {
    this.config = {
      BE_URL: ENV.BE_URL,
    };

    this.loadFromStorage();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }

    return ConfigService.instance;
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const data = await chrome.storage.local.get('config');
      if (data.config) {
        this.config = { ...this.config, ...data.config };
      }
    } catch (error) {
      const chromeError = new ChromeAPIError(
        'Failed to load config from storage',
        'chrome.storage.local.get',
        error instanceof Error ? error : new Error(String(error)),
      );

      throw chromeError;
    }
  }

  public get(key: string): string {
    return this.config[key] || '';
  }

  public getBackendUrl(): string {
    return this.get('BE_URL');
  }

  public async set(key: string, value: string): Promise<void> {
    this.config[key] = value;

    try {
      await chrome.storage.local.set({ config: this.config });
    } catch (error) {
      const chromeError = new ChromeAPIError(
        'Failed to save config to storage',
        'chrome.storage.local.set',
        error instanceof Error ? error : new Error(String(error)),
      );

      throw chromeError;
    }
  }
}
