import type {VariantProps} from "tailwind-variants";

import {tv} from "../utils/tv";

/**
 * Divider wrapper **Tailwind Variants** component
 *
 * @example
 *
 * const styles = divider()
 *
 * <span className={styles} />
 */
const divider = tv({
  base: "shrink-0 bg-divider border-none",
  variants: {
    orientation: {
      horizontal: "w-full h-divider",
      vertical: "h-auto min-h-2 self-stretch w-divider",
    },
    inset: {
      none: "",
      sm: "relative bg-transparent after:absolute after:bg-divider after:content-['']",
      md: "relative bg-transparent after:absolute after:bg-divider after:content-['']",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      inset: "sm",
      class: "after:left-[10%] after:right-[10%] after:top-0 after:bottom-0",
    },
    {
      orientation: "horizontal",
      inset: "md",
      class: "after:left-1/4 after:right-1/4 after:top-0 after:bottom-0",
    },
    {
      orientation: "vertical",
      inset: "sm",
      class: "after:left-0 after:right-0 after:top-[10%] after:bottom-[10%]",
    },
    {
      orientation: "vertical",
      inset: "md",
      class: "after:left-0 after:right-0 after:top-1/4 after:bottom-1/4",
    },
  ],
  defaultVariants: {
    inset: "none",
    orientation: "horizontal",
  },
});

const labeledDivider = tv({
  slots: {
    base: "flex w-full items-center gap-3",
    line: "h-divider flex-1 bg-divider",
    label: "shrink-0 text-small text-default-500",
  },
});

export type DividerVariantProps = VariantProps<typeof divider>;
export type LabeledDividerSlots = keyof ReturnType<typeof labeledDivider>;

export {divider, labeledDivider};
