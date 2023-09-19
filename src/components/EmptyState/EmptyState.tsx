import React from "react";

interface EmptyStateProps {
  message?: string;
}

/**
 * UI component to render when
 * content is missing.
 */
export const EmptyState = ({ message = 'Nothing Here!' }: EmptyStateProps) => {
  return <div className="text-2xl font-light">{message}</div>;
};
