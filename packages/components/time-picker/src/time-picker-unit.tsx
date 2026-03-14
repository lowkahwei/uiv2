import React, { useMemo, useCallback, memo } from 'react';
import { cn } from '@heroui/theme';
import { Carousel, CarouselContent, CarouselItem, CarouselProps } from "@heroui/carousel";
import { TimePickerUnitProps } from './types';

const generateItems = (items: any[]) => {
  return items.map(({ key, item, index, classname }) => (
    <CarouselItem
      key={key}
      index={index}
      className={cn(
        classname,
        "justify-center h-8 flex items-center font-medium transition-opacity duration-300"
      )}
      dataValue={item.value}
    >
      {item.label}
    </CarouselItem>
  ));
};

export const TimePickerUnit: React.FC<TimePickerUnitProps> = memo(({
  values,
  selectedIndex,
  onChange,
  unit,
  classNames,
  disabled = false,
}) => {
  const handleSlideSelect = useCallback((index: number, dataValue?: string) => {
    if (!disabled && index >= 0 && index < values.length) {
      onChange(index, dataValue);
    }
  }, [disabled, values.length, onChange]);

  const initialIndex = useMemo(() => {
    return selectedIndex ?? 0;
  }, []);

  const items = useMemo(() => {
    return values.map((item, index) => ({
      key: `${unit}-${item.value}`,
      item,
      index,
      classname: classNames?.item
    }));
  }, [values, unit, selectedIndex, classNames?.item]);

  return (
    <Carousel
      direction="vertical"
      duration={20}
      isCenter={true}
      slidesToShow={5}
      gap={0}
      align="center"
      clickable={true}
      startIndex={initialIndex}
      height={160}
      width={120}
      onSlideSelect={handleSlideSelect}
      className={classNames?.base}
      isWheelGestures
    >
      <CarouselContent>
        {generateItems(items)}
      </CarouselContent>
    </Carousel>
  );
}, (prevProps, nextProps) => {
  if (prevProps.values.length !== nextProps.values.length) return false;

  const valuesEqual = prevProps.values.every((val, idx) => {
    const nextVal = nextProps.values[idx];
    return val.value === nextVal.value && val.label === nextVal.label;
  });

  return (
    valuesEqual &&
    prevProps.selectedIndex === nextProps.selectedIndex &&
    prevProps.unit === nextProps.unit &&
    prevProps.disabled === nextProps.disabled
  );
});

TimePickerUnit.displayName = 'TimePickerUnit';
