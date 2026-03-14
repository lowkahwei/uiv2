import { useEffect, useRef, useCallback } from "react";
import { CarouselWheelGesturesProps } from "./types";

export const useCarouselWheelGestures = ({
  emblaApi,
  isWheelGestures,
}: CarouselWheelGesturesProps) => {
  const apiRef = useRef(emblaApi);

  useEffect(() => {
    apiRef.current = emblaApi;
  }, [emblaApi]);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!apiRef.current) return;
    event.preventDefault();

    const delta = Math.sign(event.deltaY);
    if (delta > 0) {
      apiRef.current.scrollNext();
    } else if (delta < 0) {
      apiRef.current.scrollPrev();
    }

  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!apiRef.current) return;

    const keyMap: Record<string, () => void> = {
      'ArrowLeft': apiRef.current.scrollPrev,
      'ArrowUp': apiRef.current.scrollPrev,
      'ArrowRight': apiRef.current.scrollNext,
      'ArrowDown': apiRef.current.scrollNext,
      'Home': () => apiRef.current?.scrollTo(0),
      'End': () => apiRef.current?.scrollTo(apiRef.current.slideNodes().length - 1),
    };

    const action = keyMap[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }, []);

  useEffect(() => {
    if (!isWheelGestures || !emblaApi) return;

    const container = emblaApi.containerNode();
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('tabindex', '0');

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('keydown', handleKeyDown);
    };

  }, [isWheelGestures, emblaApi, handleWheel, handleKeyDown])
};
