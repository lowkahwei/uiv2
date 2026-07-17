import type {ShimmerTextVariantProps} from "@sytechui/theme";
import type {HTMLHeroUIProps, PropGetter} from "@sytechui/system";
import type {CSSProperties, ReactNode} from "react";

import {cn, shimmerText} from "@sytechui/theme";
import {mapPropsVariants, useProviderContext} from "@sytechui/system";

interface Props extends HTMLHeroUIProps<"span"> {
  /**
   * The text content that receives the shimmer effect.
   */
  children: ReactNode;
  /**
   * Duration of one shimmer sweep in milliseconds.
   * @default 2000
   */
  duration?: number;
  /**
   * Width of the highlight band. Numbers are interpreted as pixels.
   * @default "calc(3ch + 40px)"
   */
  spread?: number | string;
  /**
   * Angle of the highlight band in degrees.
   * @default 20
   */
  angle?: number;
}

export type UseShimmerTextProps = Props & ShimmerTextVariantProps;

export function useShimmerText(originalProps: UseShimmerTextProps) {
  const globalContext = useProviderContext();
  const [props, variantProps] = mapPropsVariants(originalProps, shimmerText.variantKeys);
  const {angle, as, children, className, duration, spread, style, ...otherProps} = props;

  const Component = as || "span";
  const disableAnimation =
    originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false;
  const styles = shimmerText({...variantProps, disableAnimation, className});

  const getShimmerTextProps: PropGetter = (props = {}) => ({
    ...otherProps,
    ...props,
    className: cn(styles, props.className),
    style: {
      ...style,
      ...props.style,
      ...(duration === undefined ? {} : {"--shimmer-duration": `${duration}ms`}),
      ...(spread === undefined
        ? {}
        : {"--shimmer-spread": typeof spread === "number" ? `${spread}px` : spread}),
      ...(angle === undefined ? {} : {"--shimmer-angle": `${angle}deg`}),
    } as CSSProperties,
  });

  return {Component, children, getShimmerTextProps};
}

export type UseShimmerTextReturn = ReturnType<typeof useShimmerText>;
