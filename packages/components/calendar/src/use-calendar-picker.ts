import type {CalendarDate} from "@internationalized/date";
import type {HTMLHeroUIProps} from "@heroui/system";

import {useCalendarContext} from "./calendar-context";

export interface CalendarPickerProps extends HTMLHeroUIProps<"div"> {
  date: CalendarDate;
  currentMonth: CalendarDate;
}

export function useCalendarPicker(_props: CalendarPickerProps) {
  const {slots, state, isHeaderExpanded, classNames} = useCalendarContext();

  return {
    state,
    slots,
    classNames,
    isHeaderExpanded,
  };
}

export type UseCalendarPickerReturn = ReturnType<typeof useCalendarPicker>;
