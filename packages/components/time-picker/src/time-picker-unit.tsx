import type {TimePickerUnitProps} from "./types";

import React, {useMemo, useCallback, useRef, memo} from "react";
import {cn} from "@heroui/theme";
import {Carousel, CarouselContent, CarouselItem} from "@heroui/carousel";

const generateItems = (items: any[]) => {
  return items.map(({key, item, index, classname}) => (
    <CarouselItem
      key={key}
      className={cn(
        classname,
        "justify-center h-8 flex items-center font-medium transition-opacity duration-300",
      )}
      dataValue={item.value}
      index={index}
    >
      {item.label}
    </CarouselItem>
  ));
};

export const TimePickerUnit: React.FC<TimePickerUnitProps> = memo(
  ({values, selectedIndex, onChange, unit, classNames, disabled = false}) => {
    const handleSlideSelect = useCallback(
      (index: number, dataValue?: string) => {
        if (!disabled && index >= 0 && index < values.length) {
          onChange(index, dataValue);
        }
      },
      [disabled, values.length, onChange],
    );

    const initialIndex = useRef(selectedIndex);

    const items = useMemo(() => {
      return values.map((item, index) => ({
        key: `${unit}-${item.value}`,
        item,
        index,
        classname: classNames?.item,
      }));
    }, [values, unit, selectedIndex, classNames?.item]);

    return (
      <Carousel
        isWheelGestures
        align="center"
        className={classNames?.base}
        clickable={true}
        direction="vertical"
        duration={20}
        gap={0}
        height={160}
        isCenter={true}
        loop={false}
        slidesToShow={5}
        startIndex={initialIndex.current}
        width={120}
        onSlideSelect={handleSlideSelect}
      >
        <CarouselContent>{generateItems(items)}</CarouselContent>
      </Carousel>
    );
  },
  (prevProps, nextProps) => {
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
  },
);

TimePickerUnit.displayName = "TimePickerUnit";
