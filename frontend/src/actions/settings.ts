'use server';

import { CompanySettingsFormValues } from '@/schemas/settings';
import { initialCompanySettings } from '@/constants/mockData';
import { CompanySettings } from '@/types';

export async function updateCompanySettingsAction(
  _formData: CompanySettingsFormValues
): Promise<{ success: boolean; message: string; data: CompanySettings; error?: string }> {
  return {
    success: true,
    message: 'Store settings are constant and managed directly in code.',
    data: initialCompanySettings,
  };
}
