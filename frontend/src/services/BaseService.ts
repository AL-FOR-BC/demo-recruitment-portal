import axios from "axios";
import appConfig from "@/configs/app.config";
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from "@/constants/api.constant";
import { PERSIST_STORE_NAME } from "@/constants/app.constant";
import deepParseJson from "@/utils/deepParseJson";
import store, { signOutSuccess } from "../store";
import { toast } from "react-toastify";

const unauthorizedCode = [401];
const environment = "production";

const BaseService = axios.create({
  timeout: 60000,
  baseURL: environment === "production" ? "/api-recruitment" : appConfig.apiPrefix,
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
  (error) => {
    const { response } = error;

    if (response && unauthorizedCode.includes(response.status)) {
      store.dispatch(signOutSuccess());
      toast.error("Session expired. Please sign in again.");
      return Promise.reject(error);
    }

    // Handle validation errors (400 Bad Request)
    if (response?.status === 400 && response.data) {
      if (response.data.errors?.length) {
        return Promise.reject({
          ...error,
          response: {
            ...response,
            data: {
              status: "400",
              errors: response.data.errors,
              message: response.data.message,
            },
          },
        });
      }
    }

    // Handle other errors
    if (response?.data?.message) {
      // toast.error(response.data.message);
    }
    // else if (response?.status === 404) {
    //   toast.error("Service not found");
    // }
    else if (response?.status === 500) {
      toast.error("Internal server error. Please try again later.");
    } else if (!response) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default BaseService;
