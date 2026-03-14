import { useState, useCallback, useEffect, useRef } from "react";
import { EmblaCarouselType } from "embla-carousel";

export const useCarouselControl = (
  emblaApi: EmblaCarouselType | undefined,
  onSlideSelect?: (index: number, dataValue?: string) => void
) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSlideSelectRef = useRef(onSlideSelect);
  useEffect(() => {
    onSlideSelectRef.current = onSlideSelect;
  }, [onSlideSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => {
    if (emblaApi && index >= 0 && index < scrollSnaps.length) emblaApi.scrollTo(index);
  }, [emblaApi, scrollSnaps.length]);
  
  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const handleSelect = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);
    
    const slideNode = emblaApi.slideNodes()[currentIndex];
    const dataValue = slideNode?.getAttribute('data-value') ?? undefined;
    onSlideSelectRef.current?.(currentIndex, dataValue);
    
    updateScrollState();
  }, [emblaApi, updateScrollState]);

  useEffect(() => {
    if (!emblaApi) return;
    
    handleSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    updateScrollState();

    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);
    emblaApi.on("resize", updateScrollState);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
      emblaApi.off("resize", updateScrollState);
    };
  }, [emblaApi, handleSelect, updateScrollState]);


  return {
    selectedIndex,
    scrollSnaps,
    scrollPrev,
    scrollNext,
    scrollTo,
    canScrollPrev,
    canScrollNext,
  };
};
