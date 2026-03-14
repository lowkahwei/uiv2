import { useEffect, useCallback, useMemo, useRef } from "react";
import { ResponsiveValue } from "./types";
import { useView } from "@heroui/use-media-query";

function resolveResponsive<T>(
  value: ResponsiveValue<T> | undefined,
  fallback: number,
  currentView: string
): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'object') return value as number;
  return (value as any)[currentView] ?? fallback;
}

export interface UseCarouselStyleReturn {
  styleVariables: React.CSSProperties;
  customAlign: (viewSize: number, snapSize: number, index: number) => number;
}

export const useCarouselStyle = (
  direction: "horizontal" | "vertical",
  slidesToShow: ResponsiveValue<number>,
  visiblePortion: ResponsiveValue<number>,
  gap: ResponsiveValue<number>
): UseCarouselStyleReturn => {
  const currentView = useView();

  const responsiveValues = useMemo(() => ({
    slidesToShow: resolveResponsive(slidesToShow, 1, currentView),
    visiblePortion: resolveResponsive(visiblePortion, 0, currentView),
    gap: resolveResponsive(gap, 0, currentView),
  }), [slidesToShow, visiblePortion, gap, currentView]);

  const styleVariables = useMemo(() => {
    const { slidesToShow: _slidesToShow, visiblePortion: _visiblePortion, gap: _gap } = responsiveValues;
    const totalViewportDimension = _slidesToShow + _visiblePortion * 2;
    const basisPercentage = 100 / totalViewportDimension;

    return {
      "--carousel-item-flex": `0 0 ${basisPercentage}%`,
      "--carousel-item-gap": `${_gap}rem`,
    } as React.CSSProperties;
  }, [responsiveValues.slidesToShow, responsiveValues.visiblePortion, responsiveValues.gap]);

  const customAlign = useCallback((viewSize: number, snapSize: number, index: number): number => {
    const { slidesToShow: currentSlidesToShow, visiblePortion: currentVisiblePortion } = responsiveValues;
    if (typeof currentSlidesToShow !== 'number' || currentSlidesToShow <= 0) return (viewSize - snapSize) / 2;
    if (currentSlidesToShow % 2 !== 0) return (viewSize - snapSize) / 2;
    return snapSize * (currentVisiblePortion ?? 0);
  }, []);

  return { styleVariables, customAlign };
};