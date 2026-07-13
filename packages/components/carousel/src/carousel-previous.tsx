import React, { useCallback } from "react";
import { Button, ButtonProps } from "@sytechui/button";
import { cn } from "@sytechui/theme";
import { useCarouselContext, useCarouselControlContext } from "./carousel";
import { ChevronUpIcon, ChevronLeftIcon } from "@sytechui/shared-icons";
import { CarouselButtonProps } from "./types";

export const CarouselPrevious = ({
  className,
  variant = "light",
  icon,
  alwaysVisible = false,
  ...props
}: CarouselButtonProps) => {
  const { api, direction } = useCarouselContext();
  const { scrollPrev, canScrollPrev } = useCarouselControlContext();

  const positionClasses = direction === 'vertical'
    ? "top-4 left-1/2 -translate-x-1/2"
    : "left-4 top-1/2 -translate-y-1/2";

  const handleClick = useCallback(() => {
    scrollPrev();
  }, [scrollPrev]);

  return (
    <Button
      variant={variant}
      isIconOnly
      className={cn(
        "absolute z-10",
        positionClasses,
        {
          "opacity-0 transition-opacity duration-300 group-hover:opacity-100": !alwaysVisible,
          "hidden": !canScrollPrev && !api?.internalEngine().options.loop,
        },
        className
      )}
      disabled={!canScrollPrev && !api?.internalEngine().options.loop}
      onPress={handleClick}
      {...(props as any)}
    >
      {icon || (
        direction === 'vertical'
          ? <ChevronUpIcon />
          : <ChevronLeftIcon />
      )}
    </Button>
  );
};

CarouselPrevious.displayName = "CarouselPrevious";