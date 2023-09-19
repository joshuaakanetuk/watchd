import React, { InputHTMLAttributes } from "react";
import { Rating as RatingComponent } from "@mui/material";

interface RatingProps extends InputHTMLAttributes<HTMLInputElement>{
  label: string;
  value: number;
  readOnly: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Rating = ({ label, value, readOnly, ...rest }: RatingProps) => {
  return <RatingComponent size={"small"} name={label} value={value} readOnly={readOnly} />;
};
