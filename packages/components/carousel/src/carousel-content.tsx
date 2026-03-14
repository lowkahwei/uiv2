import { cn } from "@heroui/theme";
import { useCarouselContext } from "./carousel";
import { CarouselContentProps } from "./types";

export const CarouselContent = ({ className, children }: CarouselContentProps) => {
  const { direction } = useCarouselContext();

  return (
    <div
      className={cn(
        "flex",
        direction === 'vertical' && "flex-col h-full",
        className
      )}
    >
      {children}
    </div>
  );
};

CarouselContent.displayName = "CarouselContent";
