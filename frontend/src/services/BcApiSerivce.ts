import { ODataResponse } from '@/@types/api'
import BcBaseService from './BcBaseService'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
export interface ApiRequestConfig {
    companyId: string;
    systemId?: string;
    filterQuery?: string;
    data?: any;
    customEndpoint?: string;
    type?: "approval" | "submitApplication";
    etag?: string;
  }
const BcApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>
    ) {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            BcBaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },
}

export default BcApiService

export abstract class BaseApiService {
    protected abstract endpoint: string;
    protected abstract version: string;
    protected abstract module: string;
  
    protected getBaseUrl(): string {
      return `/api/${this.module}/${this.version}`;
    }
  
    protected getUrl(config: ApiRequestConfig) {
      const { companyId, systemId, filterQuery, type } = config;
      const finalEndpoint = config.customEndpoint
        ? config.customEndpoint
        : this.endpoint;
      const baseUrl = `${this.getBaseUrl()}/${finalEndpoint}`;
      if (systemId) {
        return `${baseUrl}(${systemId})?Company=${companyId}${
          filterQuery ? `&${filterQuery}` : ""
        }`;
      }
      if (type) {
        return `/ODataV4/${finalEndpoint}?Company=${companyId}`;
      }
  
      return `${baseUrl}?Company=${companyId}${
        filterQuery ? `&${filterQuery}` : ""
      }`;
    }
  
    async get<T>(config: ApiRequestConfig): Promise<T[]> {
      const response = await BcApiService.fetchData<ODataResponse<T>>({
        url: this.getUrl(config),
        method: "GET",
      });
      return response.data.value;
    }
  
    async getById<T>(config: ApiRequestConfig): Promise<T> {
      const response = await BcApiService.fetchData<T>({
        url: this.getUrl(config),
        method: "GET",
      });
      return response.data;
    }
    async create<T>(config: ApiRequestConfig) {
      return BcApiService.fetchData<T>({
        url: this.getUrl(config),
        method: "POST",
        data: config.data,
      });
    }
  
    async update<T>(config: ApiRequestConfig) {
      return BcApiService.fetchData<T>({
        url: this.getUrl(config),
        method: "PATCH",
        data: config.data,
        headers: {
          "If-Match": config.etag,
        },
      });
    }
  
    async delete(config: ApiRequestConfig) {
      return BcApiService.fetchData({
        url: this.getUrl(config),
        method: "DELETE",
      });
    }
  }
  
  