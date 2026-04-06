import type {CalendarPickerProps} from "./use-calendar-picker";

import {TimePicker} from "@heroui/time-picker";

import {useCalendarPicker} from "./use-calendar-picker";

export function CalendarPicker(props: CalendarPickerProps) {
  const {state, slots, classNames, isHeaderExpanded} = useCalendarPicker(props);

  return (
    <div
      className={slots?.pickerWrapper({
        class: classNames?.pickerWrapper,
      })}
      data-slot="picker-wrapper"
      // makes the browser ignore the element and its children when tabbing
      // @ts-ignore
      inert={!isHeaderExpanded ? true : undefined}
    >
      <TimePicker
        isMonth
        isYear
        isDay={false}
        value={state.focusedDate}
        onChange={(date) => {
          state.setFocusedDate(
            state.focusedDate.set({
              year: date.year,
              month: date.month,
            }),
          );
        }}
      />
    </div>
  );
}
