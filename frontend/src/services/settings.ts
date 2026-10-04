import { CompanySettings } from '@/types';
import { initialCompanySettings } from '@/constants/mockData';

/**
 * Constant Company Settings Service
 * Store settings are fixed constants and not retrieved from or stored in any database.
 */
export const settingsService = {
  async getSettings(): Promise<CompanySettings> {
    return initialCompanySettings;
  },

  async getCompanySettings(): Promise<CompanySettings> {
    return initialCompanySettings;
  },

  async updateCompanySettings(_payload?: any, _customClient?: any): Promise<CompanySettings> {
    return initialCompanySettings;
  },
};
