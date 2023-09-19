import React, { forwardRef } from "react";
import {
  ChangeHandler,
  Controller,
  RefCallBack,
  useController,
  useFormContext,
} from "react-hook-form";

enum INPUT_VARIANTS {
  text = "text",
  search = "search",
}

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  /**
   * Text to be displayed on button.
   */
  label: string;
  /**
   * Optional additional text to be displayed on under the input.
   */
  subtitle?: string;
  /**
   * Optional additional text to be rendered in input's placeholder.
   */
  placeholder?: string;
  variant: INPUT_VARIANTS;
  innerRef?: RefCallBack;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  value?: string;
}

export const WrappedInput = ({ label }: InputProps) => {
  const methods = useFormContext();
  return (
    <Controller
      name={label}
      control={methods.control}
      defaultValue={""}
      render={({ field }) => (
        <Input
          label={label}
          variant={INPUT_VARIANTS.text}
          value={field.value as string}
          onChange={field.onChange}
        />
      )}
    />
  );
};

/**
 * Primary UI component for user interaction
 */
export const Input = ({
  label,
  subtitle,
  placeholder,
  variant = INPUT_VARIANTS.text,
  onChange,
  value,
}: InputProps) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium leading-6 text-white"
      >
        {label}
      </label>
      <div className="mt-2">
        {!onChange ? (
          <input
            type="text"
            placeholder={placeholder}
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          />
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            {...(value ? { value: value } : { value: "" })}
            onChange={onChange}
          />
        )}
      </div>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-500" id="email-description">
          {subtitle}
        </p>
      )}
    </div>
  );
};
