import type {VariantProps} from "tailwind-variants";

import {tv} from "../utils/tv";

const shimmerText = tv({
  base: "sytech-shimmer-text animate-shimmer-text",
  variants: {
    once: {
      true: "sytech-shimmer-text-once",
      false: "",
    },
    reverse: {
      true: "sytech-shimmer-text-reverse",
      false: "",
    },
    disableAnimation: {
      true: "sytech-shimmer-text-disabled !animate-none",
      false: "",
    },
  },
  defaultVariants: {
    once: false,
    reverse: false,
    disableAnimation: false,
  },
});

export type ShimmerTextVariantProps = VariantProps<typeof shimmerText>;

export {shimmerText};
