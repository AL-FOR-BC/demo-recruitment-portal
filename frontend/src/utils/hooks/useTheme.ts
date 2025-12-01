import { useConfig } from "@/ui/ConfigProvider/ConfigProvider";
import logo from "@/assets/logo-rom.png"; // Fallback logo

/**
 * Custom hook to access theme configuration (logo and primary color)
 * Use this hook anywhere you need the theme color or logo
 */
export const useTheme = () => {
  const { primaryColor, logo: configLogo } = useConfig();

  return {
    primaryColor: primaryColor || "#094BAC",
    logo: configLogo || logo,
  };
};

export default useTheme;
