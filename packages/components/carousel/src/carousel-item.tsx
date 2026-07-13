import { useCallback, memo } from "react";
import { cn } from "@sytechui/theme";
import { useCarouselContext } from "./carousel";
import { CarouselItemProps } from "./types";

export const CarouselItem = memo(({ className, index, children, dataValue }: CarouselItemProps) => {
  const { enableOpacity, clickable, api, onSlideSelect, direction } = useCarouselContext();

  const handleClick = useCallback(() => {
    if (clickable && api && typeof index === 'number') {
      api.scrollTo(index);
      onSlideSelect?.(index, dataValue);
    }
  }, [clickable, api, index, onSlideSelect, dataValue]);

  return (
    <div
      className={cn(
        "select-none",
        enableOpacity && "transition-opacity duration-300",
        clickable && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      style={{
        flex: "var(--carousel-item-flex)",
        minWidth: 0,
        ...(direction === 'vertical' ? { minHeight: 0, paddingBottom: "var(--carousel-item-gap)" } : { paddingRight: "var(--carousel-item-gap)" })
      }}
      onClick={clickable ? handleClick : undefined}
      {...(dataValue && { 'data-value': dataValue })}
    >
      {children}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.index === nextProps.index &&
    prevProps.className === nextProps.className &&
    prevProps.children === nextProps.children;
});

CarouselItem.displayName = "CarouselItem";
