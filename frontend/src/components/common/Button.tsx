import { ButtonHTMLAttributes } from "react";
import useButtonStyles from "@/utils/hooks/useButtonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export const Button = ({
  children,
  variant = "primary",
  className = "",
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) => {
  const buttonStyles = useButtonStyles();
  const themeColor = buttonStyles.getThemeColor();
  
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  
  const getVariantStyles = () => {
    if (variant === "secondary") {
      return "bg-gray-600 text-white hover:bg-gray-700";
    }
    
    if (variant === "outline") {
      return {
        className: "border-2 text-white",
        style: {
          borderColor: themeColor,
          color: themeColor,
          backgroundColor: "transparent",
        },
      };
    }
    
    // Primary variant
    return {
      className: "text-white",
      style: {
        backgroundColor: themeColor,
      },
    };
  };

  const variantStyles = getVariantStyles();
  const isObject = typeof variantStyles === "object";
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isObject && variant === "primary") {
      e.currentTarget.style.backgroundColor = `${themeColor}E6`;
    } else if (isObject && variant === "outline") {
      e.currentTarget.style.backgroundColor = `${themeColor}0D`;
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isObject && variant === "primary") {
      e.currentTarget.style.backgroundColor = themeColor;
    } else if (isObject && variant === "outline") {
      e.currentTarget.style.backgroundColor = "transparent";
    }
    onMouseLeave?.(e);
  };

  return (
    <button
      className={`${baseStyles} ${isObject ? variantStyles.className : variantStyles} ${className}`}
      style={isObject ? { ...variantStyles.style, ...style } : style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};
