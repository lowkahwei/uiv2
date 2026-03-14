import { TimePickerValue, TimeUnit } from "./types";

export const DEFAULT_RANGES: Record<keyof TimePickerValue, { min: number; max: number }> = {
  year: { min: 1900, max: 2100 },
  month: { min: 1, max: 12 },
  day: { min: 1, max: 31 },
  hour: { min: 0, max: 23 },
  minute: { min: 0, max: 59 },
  second: { min: 0, max: 59 },
};

export const DEFAULT_UNIT_ORDER: TimeUnit[] = ['year', 'month', 'day', 'hour', 'minute', 'second'];
