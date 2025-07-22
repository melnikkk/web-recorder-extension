import { ChromeAPIError } from '../error-handling';
import { getAuthToken } from '../../features/auth';

interface Config {
  BE_URL: string;
}

const defaultConfig: Config = {
  BE_URL: import.meta.env.VITE_BE_URL || 'http://localhost:8080',
};

export class ConfigService {
  private static instance: ConfigService;
  private config: Config = defaultConfig;

  private constructor() {}

  public static async getInstance(): Promise<ConfigService> {
    if (!ConfigService.instance) {
      const instance = new ConfigService();

      await instance.loadFromStorage();

      ConfigService.instance = instance;
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

  public get current(): Config {
    return this.config;
  }

  public get backendUrl(): string {
    return this.config.BE_URL;
  }

  public async getAuthToken(): Promise<string | null> {
    return await getAuthToken();
  }

  public async set(newConfig: Partial<Config>): Promise<void> {
    this.config = { ...this.config, ...newConfig };

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
