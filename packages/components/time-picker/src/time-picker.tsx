import React, { memo } from 'react';
import { cn } from '@sytechui/theme';
import { TimePickerProps } from './types';
import { useTimePicker } from './use-time-picker';
import { TimePickerUnit } from './time-picker-unit';

export const TimePicker: React.FC<TimePickerProps> = memo(({
  isYear = true,
  isMonth = true,
  isDay = false,
  isHour = false,
  isMinute = false,
  isSecond = false,
  value,
  defaultValue,
  onChange,
  className,
  disabled = false,
  unitOrder,
}) => {
  const { 
    ranges, 
    getSelectedIndex,
    handleIndexChange, 
    activeUnits 
  } = useTimePicker({
    isYear,
    isMonth,
    isDay,
    isHour,
    isMinute,
    isSecond,
    value,
    defaultValue,
    onChange,
    unitOrder,
  });

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-x-0 w-[calc(100%_-_16px)] mx-2 h-8 bg-default-200 rounded-medium z-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        
        {activeUnits.map((unit) => {
          const unitRanges = ranges[unit];
          if (!unitRanges) return null;
          
          const selectedIndex = getSelectedIndex(unit);
          
          return (
            <TimePickerUnit
              key={unit}
              values={unitRanges}
              selectedIndex={selectedIndex >= 0 ? selectedIndex : undefined}
              onChange={(index) => handleIndexChange(unit, index)}
              unit={unit}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.defaultValue === nextProps.defaultValue &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.className === nextProps.className &&
    prevProps.isYear === nextProps.isYear &&
    prevProps.isMonth === nextProps.isMonth &&
    prevProps.isDay === nextProps.isDay &&
    prevProps.isHour === nextProps.isHour &&
    prevProps.isMinute === nextProps.isMinute &&
    prevProps.isSecond === nextProps.isSecond &&
    JSON.stringify(prevProps.unitOrder) === JSON.stringify(nextProps.unitOrder)
  );
});

TimePicker.displayName = 'TimePicker';
