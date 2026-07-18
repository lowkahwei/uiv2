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
  },
  defaultVariants: {
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
