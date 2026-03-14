import useEmblaCarousel from "embla-carousel-react";
import { UseCarouselProps } from "./types";
import { useCarouselStyle } from "./use-carousel-style";
import Autoplay from "embla-carousel-autoplay";
import { useMemo, useRef } from "react";
import { EmblaOptionsType } from "embla-carousel";

export const useCarousel = ({
  opts = {},
  plugins = [],
  isAutoplay = false,
}: UseCarouselProps = {}) => {
  const {
    loop = false,
    direction = 'horizontal',
    slidesToShow = 1,
    visiblePortion = 0,
    gap = 1,
    enableOpacity = false,
    dragFree = false,
    align,
    clickable = false,
    autoDelay = 5000,
    stopOnInteraction = true,
    isCenter = false,
    duration = 25,
    startIndex = 0,
    ...restOpts
  } = opts;

  const { styleVariables, customAlign } = useCarouselStyle(direction, slidesToShow, visiblePortion, gap);
  const emblaOptions = useMemo(() => ({
    loop,
    axis: direction === 'vertical' ? 'y' : 'x',
    containScroll: isCenter ? false : "trimSnaps",
    align: align || customAlign,
    dragFree,
    duration,
    startIndex,
    ...restOpts
  }), [loop, direction, isCenter, align, customAlign, dragFree, duration, startIndex]);

  const emblaPlugins = useMemo(() => [
    ...(isAutoplay ? [Autoplay({ delay: autoDelay, stopOnInteraction })] : []),
    ...plugins
  ], [isAutoplay, autoDelay, stopOnInteraction, plugins]);

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions as EmblaOptionsType, emblaPlugins);

  return {
    carouselRef: emblaRef,
    api: emblaApi,
    direction,
    styleVariables,
    clickable,
    enableOpacity,
  };
};