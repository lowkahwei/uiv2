import { useMemo, createContext, memo, useContext, useEffect, useState, Children } from "react";
import { cn } from "@heroui/theme";
import { useCarousel } from "./use-carousel";
import { CarouselContextValue, CarouselProps } from "./types";
import { useCarouselWheelGestures } from "./use-wheel-gestures";
import { useCarouselAutoplay } from "./use-carousel-autoplay";
import { Skeleton } from "@heroui/skeleton";
import { useCarouselControl } from "./use-carousel-control";

export const CarouselContext = createContext<CarouselContextValue | null>(null);
export const CarouselControlContext = createContext<React.ContextType<typeof CarouselControlContext> | any>(null);

const CarouselControlProvider = ({ children }: { children: React.ReactNode }) => {
  const { api, onSlideSelect } = useCarouselContext();
  const controlState = useCarouselControl(api, onSlideSelect);
  return (
    <CarouselControlContext.Provider value={controlState}>
      {children}
    </CarouselControlContext.Provider>
  );
};

export const Carousel = ({
  opts,
  plugins,
  onSlideSelect,
  fullWidth = false,
  height,
  width,
  className,
  children,
  isWheelGestures = false,
  isAutoplay = false,
  hideLoading = false,
  loop,
  direction: directionProp,
  slidesToShow,
  visiblePortion,
  gap,
  enableOpacity: enableOpacityProp,
  dragFree,
  clickable: clickableProp,
  isCenter,
  align,
  autoDelay,
  stopOnInteraction,
  duration,
  startIndex,
  skipSnaps,
  dragThreshold,
  ...props
}: CarouselProps) => {
  const {
    carouselRef,
    api,
    direction,
    styleVariables,
    clickable,
    enableOpacity,
  } = useCarousel({
    opts,
    plugins,
    isAutoplay,
    loop,
    direction: directionProp,
    slidesToShow,
    visiblePortion,
    gap,
    enableOpacity: enableOpacityProp,
    dragFree,
    clickable: clickableProp,
    isCenter,
    align,
    autoDelay,
    stopOnInteraction,
    duration,
    startIndex,
    skipSnaps,
    dragThreshold,
  });

  const [isEmblaReady, setIsEmblaReady] = useState(hideLoading);

  useEffect(() => {
    if (api && !isEmblaReady) {
      setIsEmblaReady(true);
    }
  }, [api, isEmblaReady]);

  const contextValue = useMemo(() => ({
    carouselRef,
    direction,
    clickable,
    enableOpacity,
    api,
    onSlideSelect,
    isEmblaReady
  }), [carouselRef, direction, clickable, enableOpacity, api, onSlideSelect, isEmblaReady]);

  useCarouselWheelGestures({
    emblaApi: api,
    isWheelGestures,
  });
  useCarouselAutoplay(api, isAutoplay);

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      height: height ?? "auto",
      width: width ?? (fullWidth ? "100%" : "auto"),
    }),
    [height, width, fullWidth]
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <CarouselControlProvider>
        <div
          className={cn("relative mx-auto group", className)}
          style={{ ...containerStyle, ...styleVariables }}
          {...props}
        >
          {!isEmblaReady && <Skeleton className="absolute h-full w-full z-10 rounded-medium" />}
          <div ref={carouselRef} className="overflow-hidden w-full h-full">
            {children}
          </div>
        </div>
      </CarouselControlProvider>
    </CarouselContext.Provider>
  );
};

export const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarouselContext must be used within a Carousel component");
  }
  return context;
};

export const useCarouselControlContext = () => {
  const context = useContext(CarouselControlContext);
  if (!context) {
    throw new Error("useCarouselControlContext must be used within a Carousel component");
  }
  return context;
};
