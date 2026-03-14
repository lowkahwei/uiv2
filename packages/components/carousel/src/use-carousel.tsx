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
  loop: loopProp = true,
  direction: directionProp = 'horizontal',
  slidesToShow: slidesToShowProp = 1,
  visiblePortion: visiblePortionProp = 0,
  gap: gapProp = 1,
  enableOpacity: enableOpacityProp = false,
  dragFree: dragFreeProp = false,
  align: alignProp,
  clickable: clickableProp = false,
  autoDelay: autoDelayProp = 5000,
  stopOnInteraction: stopOnInteractionProp = true,
  isCenter: isCenterProp = false,
  duration: durationProp = 25,
  startIndex: startIndexProp = 0,
  skipSnaps: skipSnapsProp = true,
  dragThreshold: dragThresholdProp,
  ...restProps
}: UseCarouselProps = {}) => {
  const {
    loop = loopProp,
    direction = directionProp,
    slidesToShow = slidesToShowProp,
    visiblePortion = visiblePortionProp,
    gap = gapProp,
    enableOpacity = enableOpacityProp,
    dragFree = dragFreeProp,
    align = alignProp,
    clickable = clickableProp,
    autoDelay = autoDelayProp,
    stopOnInteraction = stopOnInteractionProp,
    isCenter = isCenterProp,
    duration = durationProp,
    startIndex = startIndexProp,
    skipSnaps = skipSnapsProp,
    dragThreshold = dragThresholdProp,
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
    skipSnaps,
    dragThreshold,
    ...restOpts
  }), [loop, direction, isCenter, align, customAlign, dragFree, duration, startIndex, skipSnaps, dragThreshold, restOpts]);

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