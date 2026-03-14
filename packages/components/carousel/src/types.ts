import { EmblaPluginType, EmblaCarouselType } from "embla-carousel";
import { HTMLAttributes, ReactNode } from "react";
import { ButtonProps } from "@heroui/button";

export type ResponsiveValue<T> = {
  desktop?: T;
  tablet?: T;
  mobile?: T;
} | T;

export interface Breakpoints {
  tablet: number;
  mobile: number;
}

export interface CarouselOptions {
  // Core carousel options
  loop?: boolean;
  direction?: 'horizontal' | 'vertical';
  duration?: number;
  startIndex?: number;

  // Multi-item display options
  slidesToShow?: ResponsiveValue<number>;
  visiblePortion?: ResponsiveValue<number>;
  gap?: ResponsiveValue<number>;

  // Visual effects
  enableOpacity?: boolean;
  dragFree?: boolean;
  clickable?: boolean;
  isCenter?: boolean;

  align?: "start" | "center" | "end";
  autoDelay?: number;
  stopOnInteraction?: boolean;
  skipSnaps?: boolean;
  dragThreshold?: number;
}

export interface UseCarouselProps {
  opts?: CarouselOptions;
  plugins?: EmblaPluginType[];
  isAutoplay?: boolean;
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  plugins?: EmblaPluginType[];
  onSlideSelect?: (index: number, dataValue?: string) => void;
  fullWidth?: boolean;
  height?: string | number;
  width?: string | number;
  children: ReactNode;
  isWheelGestures?: boolean;
  isAutoplay?: boolean;
  hideLoading?: boolean;
}

export interface CarouselContextValue {
  carouselRef: <ViewportElement extends HTMLElement>(instance: ViewportElement | null) => void;
  api: EmblaCarouselType | undefined;
  direction: 'horizontal' | 'vertical';
  clickable: boolean;
  enableOpacity: boolean;
  onSlideSelect?: (index: number, dataValue?: string) => void;
  isEmblaReady: boolean;
}

export interface CarouselControlContextValue {
  selectedIndex: number;
  scrollSnaps: number[];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export interface CarouselButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  alwaysVisible?: boolean;
}

export interface CarouselPaginationProps {
  className?: string;
  renderDot?: (
    index: number,
    isSelected: boolean,
    onClick: () => void
  ) => React.ReactNode;
}

export interface CarouselItemProps {
  className?: string;
  index?: number;
  children: React.ReactNode;
  dataValue?: string;
}

export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface CarouselWheelGesturesProps {
  emblaApi: EmblaCarouselType | undefined;
  isWheelGestures: boolean;
}