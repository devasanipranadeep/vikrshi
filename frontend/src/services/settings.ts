import { CompanySettings } from '@/types';
import { initialCompanySettings } from '@/constants/mockData';

export const settingsService = {
  /**
   * Fetch company settings as constant
   */
  async getSettings(_customClient?: any): Promise<CompanySettings> {
    return initialCompanySettings;
  },

  async getCompanySettings(_customClient?: any): Promise<CompanySettings> {
    return initialCompanySettings;
  },

  /**
   * Constant company settings cannot be modified
   */
  async updateCompanySettings(_payload: any, _customClient?: any): Promise<CompanySettings> {
    return initialCompanySettings;
  },
};
