import React from "react";

interface CheckboxProps {
    id: string;
    /**
     * If the checkbox needs a label, it will render with the supplied string.
     */
    label?: string;
    /**
     * Optional click handler
     */
    onClick?: () => void;
  }

/**
 * Primary UI component for user interaction
 */
export const Checkbox = ({
    id,
    label
}: CheckboxProps) => {
  return (
    <input
      id={id}
      aria-describedby={`${label}-description`}
      name={`${label}`}
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
    />
  );
};
