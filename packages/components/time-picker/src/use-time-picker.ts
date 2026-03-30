import type {TimePickerValue, UseTimePickerOptions, TimePickerItem, TimeUnit} from "./types";
import type {DateValue} from "@internationalized/date";

import {useState, useCallback, useMemo, useEffect, useRef} from "react";
import {debounce} from "@heroui/shared-utils";
import {CalendarDate, CalendarDateTime, getLocalTimeZone} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

import {generateRange, getDaysInMonth, createStaticItems} from "./utils";
import {DEFAULT_RANGES, DEFAULT_UNIT_ORDER} from "./constants";

// Convert DateValue to internal state
const dateValueToState = (dateValue: DateValue | undefined): TimePickerValue => {
  if (!dateValue) return {};

  const state: TimePickerValue = {
    year: dateValue.year,
    month: dateValue.month,
    day: dateValue.day,
  };

  if ("hour" in dateValue) {
    state.hour = dateValue.hour;
    state.minute = dateValue.minute;
    state.second = dateValue.second;
  }

  return state;
};

// Convert internal state to DateValue
const stateToDateValue = (
  state: TimePickerValue,
  enabledUnits: Record<TimeUnit, boolean>,
): DateValue | undefined => {
  // Require at least year and month for a valid date
  if (!state.year || !state.month) return undefined;

  const hasTimeUnits = enabledUnits.hour || enabledUnits.minute || enabledUnits.second;
  const hasDay = enabledUnits.day && state.day !== undefined;

  if (hasTimeUnits) {
    return new CalendarDateTime(
      state.year,
      state.month,
      state.day || 1,
      state.hour || 0,
      state.minute || 0,
      state.second || 0,
    );
  }

  if (hasDay) {
    return new CalendarDate(state.year, state.month, state.day!);
  }

  return new CalendarDate(state.year, state.month, 1);
};

// Memoized range generator
const useStaticRanges = () => {
  const monthFormatter = useDateFormatter({month: "short", calendar: "gregory"});
  const yearFormatter = useDateFormatter({year: "numeric"});

  return useMemo(
    () => ({
      year: generateRange(DEFAULT_RANGES.year.min, DEFAULT_RANGES.year.max).map((y) => ({
        value: y,
        label: yearFormatter.format(new CalendarDate(y, 1, 1).toDate(getLocalTimeZone())),
      })),
      month: generateRange(DEFAULT_RANGES.month.min, DEFAULT_RANGES.month.max).map((m) => ({
        value: m,
        label: monthFormatter.format(new CalendarDate(2025, m, 1).toDate(getLocalTimeZone())),
      })),
      hour: createStaticItems(DEFAULT_RANGES.hour.min, DEFAULT_RANGES.hour.max),
      minute: createStaticItems(DEFAULT_RANGES.minute.min, DEFAULT_RANGES.minute.max),
      second: createStaticItems(DEFAULT_RANGES.second.min, DEFAULT_RANGES.second.max),
    }),
    [monthFormatter, yearFormatter],
  );
};

export const useTimePicker = (options: UseTimePickerOptions = {}) => {
  const {
    isYear = true,
    isMonth = true,
    isDay = false,
    isHour = false,
    isMinute = false,
    isSecond = false,
    value: controlledValue,
    defaultValue,
    onChange,
    unitOrder = DEFAULT_UNIT_ORDER,
  } = options;

  // Enabled units configuration
  const enabledUnits = useMemo(
    () => ({
      year: isYear,
      month: isMonth,
      day: isDay,
      hour: isHour,
      minute: isMinute,
      second: isSecond,
    }),
    [isYear, isMonth, isDay, isHour, isMinute, isSecond],
  );

  const isControlled = controlledValue !== undefined;

  // Internal state - maintains complete state regardless of control mode
  const [internalState, setInternalState] = useState<TimePickerValue>(() => {
    if (controlledValue) return dateValueToState(controlledValue);
    if (defaultValue) return dateValueToState(defaultValue);

    return {};
  });

  // Sync controlled value to internal state
  useEffect(() => {
    if (isControlled && controlledValue) {
      const newState = dateValueToState(controlledValue);

      setInternalState((current) => {
        // Merge with current state to preserve units not in controlled value
        const merged: TimePickerValue = {...current};

        // Only update enabled units from controlled value
        Object.keys(enabledUnits).forEach((unit) => {
          const key = unit as TimeUnit;

          if (enabledUnits[key] && newState[key] !== undefined) {
            merged[key] = newState[key];
          }
        });

        return merged;
      });
    }
  }, [controlledValue, isControlled, enabledUnits]);

  // Get static ranges
  const staticRanges = useStaticRanges();

  // Calculate dynamic day range
  const dayRange = useMemo(() => {
    if (!isDay) return [];
    const year = internalState.year || new Date().getFullYear();
    const month = internalState.month || 1;
    const maxDays = getDaysInMonth(year, month);

    return createStaticItems(1, maxDays);
  }, [isDay, internalState.year, internalState.month]);

  // Combined ranges
  const ranges = useMemo(() => {
    const result: Partial<Record<TimeUnit, TimePickerItem[]>> = {};

    if (isYear) result.year = staticRanges.year;
    if (isMonth) result.month = staticRanges.month;
    if (isDay) result.day = dayRange;
    if (isHour) result.hour = staticRanges.hour;
    if (isMinute) result.minute = staticRanges.minute;
    if (isSecond) result.second = staticRanges.second;

    return result;
  }, [isYear, isMonth, isDay, isHour, isMinute, isSecond, staticRanges, dayRange]);

  const debouncedOnChange = useMemo(
    () =>
      debounce((date: DateValue) => {
        onChange?.(date);
      }, 200),
    [onChange],
  );

  // Get selected index for a unit
  const getSelectedIndex = useCallback(
    (unit: TimeUnit) => {
      const unitRange = ranges[unit];
      const value = internalState[unit];

      if (!unitRange || value === undefined) return -1;

      return unitRange.findIndex((item) => item.value === value);
    },
    [ranges, internalState],
  );

  // Handle index change with proper state management
  const handleIndexChange = useCallback(
    (unit: TimeUnit, index: number) => {
      const unitRange = ranges[unit];

      if (!unitRange || !unitRange[index]) return;

      const newValue = unitRange[index].value;

      setInternalState((current) => {
        const updated = {...current, [unit]: newValue};

        if ((unit === "year" || unit === "month") && updated.day) {
          const maxDays = getDaysInMonth(
            updated.year || new Date().getFullYear(),
            updated.month || 1,
          );

          if (updated.day > maxDays) {
            updated.day = maxDays;
          }
        }

        // Calculate new DateValue and trigger onChange with debounce
        const nextDateValue = stateToDateValue(updated, enabledUnits);

        if (nextDateValue) {
          debouncedOnChange(nextDateValue);
        }

        return updated;
      });
    },
    [ranges, enabledUnits, debouncedOnChange],
  );

  const latestOnChange = useRef(handleIndexChange);

  useEffect(() => {
    latestOnChange.current = handleIndexChange;
  }, [handleIndexChange]);

  const stableHandleIndexChange = useCallback((unit: TimeUnit, index: number) => {
    latestOnChange.current(unit, index);
  }, []);

  // Active units in order
  const activeUnits = useMemo(() => {
    return unitOrder.filter((unit) => enabledUnits[unit]);
  }, [unitOrder, enabledUnits]);

  return {
    value: internalState,
    ranges,
    getSelectedIndex,
    handleIndexChange: stableHandleIndexChange,
    activeUnits,
  };
};
