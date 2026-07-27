import type {VariantProps} from "tailwind-variants";

import {tv} from "../utils/tv";

const accentColor = [
  "text-[color:color-mix(in_oklab,oklch(0.6204_0.195_253.83)_70%,oklch(0.2103_0.0059_285.89)_30%)]",
  "dark:text-[color:color-mix(in_oklab,oklch(0.6204_0.195_253.83)_80%,oklch(0.9911_0_0)_30%)]",
];
const successColor = [
  "text-[color:color-mix(in_oklab,oklch(0.7329_0.1935_150.81)_80%,oklch(0.2103_0.0059_285.89)_60%)]",
  "dark:text-[color:color-mix(in_oklab,oklch(0.7329_0.1935_150.81)_80%,oklch(0.9911_0_0)_30%)]",
];
const warningColor = [
  "text-[color:color-mix(in_oklab,oklch(0.7819_0.1585_72.33)_80%,oklch(0.2103_0.0059_285.89)_70%)]",
  "dark:text-[color:color-mix(in_oklab,oklch(0.8203_0.1388_76.34)_80%,oklch(0.9911_0_0)_30%)]",
];
const dangerColor = [
  "text-[color:color-mix(in_oklab,oklch(0.6532_0.2328_25.74)_70%,oklch(0.2103_0.0059_285.89)_40%)]",
  "dark:text-[color:color-mix(in_oklab,oklch(0.594_0.1967_24.63)_80%,oklch(0.9911_0_0)_30%)]",
];

const alertVariants = tv({
  slots: {
    base: [
      "flex w-full flex-row items-start justify-start gap-1 px-4 py-3",
      "rounded-[24px] bg-[oklch(100%_0_0)] text-[oklch(0.2103_0.0059_285.89)]",
      "dark:bg-[oklch(0.2103_0.0059_285.89)] dark:text-[oklch(0.9911_0_0)]",
      "shadow-[0_2px_4px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.06),0_0_1px_0_rgba(0,0,0,0.06)]",
      "dark:shadow-none",
    ],
    content: "flex h-full grow flex-col items-start",
    indicator: [
      "flex size-6 shrink-0 items-center justify-center p-1 select-none",
      "[&_[data-slot=alert-default-icon]]:box-content",
      "[&_[data-slot=alert-default-icon]]:size-4",
    ],
    title: "text-small leading-6 font-medium",
    description:
      "text-small text-[oklch(0.5517_0.0138_285.94)] dark:text-[oklch(70.5%_0.015_286.067)]",
  },
  variants: {
    status: {
      default: {
        base: "border-default-300",
        indicator: "text-inherit",
        title: "text-inherit",
      },
      accent: {
        base: "border-primary-300",
        indicator: accentColor,
        title: accentColor,
      },
      success: {
        base: "border-success-300",
        indicator: successColor,
        title: successColor,
      },
      warning: {
        base: "border-warning-300",
        indicator: warningColor,
        title: warningColor,
      },
      danger: {
        base: "border-danger-300",
        indicator: dangerColor,
        title: dangerColor,
      },
    },
    radius: {
      none: {
        base: "rounded-none",
      },
      sm: {
        base: "rounded-small",
      },
      md: {
        base: "rounded-medium",
      },
      lg: {
        base: "rounded-[24px]",
      },
      full: {
        base: "rounded-full",
      },
    },
  },
  defaultVariants: {
    radius: "lg",
    status: "default",
  },
});

export type AlertVariants = VariantProps<typeof alertVariants>;
export type AlertSlots = keyof ReturnType<typeof alertVariants>;

// Backwards-compatible theme aliases. The component API uses the v3 names above.
const alert = alertVariants;

type AlertVariantProps = AlertVariants;

export {alert, alertVariants};
export type {AlertVariantProps};
