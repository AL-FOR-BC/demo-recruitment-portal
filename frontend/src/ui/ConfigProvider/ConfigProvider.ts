import { createContext, useContext } from "react";
interface Config {
  primaryColor: string;
  logo: string;
  updateTheme: (color: string, logo: string) => void;
}
export const defaultConfig = {
  primaryColor: "#0D55A3",
  logo: "",
  updateTheme: () => {},
} as const;

export const ConfigContext = createContext<Config>(defaultConfig);


const ConfigProvider = ConfigContext.Provider

export const ConfigConsumer = ConfigContext.Consumer

export function useConfig() {
    return useContext(ConfigContext)
}

export default ConfigProvider
