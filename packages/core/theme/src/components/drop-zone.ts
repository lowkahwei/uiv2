import type {VariantProps} from "tailwind-variants";

import {dataFocusVisibleClasses} from "../utils";
import {tv} from "../utils/tv";

const dropZone = tv({
  slots: {
    base: [
      "group",
      "relative",
      "flex",
      "w-full",
      "flex-col",
      "items-center",
      "justify-center",
      "overflow-hidden",
      "border-2",
      "border-dashed",
      "text-center",
      "outline-none",
      "select-none",
      "cursor-pointer",
      "bg-content1",
      "text-foreground",
      ...dataFocusVisibleClasses,
    ],
    content: "flex w-full max-w-xl flex-col items-center justify-center gap-2",
    iconWrapper: "flex items-center justify-center text-default-500",
    icon: "shrink-0",
    title: "text-medium font-semibold leading-6 text-foreground",
    description: "text-small leading-5 text-default-500",
    helperText: "text-tiny leading-5 text-default-400",
  },
  variants: {
    variant: {
      bordered: {
        base: "bg-content1 border-default-300",
      },
      flat: {
        base: "border-transparent bg-default-100/80",
      },
      faded: {
        base: "border-default-200 bg-default-50/80",
      },
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
        base: "min-h-24 gap-3 px-4 py-6 rounded-large",
        iconWrapper: "size-12",
        icon: "size-6",
        title: "text-small",
      },
      md: {
        base: "min-h-40 gap-4 px-6 py-8 rounded-[1.25rem]",
        iconWrapper: "size-14",
        icon: "size-7",
      },
      lg: {
        base: "min-h-52 gap-5 px-8 py-10 rounded-[1.5rem]",
        iconWrapper: "size-16",
        icon: "size-8",
        title: "text-large",
        description: "text-medium",
      },
    },
    radius: {
      none: {
        base: "rounded-none",
      },
      sm: {
        base: "rounded-medium",
      },
      md: {
        base: "rounded-large",
      },
      lg: {
        base: "rounded-[1.5rem]",
      },
      full: {
        base: "rounded-[2rem]",
      },
    },
    isDisabled: {
      true: {
        base: "cursor-not-allowed border-default-200 bg-default-100/60 opacity-disabled",
        iconWrapper: "text-default-300",
        title: "text-default-400",
        description: "text-default-300",
        helperText: "text-default-300",
      },
    },
    isInvalid: {
      true: {
        base: [
          "border-danger bg-danger-50/40",
          "data-[hover=true]:border-danger",
          "data-[drop-target=true]:border-danger",
          "data-[drop-target=true]:bg-danger-50/60",
        ],
        iconWrapper: "text-danger",
        title: "text-danger-700",
        description: "text-danger-600/80",
        helperText: "text-danger-500",
      },
    },
    disableAnimation: {
      true: {
        base: "transition-none",
        iconWrapper: "transition-none",
      },
      false: {
        base: "transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out",
        iconWrapper: "transition-[background-color,color,transform] duration-200 ease-out",
      },
    },
  },
  defaultVariants: {
    variant: "bordered",
    color: "primary",
    size: "md",
    radius: "lg",
    disableAnimation: false,
  },
  compoundVariants: [
    {
      color: "default",
      isInvalid: false,
      class: {
        base: [
          "data-[hover=true]:border-default-400",
          "data-[drop-target=true]:border-foreground",
          "data-[drop-target=true]:bg-default-100/70",
          "data-[focus-visible=true]:border-foreground",
        ],
        iconWrapper: ["text-default-500", "group-data-[drop-target=true]:text-foreground"],
      },
    },
    {
      color: "primary",
      isInvalid: false,
      class: {
        base: [
          "data-[hover=true]:border-primary-400",
          "data-[drop-target=true]:border-primary",
          "data-[drop-target=true]:bg-primary-50",
          "data-[focus-visible=true]:border-primary",
        ],
        iconWrapper: ["text-primary", "group-data-[drop-target=true]:text-primary-foreground"],
        title: "group-data-[drop-target=true]:text-primary-700",
      },
    },
    {
      color: "secondary",
      isInvalid: false,
      class: {
        base: [
          "data-[hover=true]:border-secondary-400",
          "data-[drop-target=true]:border-secondary",
          "data-[drop-target=true]:bg-secondary-50",
          "data-[focus-visible=true]:border-secondary",
        ],
        iconWrapper: ["text-secondary", "group-data-[drop-target=true]:text-secondary-foreground"],
        title: "group-data-[drop-target=true]:text-secondary-700",
      },
    },
    {
      color: "success",
      isInvalid: false,
      class: {
        base: [
          "data-[hover=true]:border-success-400",
          "data-[drop-target=true]:border-success",
          "data-[drop-target=true]:bg-success-100/70",
          "data-[focus-visible=true]:border-success",
        ],
        iconWrapper: [
          "text-success-700 dark:text-success-500",
          "group-data-[drop-target=true]:text-success-foreground",
        ],
        title:
          "group-data-[drop-target=true]:text-success-700 dark:group-data-[drop-target=true]:text-success-500",
      },
    },
    {
      color: "warning",
      isInvalid: false,
      class: {
        base: [
          "data-[hover=true]:border-warning-400",
          "data-[drop-target=true]:border-warning",
          "data-[drop-target=true]:bg-warning-100/70",
          "data-[focus-visible=true]:border-warning",
        ],
        iconWrapper: [
          "text-warning-700 dark:text-warning-500",
          "group-data-[drop-target=true]:text-warning-foreground",
        ],
        title:
          "group-data-[drop-target=true]:text-warning-700 dark:group-data-[drop-target=true]:text-warning-500",
      },
    },
    {
      color: "danger",
      isInvalid: false,
      class: {
        base: [
          "data-[hover=true]:border-danger-400",
          "data-[drop-target=true]:border-danger",
          "data-[drop-target=true]:bg-danger-50/70",
          "data-[focus-visible=true]:border-danger",
        ],
        iconWrapper: ["text-danger", "group-data-[drop-target=true]:text-danger-foreground"],
        title: "group-data-[drop-target=true]:text-danger-700",
      },
    },
  ],
});

export type DropZoneVariantProps = VariantProps<typeof dropZone>;
export type DropZoneSlots = keyof ReturnType<typeof dropZone>;

export {dropZone};
