import { DateValue } from "@internationalized/date";

export interface TimePickerValue {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}

export interface TimePickerItem {
  value: number;
  label: string;
}

export type TimeUnit = keyof TimePickerValue;

export interface UseTimePickerOptions {
  isYear?: boolean;
  isMonth?: boolean;
  isDay?: boolean;
  isHour?: boolean;
  isMinute?: boolean;
  isSecond?: boolean;
  value?: DateValue;
  defaultValue?: DateValue;
  onChange?: (value: DateValue) => void;
  unitOrder?: TimeUnit[];
}

export interface TimePickerUnitProps {
  values: TimePickerItem[];
  selectedIndex?: number;
  onChange: (index: number, dataValue?: string) => void;
  unit: TimeUnit;
  disabled?: boolean;
  className?: string;
  classNames?: {
    base?: string;
    item?: string;
  };
}

export interface TimePickerProps {
  isYear?: boolean;
  isMonth?: boolean;
  isDay?: boolean;
  isHour?: boolean;
  isMinute?: boolean;
  isSecond?: boolean;
  value?: DateValue;
  defaultValue?: DateValue;
  onChange?: (value: DateValue) => void;
  className?: string;
  disabled?: boolean;
  unitOrder?: TimeUnit[];
}
