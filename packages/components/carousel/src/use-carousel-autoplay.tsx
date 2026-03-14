import { useEffect, useCallback } from "react";
import { EmblaCarouselType } from "embla-carousel";

export const useCarouselAutoplay = (
  emblaApi: EmblaCarouselType | undefined,
  isAutoplay: boolean = false
) => {
  useEffect(() => {
    if (!emblaApi || !isAutoplay) return;

    const autoplay = emblaApi.plugins()?.autoplay;
    if (!autoplay) return;

    const container = emblaApi.containerNode();
    if (!container) return;

    const stop = () => autoplay.stop();
    const play = () => autoplay.play();

    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', play);
    emblaApi.on('pointerDown', stop);

    return () => {
      container.removeEventListener('mouseenter', stop);
      container.removeEventListener('mouseleave', play);
      emblaApi.off('pointerDown', stop);
    };
  }, [emblaApi, isAutoplay]);

  return {
    handleApi: emblaApi?.plugins()?.autoplay
  };
};
