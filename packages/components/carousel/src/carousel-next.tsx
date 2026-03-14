import React, { useCallback } from "react";
import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { useCarouselContext, useCarouselControlContext } from "./carousel";
import { ChevronDownIcon, ChevronRightIcon } from "@heroui/shared-icons";
import { CarouselButtonProps } from "./types";

export const CarouselNext = ({
  className,
  variant = "light",
  icon,
  alwaysVisible = false,
  ...props
}: CarouselButtonProps) => {
  const { api, direction } = useCarouselContext();
  const { scrollNext, canScrollNext } = useCarouselControlContext();

  const positionClasses = direction === 'vertical'
    ? "bottom-4 left-1/2 -translate-x-1/2"
    : "right-4 top-1/2 -translate-y-1/2";

  const handleClick = useCallback(() => {
    scrollNext();
  }, [scrollNext]);

  return (
    <Button
      variant={variant}
      isIconOnly
      className={cn(
        "absolute z-10",
        positionClasses,
        {
          "opacity-0 transition-opacity duration-300 group-hover:opacity-100": !alwaysVisible,
          "hidden": !canScrollNext && !api?.internalEngine().options.loop,
        },
        className
      )}
      disabled={!canScrollNext && !api?.internalEngine().options.loop}
      onPress={handleClick}
      {...(props as any)}
    >
      {icon || (
        direction === 'vertical'
          ? <ChevronDownIcon />
          : <ChevronRightIcon />
      )}
    </Button>
  );
};

CarouselNext.displayName = "CarouselNext";