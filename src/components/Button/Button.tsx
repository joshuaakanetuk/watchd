import React from "react";
import useButtonVariant from "./ButtonVariant";

enum BUTTON_SIZES {
  "xs" = "px-2 py-1 text-xs",
  "sm" = "px-2 py-1 text-sm",
  "md" = "px-2.5 py-1.5 text-sm",
}

interface ButtonProps {
  className: string;
  /**
   * Text to be displayed on button.
   */
  label: string;
  submit?: boolean;
  isLoading?: boolean;
  /**
   * Size of button to be rendered.
   */
  size: BUTTON_SIZES;
  variant: string;
  /**
   * Optional click handler
   */
  onClick?: (() => void) | (() => Promise<boolean>);
}

//  Left Icon
// Size
// Label
// Variant

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  label = "Submit",
  isLoading = false,
  size = BUTTON_SIZES.sm,
  variant = "primary",
  submit = false,
  className,
  onClick,
}: ButtonProps) => {
  const variantType = useButtonVariant(variant);
  if (!variant) {
    return null;
  }

  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      className={`inline-flex items-center gap-x-1.5 rounded font-semibold text-white shadow-sm ${size} ${variantType?.container} ${className}`}
    >
      {isLoading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-loader animate-spin"
        >
          <line x1="12" x2="12" y1="2" y2="6" />
          <line x1="12" x2="12" y1="18" y2="22" />
          <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
          <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
          <line x1="2" x2="6" y1="12" y2="12" />
          <line x1="18" x2="22" y1="12" y2="12" />
          <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
          <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
        </svg>
      )}
      {label}
    </button>
  );
};
