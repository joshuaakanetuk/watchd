import React from "react";
import { Popover } from "@headlessui/react";
import { Button } from "../Button/Button";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface DatePickerProps {
  name: string;
  value: Date;
  onChange: (arg0: Date) => void;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

enum BUTTON_SIZES {
  xs = "px-2 py-1 text-xs",
  sm = "px-2 py-1 text-sm",
  md = "px-2.5 py-1.5 text-sm",
}

/**
 * Primary UI component for user interaction
 */
export const DatePicker = ({
  name,
  value,
  onChange,
  ...rest
}: DatePickerProps) => {
  return (
    <Popover>
      <Popover.Button className={""}>
        {value ? "Date finished: " + format(value, "PP") : "Select a date..."}
      </Popover.Button>
      <Popover.Panel className="absolute z-10">
        <DayPicker
          {...rest}
          className="bg-[#141414] p-4"
          onDayClick={onChange}
          mode="single"
          selected={value}
        />
      </Popover.Panel>
    </Popover>
  );
};
