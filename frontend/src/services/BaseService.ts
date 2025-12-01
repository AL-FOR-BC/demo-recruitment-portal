import axios, { AxiosError } from "axios";
import appConfig from "@/configs/app.config";
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from "@/constants/api.constant";
import { PERSIST_STORE_NAME } from "@/constants/app.constant";
import deepParseJson from "@/utils/deepParseJson";
import store, { signOutSuccess } from "../store";
import { toast } from "react-toastify";

// const unauthorizedCode = [401];
const environment = "development" as "development" | "production" | "test";

const BaseService = axios.create({
  timeout: 60000,
  baseURL:
    environment === "development"
      ? "http://localhost:8001/api"
      : appConfig.apiPrefix,
});

BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
    const persistData = deepParseJson(rawPersistData);
    console.log("persistData", persistData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let accessToken = (persistData as any).auth.session.signature;

    if (!accessToken) {
      const { auth } = store.getState();
      accessToken = auth.session.signature;
    }

    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BaseService.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          return Promise.reject({
            message: data.message || "Bad Request",
            statusCode: status,
          });
        case 401:
          // Handle unauthorized access
          store.dispatch(signOutSuccess());
          toast.error("Session expired. Please sign in again.");
          return Promise.reject({
            message: "Session expired. Please sign in again.",
            statusCode: status,
          });
        case 403:
          return Promise.reject({
            message: data.message || "Access forbidden",
            statusCode: status,
          });
        case 404:
          return Promise.reject({
            message: data.message || "Resource not found",
            statusCode: status,
          });
        case 500:
          toast.error("Internal server error. Please try again later.");
          return Promise.reject({
            message: "Internal server error. Please try again later.",
            statusCode: status,
          });
        default:
          return Promise.reject({
            message: data.message || "An unexpected error occurred",
            statusCode: status,
          });
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("Network error. Please check your connection.");
      return Promise.reject({
        message: "Network Error",
        statusCode: 0,
      });
    } else {
      // Something happened in setting up the request
      return Promise.reject({
        message: error.message,
        statusCode: 0,
      });
    }
  }
);

export default BaseService;
