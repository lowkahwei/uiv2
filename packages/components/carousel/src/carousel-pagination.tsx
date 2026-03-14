import { memo, useCallback } from "react";
import { cn } from "@heroui/theme";
import { useCarouselContext, useCarouselControlContext } from "./carousel";
import { motion } from "framer-motion";
import { CarouselPaginationProps } from "./types";

const PaginationDot = memo(({
  index,
  isSelected,
  onClick
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    className={cn(
      "h-2 w-2 rounded-full transition-colors",
      isSelected ? "bg-white" : "bg-white/50"
    )}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    aria-label={`Go to slide ${index + 1}`}
    initial={false}
    animate={{
      scale: isSelected ? 1.2 : 1,
      opacity: isSelected ? 1 : 0.5,
    }}
    transition={{ duration: 0.2 }}
  />
));

PaginationDot.displayName = "PaginationDot";

export const CarouselPagination = memo(({
  className,
  renderDot,
  ...props
}: CarouselPaginationProps) => {
  const { direction } = useCarouselContext();
  const { selectedIndex, scrollSnaps, scrollTo } = useCarouselControlContext();

  const positionClasses = direction === 'vertical'
    ? "right-4 top-0 bottom-0 flex flex-col items-center justify-center gap-1"
    : "bottom-4 left-0 right-0 flex justify-center gap-1";

  const handleDotClick = useCallback((index: number) => {
    scrollTo(index);
  }, [scrollTo]);

  return (
    <div
      className={cn("absolute", positionClasses, className)}
      {...props}
    >
      {scrollSnaps.map((_, index) => {
        const isSelected = index === selectedIndex;

        if (renderDot) {
          return renderDot(index, isSelected, () => handleDotClick(index));
        }

        return (
          <PaginationDot
            key={index}
            index={index}
            isSelected={isSelected}
            onClick={() => handleDotClick(index)}
          />
        );
      })}
    </div>
  );
});

CarouselPagination.displayName = "CarouselPagination";