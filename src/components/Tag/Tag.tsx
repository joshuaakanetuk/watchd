import React from "react";

interface TagProps {
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Renders a small badge, commonly used as tags.
 */
export const Tag = ({ label = "regal theatre", onClick }: TagProps) => {
  return (
    <span className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
      <svg className="h-1.5 w-1.5 fill-gray-500" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx={3} cy={3} r={3} />
        </svg>
      {label}
    </span>
  );
};
