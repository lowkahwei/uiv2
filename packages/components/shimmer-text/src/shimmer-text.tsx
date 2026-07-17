import type {UseShimmerTextProps} from "./use-shimmer-text";

import {forwardRef} from "@sytechui/system";

import {useShimmerText} from "./use-shimmer-text";

export interface ShimmerTextProps extends UseShimmerTextProps {}

const ShimmerText = forwardRef<"span", ShimmerTextProps>((props, ref) => {
  const {Component, children, getShimmerTextProps} = useShimmerText(props);

  return (
    <Component ref={ref} {...getShimmerTextProps()}>
      {children}
    </Component>
  );
});

ShimmerText.displayName = "HeroUI.ShimmerText";

export default ShimmerText;
