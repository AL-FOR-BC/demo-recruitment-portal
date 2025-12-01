import { useTheme } from "@/utils/hooks/useTheme";

interface LoadingProps {
  loading?: boolean;
  cover?: boolean;
  align?: "center" | "top";
  customLoader?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
}

const Loading = ({
  loading = true,
  cover = false,
  customLoader,
  size = "md",
  color,
  text = "Loading...",
}: LoadingProps) => {
  const { primaryColor } = useTheme();
  const themeColor = color || primaryColor || "#094BAC";

  if (!loading) return null;

  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const spinnerSize = sizeMap[size];

  const loadingClass = "flex flex-col gap-4 items-center";

  const containerClass = cover
    ? "fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center"
    : "w-full h-[100vh] flex items-center justify-center";

  return (
    <div className={containerClass}>
      <div className={loadingClass}>
        {customLoader || (
          <>
            <div className="relative">
              <div
                className={`${spinnerSize} rounded-full animate-spin border-t-2 border-b-2`}
                style={{ borderColor: themeColor }}
              />
            </div>
            {text && (
              <div
                style={{ color: themeColor }}
                className="text-sm font-medium"
              >
                {text}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Loading;
