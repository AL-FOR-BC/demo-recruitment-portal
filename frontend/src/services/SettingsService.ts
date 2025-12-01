import ApiService from "./ApiService";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface SettingsResponse {
  success: boolean;
  data: {
    companyLogo: string | null;
    themeColor: string;
    companyName: string | null;
    help: string | null;
  };
}

export interface AllSettingsResponse {
  success: boolean;
  data: {
    allowCompanyChange: boolean;
    companyLogo: string | null;
    themeColor: string;
    companyName: string | null;
    help: string | null;
  };
}

class SettingsService {
  /**
   * Get settings (logo and theme color) for the recruitment portal
   * @param settingsId - Optional settings ID (defaults to "main")
   * @returns Promise with AxiosResponse containing settings data
   */
  async getSettings(settingsId?: string): Promise<AxiosResponse<SettingsResponse>> {
    const config: AxiosRequestConfig = {
      url: "/settings",
      method: "GET",
      params: settingsId ? { id: settingsId } : undefined,
    };

    return ApiService.fetchData<SettingsResponse>(config);
  }

  /**
   * Get all settings including allowCompanyChange
   * @param settingsId - Optional settings ID (defaults to "main")
   * @returns Promise with AxiosResponse containing all settings data
   */
  async getAllSettings(settingsId?: string): Promise<AxiosResponse<AllSettingsResponse>> {
    const config: AxiosRequestConfig = {
      url: "/settings/all",
      method: "GET",
      params: settingsId ? { id: settingsId } : undefined,
    };

    return ApiService.fetchData<AllSettingsResponse>(config);
  }
}

export const settingsService = new SettingsService();

