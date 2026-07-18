import type {VariantProps} from "tailwind-variants";

import {dataFocusVisibleClasses} from "../utils";
import {tv} from "../utils/tv";

const stepper = tv({
  slots: {
    base: "w-full",
    list: "m-0 flex list-none p-0",
    item: "group/item flex min-w-0",
    trigger: [
      "group/trigger flex min-w-0 shrink-0 outline-solid outline-transparent",
      "tap-highlight-transparent",
      ...dataFocusVisibleClasses,
      "data-[clickable=true]:cursor-pointer",
      "data-[disabled=true]:cursor-not-allowed",
      "data-[disabled=true]:opacity-disabled",
    ],
    indicator: [
      "flex shrink-0 items-center justify-center rounded-full border-2 font-semibold",
      "border-default-300 bg-default-100 text-default-500",
      "group-data-[hover=true]/trigger:scale-105",
      "group-data-[pressed=true]/trigger:scale-95",
      "data-[status=error]:border-danger",
      "data-[status=error]:bg-danger",
      "data-[status=error]:text-danger-foreground",
    ],
    content: "flex min-w-0 flex-col",
    title: [
      "text-default-500",
      "group-data-[current=true]/item:text-foreground",
      "group-data-[status=complete]/item:text-foreground",
      "group-data-[status=error]/item:text-danger",
    ],
    description: "text-default-400",
    separator: "shrink-0 bg-default-200",
  },
  variants: {
    orientation: {
      horizontal: {
        base: "overflow-x-auto scrollbar-hide",
        list: "min-w-max flex-row items-start",
        item: "flex-1 flex-row items-start last:flex-none",
        trigger: "flex-col items-center text-center",
        content: "mt-2 items-center",
        separator: "mx-2 flex-1",
      },
      vertical: {
        list: "flex-col",
        item: "flex-col",
        trigger: "flex-row items-start text-start",
        content: "ms-3 items-start",
        separator: "my-1",
      },
    },
    variant: {
      solid: {},
      bordered: {},
      flat: {},
      dot: {},
    },
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    size: {
      sm: {
        indicator: "h-6 w-6 text-tiny",
        title: "text-tiny",
        description: "text-tiny",
      },
      md: {
        indicator: "h-8 w-8 text-small",
        title: "text-small",
        description: "text-tiny",
      },
      lg: {
        indicator: "h-10 w-10 text-medium",
        title: "text-medium",
        description: "text-small",
      },
    },
    radius: {
      none: {
        indicator: "rounded-none",
      },
      sm: {
        indicator: "rounded-small",
      },
      md: {
        indicator: "rounded-medium",
      },
      lg: {
        indicator: "rounded-large",
      },
      full: {
        indicator: "rounded-full",
      },
    },
    separatorMode: {
      spaced: {},
      connected: {},
    },
    isDisabled: {
      true: {
        base: "pointer-events-none opacity-disabled",
      },
    },
    disableAnimation: {
      false: {
        indicator: "transition-transform",
      },
      true: {
        indicator: "transition-none",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "solid",
    color: "primary",
    size: "md",
    radius: "full",
    separatorMode: "spaced",
    isDisabled: false,
    disableAnimation: false,
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      size: "sm",
      class: {separator: "mt-[11px] h-0.5"},
    },
    {
      orientation: "horizontal",
      size: "md",
      class: {separator: "mt-[15px] h-0.5"},
    },
    {
      orientation: "horizontal",
      size: "lg",
      class: {separator: "mt-[19px] h-0.5"},
    },
    {
      orientation: "vertical",
      size: "sm",
      class: {separator: "ms-[11px] h-6 w-0.5"},
    },
    {
      orientation: "vertical",
      size: "md",
      class: {separator: "ms-[15px] h-7 w-0.5"},
    },
    {
      orientation: "vertical",
      size: "lg",
      class: {separator: "ms-[19px] h-8 w-0.5"},
    },
    {
      separatorMode: "connected",
      orientation: "horizontal",
      class: {
        item: [
          "first:[&_[data-slot=content]]:items-start",
          "last:[&_[data-slot=content]]:items-end",
        ],
        trigger: "flex-none",
        content: "w-0 overflow-visible whitespace-nowrap",
        separator: "mx-0",
      },
    },
    {
      separatorMode: "connected",
      orientation: "vertical",
      class: {
        item: "relative",
        separator: "absolute bottom-0 my-0 h-auto",
      },
    },
    {
      separatorMode: "connected",
      orientation: "vertical",
      size: "sm",
      class: {separator: "start-[11px] top-6 ms-0"},
    },
    {
      separatorMode: "connected",
      orientation: "vertical",
      size: "md",
      class: {separator: "start-[15px] top-8 ms-0"},
    },
    {
      separatorMode: "connected",
      orientation: "vertical",
      size: "lg",
      class: {separator: "start-[19px] top-10 ms-0"},
    },
    {
      variant: "dot",
      orientation: "horizontal",
      size: "sm",
      class: {indicator: "h-2 w-2 border-0", separator: "mt-[3px]"},
    },
    {
      variant: "dot",
      orientation: "horizontal",
      size: "md",
      class: {indicator: "h-2.5 w-2.5 border-0", separator: "mt-[4px]"},
    },
    {
      variant: "dot",
      orientation: "horizontal",
      size: "lg",
      class: {indicator: "h-3 w-3 border-0", separator: "mt-[5px]"},
    },
    {
      variant: "dot",
      orientation: "vertical",
      size: "sm",
      class: {indicator: "h-2 w-2 border-0", separator: "ms-[3px]"},
    },
    {
      variant: "dot",
      orientation: "vertical",
      size: "md",
      class: {indicator: "h-2.5 w-2.5 border-0", separator: "ms-[4px]"},
    },
    {
      variant: "dot",
      orientation: "vertical",
      size: "lg",
      class: {indicator: "h-3 w-3 border-0", separator: "ms-[5px]"},
    },
    {
      separatorMode: "connected",
      variant: "dot",
      orientation: "vertical",
      size: "sm",
      class: {
        separator: "start-[3px] top-2 ms-0",
      },
    },
    {
      separatorMode: "connected",
      variant: "dot",
      orientation: "vertical",
      size: "md",
      class: {separator: "start-[4px] top-2.5 ms-0"},
    },
    {
      separatorMode: "connected",
      variant: "dot",
      orientation: "vertical",
      size: "lg",
      class: {separator: "start-[5px] top-3 ms-0"},
    },
    {
      variant: "solid",
      color: "default",
      class: {
        indicator: [
          "data-[status=current]:border-default-foreground",
          "data-[status=current]:bg-default-foreground",
          "data-[status=current]:text-background",
          "data-[status=complete]:border-default-foreground",
          "data-[status=complete]:bg-default-foreground",
          "data-[status=complete]:text-background",
          "data-[status=loading]:border-default-foreground",
          "data-[status=loading]:bg-default-foreground",
          "data-[status=loading]:text-background",
        ],
        separator: "data-[status=complete]:bg-default-foreground",
      },
    },
    {
      variant: "solid",
      color: "primary",
      class: {
        indicator: [
          "data-[status=current]:border-primary data-[status=current]:bg-primary",
          "data-[status=current]:text-primary-foreground",
          "data-[status=complete]:border-primary data-[status=complete]:bg-primary",
          "data-[status=complete]:text-primary-foreground",
          "data-[status=loading]:border-primary data-[status=loading]:bg-primary",
          "data-[status=loading]:text-primary-foreground",
        ],
        separator: "data-[status=complete]:bg-primary",
      },
    },
    {
      variant: "solid",
      color: "secondary",
      class: {
        indicator: [
          "data-[status=current]:border-secondary data-[status=current]:bg-secondary",
          "data-[status=current]:text-secondary-foreground",
          "data-[status=complete]:border-secondary data-[status=complete]:bg-secondary",
          "data-[status=complete]:text-secondary-foreground",
          "data-[status=loading]:border-secondary data-[status=loading]:bg-secondary",
          "data-[status=loading]:text-secondary-foreground",
        ],
        separator: "data-[status=complete]:bg-secondary",
      },
    },
    {
      variant: "solid",
      color: "success",
      class: {
        indicator: [
          "data-[status=current]:border-success data-[status=current]:bg-success",
          "data-[status=current]:text-success-foreground",
          "data-[status=complete]:border-success data-[status=complete]:bg-success",
          "data-[status=complete]:text-success-foreground",
          "data-[status=loading]:border-success data-[status=loading]:bg-success",
          "data-[status=loading]:text-success-foreground",
        ],
        separator: "data-[status=complete]:bg-success",
      },
    },
    {
      variant: "solid",
      color: "warning",
      class: {
        indicator: [
          "data-[status=current]:border-warning data-[status=current]:bg-warning",
          "data-[status=current]:text-warning-foreground",
          "data-[status=complete]:border-warning data-[status=complete]:bg-warning",
          "data-[status=complete]:text-warning-foreground",
          "data-[status=loading]:border-warning data-[status=loading]:bg-warning",
          "data-[status=loading]:text-warning-foreground",
        ],
        separator: "data-[status=complete]:bg-warning",
      },
    },
    {
      variant: "solid",
      color: "danger",
      class: {
        indicator: [
          "data-[status=current]:border-danger data-[status=current]:bg-danger",
          "data-[status=current]:text-danger-foreground",
          "data-[status=complete]:border-danger data-[status=complete]:bg-danger",
          "data-[status=complete]:text-danger-foreground",
          "data-[status=loading]:border-danger data-[status=loading]:bg-danger",
          "data-[status=loading]:text-danger-foreground",
        ],
        separator: "data-[status=complete]:bg-danger",
      },
    },
    {
      variant: ["bordered", "flat"],
      color: "default",
      class: {
        indicator: [
          "data-[status=current]:border-default-foreground",
          "data-[status=current]:text-default-foreground",
          "data-[status=complete]:border-default-foreground",
          "data-[status=complete]:text-default-foreground",
          "data-[status=loading]:border-default-foreground",
          "data-[status=loading]:text-default-foreground",
        ],
        separator: "data-[status=complete]:bg-default-foreground",
      },
    },
    {
      variant: ["bordered", "flat"],
      color: "primary",
      class: {
        indicator: [
          "data-[status=current]:border-primary data-[status=current]:text-primary",
          "data-[status=complete]:border-primary data-[status=complete]:text-primary",
          "data-[status=loading]:border-primary data-[status=loading]:text-primary",
        ],
        separator: "data-[status=complete]:bg-primary",
      },
    },
    {
      variant: ["bordered", "flat"],
      color: "secondary",
      class: {
        indicator: [
          "data-[status=current]:border-secondary data-[status=current]:text-secondary",
          "data-[status=complete]:border-secondary data-[status=complete]:text-secondary",
          "data-[status=loading]:border-secondary data-[status=loading]:text-secondary",
        ],
        separator: "data-[status=complete]:bg-secondary",
      },
    },
    {
      variant: ["bordered", "flat"],
      color: "success",
      class: {
        indicator: [
          "data-[status=current]:border-success data-[status=current]:text-success",
          "data-[status=complete]:border-success data-[status=complete]:text-success",
          "data-[status=loading]:border-success data-[status=loading]:text-success",
        ],
        separator: "data-[status=complete]:bg-success",
      },
    },
    {
      variant: ["bordered", "flat"],
      color: "warning",
      class: {
        indicator: [
          "data-[status=current]:border-warning data-[status=current]:text-warning",
          "data-[status=complete]:border-warning data-[status=complete]:text-warning",
          "data-[status=loading]:border-warning data-[status=loading]:text-warning",
        ],
        separator: "data-[status=complete]:bg-warning",
      },
    },
    {
      variant: ["bordered", "flat"],
      color: "danger",
      class: {
        indicator: [
          "data-[status=current]:border-danger data-[status=current]:text-danger",
          "data-[status=complete]:border-danger data-[status=complete]:text-danger",
          "data-[status=loading]:border-danger data-[status=loading]:text-danger",
        ],
        separator: "data-[status=complete]:bg-danger",
      },
    },
    {
      variant: "flat",
      color: "default",
      class: {
        indicator: [
          "data-[status=current]:bg-default-200",
          "data-[status=complete]:bg-default-200",
          "data-[status=loading]:bg-default-200",
        ],
      },
    },
    {
      variant: "flat",
      color: "primary",
      class: {
        indicator: [
          "data-[status=current]:bg-primary/20",
          "data-[status=complete]:bg-primary/20",
          "data-[status=loading]:bg-primary/20",
        ],
      },
    },
    {
      variant: "flat",
      color: "secondary",
      class: {
        indicator: [
          "data-[status=current]:bg-secondary/20",
          "data-[status=complete]:bg-secondary/20",
          "data-[status=loading]:bg-secondary/20",
        ],
      },
    },
    {
      variant: "flat",
      color: "success",
      class: {
        indicator: [
          "data-[status=current]:bg-success/20",
          "data-[status=complete]:bg-success/20",
          "data-[status=loading]:bg-success/20",
        ],
      },
    },
    {
      variant: "flat",
      color: "warning",
      class: {
        indicator: [
          "data-[status=current]:bg-warning/20",
          "data-[status=complete]:bg-warning/20",
          "data-[status=loading]:bg-warning/20",
        ],
      },
    },
    {
      variant: "flat",
      color: "danger",
      class: {
        indicator: [
          "data-[status=current]:bg-danger/20",
          "data-[status=complete]:bg-danger/20",
          "data-[status=loading]:bg-danger/20",
        ],
      },
    },
    {
      variant: "dot",
      color: "default",
      class: {
        indicator: [
          "data-[status=current]:bg-default-foreground",
          "data-[status=complete]:bg-default-foreground",
          "data-[status=loading]:bg-default-foreground",
        ],
        separator: "data-[status=complete]:bg-default-foreground",
      },
    },
    {
      variant: "dot",
      color: "primary",
      class: {
        indicator: [
          "data-[status=current]:bg-primary",
          "data-[status=complete]:bg-primary",
          "data-[status=loading]:bg-primary",
        ],
        separator: "data-[status=complete]:bg-primary",
      },
    },
    {
      variant: "dot",
      color: "secondary",
      class: {
        indicator: [
          "data-[status=current]:bg-secondary",
          "data-[status=complete]:bg-secondary",
          "data-[status=loading]:bg-secondary",
        ],
        separator: "data-[status=complete]:bg-secondary",
      },
    },
    {
      variant: "dot",
      color: "success",
      class: {
        indicator: [
          "data-[status=current]:bg-success",
          "data-[status=complete]:bg-success",
          "data-[status=loading]:bg-success",
        ],
        separator: "data-[status=complete]:bg-success",
      },
    },
    {
      variant: "dot",
      color: "warning",
      class: {
        indicator: [
          "data-[status=current]:bg-warning",
          "data-[status=complete]:bg-warning",
          "data-[status=loading]:bg-warning",
        ],
        separator: "data-[status=complete]:bg-warning",
      },
    },
    {
      variant: "dot",
      color: "danger",
      class: {
        indicator: [
          "data-[status=current]:bg-danger",
          "data-[status=complete]:bg-danger",
          "data-[status=loading]:bg-danger",
        ],
        separator: "data-[status=complete]:bg-danger",
      },
    },
  ],
});

export type StepperVariantProps = VariantProps<typeof stepper>;
export type StepperSlots = keyof ReturnType<typeof stepper>;
export type StepperReturnType = ReturnType<typeof stepper>;

export {stepper};
