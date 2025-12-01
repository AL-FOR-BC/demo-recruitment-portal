import { useAppSelector } from "@/store";

/**
 * Hook to get the company name from settings
 * Returns "ROM" as fallback if company name is not set
 */
export const useCompanyName = (): string => {
  const companyName = useAppSelector((state) => {
    // Safely access settings with fallback - check both paths
    try {
      // Try app.settings first (since settings is under app state)
      const settings = state.app?.settings;
      if (settings?.companyName) {
        return settings.companyName;
      }
    } catch (error) {
      // Ignore errors, use fallback
      console.error("Error accessing company name from settings:", error);
    }
    return "ROM"; // Default fallback
  });

  // Ensure we always return a string
  return companyName || "ROM";
};
