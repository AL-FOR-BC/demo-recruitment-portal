import { useTheme } from "@/utils/hooks/useTheme";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  className?: string;
  variant?: "default" | "button"; // button variant is white for buttons
}

/**
 * Reusable spinner component that uses theme color by default
 * Use variant="button" for white spinners on colored buttons
 */
export const Spinner = ({
  size = "md",
  color,
  className = "",
  variant = "default",
}: SpinnerProps) => {
  const { primaryColor } = useTheme();
  const themeColor = color || primaryColor || "#094BAC";

  const sizeMap = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (variant === "button") {
    return (
      <div
        className={`${sizeMap[size]} border-2 border-white/30 border-t-white rounded-full animate-spin ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} border-2 rounded-full animate-spin ${className}`}
      style={{
        borderColor: `${themeColor}30`,
        borderTopColor: themeColor,
      }}
    />
  );
};

/**
 * Full page spinner with theme color
 */
export const PageSpinner = ({
  color,
  className = "",
}: {
  color?: string;
  className?: string;
}) => {
  const { primaryColor } = useTheme();
  const themeColor = color || primaryColor || "#094BAC";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
        style={{ borderColor: themeColor }}
      />
    </div>
  );
};

export default Spinner;
