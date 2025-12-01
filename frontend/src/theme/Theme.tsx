import { useEffect } from "react";
import { CommonProps } from "@/@types/common";
import ConfigProvider from "@/ui/ConfigProvider/ConfigProvider";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchSettings } from "@/store/slices/app/settingsSlice";
import logo from "@/assets/logo-rom.png"; // Fallback logo

function Theme(props: CommonProps) {
  const dispatch = useAppDispatch();

  // Safely access settings with fallbacks
  let companyLogo: string | null = null;
  let themeColor = "#094BAC"; // Default color

  try {
    const settings = useAppSelector((state) => {
      try {
        return state.app?.settings;
      } catch {
        return null;
      }
    });

    if (settings) {
      companyLogo = settings.companyLogo || null;
      themeColor = settings.themeColor || "#094BAC";
    }
  } catch (error) {
    console.error("Error accessing settings:", error);
    // Use defaults if settings access fails
  }

  // Fetch settings immediately - don't block rendering if it fails
  useEffect(() => {
    const fetchSettingsAsync = async () => {
      try {
        await dispatch(fetchSettings()).unwrap();
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        // Continue with defaults - don't crash the app
      }
    };

    // Fetch settings immediately on mount
    fetchSettingsAsync();
  }, [dispatch]);

  const currentTheme = {
    primaryColor: themeColor || "#094BAC",
    logo: companyLogo || logo || "", // Use API logo or fallback
    updateTheme: () => {},
  };

  return <ConfigProvider value={currentTheme}>{props.children}</ConfigProvider>;
}
export default Theme;
