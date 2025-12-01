import { useTheme } from "./useTheme";

/**
 * Hook to get button styles with theme color
 * Returns className and style object for buttons
 */
export const useButtonStyles = () => {
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#094BAC";

  return {
    primary: {
      className: "text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
      style: {
        backgroundColor: themeColor,
        "--hover-color": `${themeColor}E6`, // 90% opacity for hover
      } as React.CSSProperties,
      hoverStyle: {
        backgroundColor: `${themeColor}E6`, // 90% opacity
      },
    },
    outline: {
      className: "rounded-lg font-medium transition-colors border-2 disabled:opacity-50 disabled:cursor-not-allowed",
      style: {
        borderColor: themeColor,
        color: themeColor,
        backgroundColor: "transparent",
        "--hover-bg": `${themeColor}0D`, // 5% opacity for hover
      } as React.CSSProperties,
      hoverStyle: {
        backgroundColor: `${themeColor}0D`,
      },
    },
    getThemeColor: () => themeColor,
  };
};

export default useButtonStyles;

