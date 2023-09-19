import React from "react";

interface SectionHeaderProps {
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const SectionHeader = ({
  label = "REVIEWS FROM FRIENDS",
  onClick,
}: SectionHeaderProps) => {
  return (
    <h2 className="border-b pb-1 border-[#456] text-[#9ab] text-xs tracking-wide">
      {label}
    </h2>
    
  );
};
