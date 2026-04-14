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
    uploadCardWrapper: "flex w-full justify-center",
    uploadCard:
      "relative flex max-w-full items-center justify-center overflow-hidden border border-default-200/80 bg-content1/95 px-4 py-2 shadow-lg backdrop-blur-md",
    uploadCardOverlay:
      "pointer-events-none absolute inset-0 bg-gradient-to-br from-default-100/80 via-transparent to-default-200/40 opacity-80",
    uploadedContent: "w-full",
    idleContent: "flex w-full items-center justify-center",
    idleCard: "relative flex items-center justify-center",
    idleLabel: "px-4 text-small font-medium text-default-500",
    iconWrapper: "flex items-center justify-center text-default-500",
    icon: "shrink-0",
    detailCard: "relative flex w-full items-center gap-3 text-left",
    clearButton:
      "absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full text-default-400 transition-colors hover:text-danger",
    clearButtonIcon: "size-6",
    fileIconWrapper: "relative flex shrink-0 items-center justify-center text-default-500",
    fileIcon: "text-default-400",
    fileTypeBadge:
      "absolute bottom-3 left-0 rounded-full bg-foreground px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-[0.08em] text-background",
    fileInfo: "min-w-0 flex-1",
    fileName: "truncate text-small font-semibold text-foreground",
    fileMeta: "mt-1 flex flex-wrap items-center gap-2 text-tiny text-default-500",
    previewWrapper: "flex w-full flex-col gap-3",
    previewImage:
      "block h-auto max-h-[24rem] w-full rounded-large border border-default-200 bg-default-50 object-contain",
    title: "text-medium font-semibold leading-6 text-foreground",
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
        uploadCard: "px-3 py-2",
        clearButton: "size-6",
        clearButtonIcon: "size-5",
        fileIconWrapper: "size-10",
        fileIcon: "size-10",
        iconWrapper: "size-12",
        icon: "size-6",
        title: "text-small",
      },
      md: {
        base: "min-h-40 gap-4 px-6 py-8 rounded-[1.25rem]",
        uploadCard: "px-4 py-2",
        clearButton: "size-7",
        fileIconWrapper: "size-12",
        fileIcon: "size-12",
        iconWrapper: "size-14",
        icon: "size-7",
      },
      lg: {
        base: "min-h-52 gap-5 px-8 py-10 rounded-[1.5rem]",
        uploadCard: "px-5 py-3",
        clearButton: "size-8",
        clearButtonIcon: "size-6",
        fileIconWrapper: "size-14",
        fileIcon: "size-14",
        iconWrapper: "size-16",
        icon: "size-8",
        fileName: "text-medium",
        fileMeta: "text-small",
        previewImage: "max-h-[28rem]",
        title: "text-large",
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
        uploadCard: "border-default-200/60 bg-default-100/70",
        idleLabel: "text-default-300",
        iconWrapper: "text-default-300",
        clearButton:
          "pointer-events-none text-default-300 hover:bg-default-100 hover:text-default-300",
        fileIconWrapper: "text-default-300",
        fileIcon: "text-default-300",
        fileMeta: "text-default-300",
        title: "text-default-400",
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
        uploadCard: "border-danger/40 bg-danger-50/30",
        idleLabel: "text-danger-600/80",
        iconWrapper: "text-danger",
        clearButton: "text-danger",
        fileIconWrapper: "text-danger",
        fileTypeBadge: "bg-danger text-white",
        fileMeta: "text-danger-500",
        title: "text-danger-700",
        helperText: "text-danger-500",
      },
    },
    disableAnimation: {
      true: {
        base: "transition-none",
        uploadCard: "transition-none",
        iconWrapper: "transition-none",
        clearButton: "transition-none",
      },
      false: {
        base: "transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out",
        uploadCard:
          "transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out",
        iconWrapper: "transition-[background-color,color,transform] duration-200 ease-out",
      },
    },
    hasPreviewImage: {
      true: {},
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
      size: "sm",
      hasPreviewImage: true,
      class: {
        base: "min-h-20 gap-2.5 px-2 py-2 border-none",
      },
    },
    {
      size: "md",
      hasPreviewImage: true,
      class: {
        base: "min-h-32 gap-3 px-2 py-2 border-none",
      },
    },
    {
      size: "lg",
      hasPreviewImage: true,
      class: {
        base: "min-h-40 gap-4 px-2 py-2 border-none",
      },
    },
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
        uploadCard: "group-data-[drop-target=true]:border-foreground",
        iconWrapper: ["text-default-500", "group-data-[drop-target=true]:text-foreground"],
        idleLabel: "group-data-[drop-target=true]:text-foreground",
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
        uploadCard:
          "group-data-[drop-target=true]:border-primary/70 group-data-[drop-target=true]:bg-primary-50/80",
        iconWrapper: ["text-primary", "group-data-[drop-target=true]:text-primary-foreground"],
        idleLabel: "group-data-[drop-target=true]:text-primary-700",
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
        uploadCard:
          "group-data-[drop-target=true]:border-secondary/70 group-data-[drop-target=true]:bg-secondary-50/80",
        iconWrapper: ["text-secondary", "group-data-[drop-target=true]:text-secondary-foreground"],
        idleLabel: "group-data-[drop-target=true]:text-secondary-700",
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
        uploadCard:
          "group-data-[drop-target=true]:border-success/70 group-data-[drop-target=true]:bg-success-100/60",
        iconWrapper: [
          "text-success-700 dark:text-success-500",
          "group-data-[drop-target=true]:text-success-foreground",
        ],
        idleLabel:
          "group-data-[drop-target=true]:text-success-700 dark:group-data-[drop-target=true]:text-success-500",
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
        uploadCard:
          "group-data-[drop-target=true]:border-warning/70 group-data-[drop-target=true]:bg-warning-100/60",
        iconWrapper: [
          "text-warning-700 dark:text-warning-500",
          "group-data-[drop-target=true]:text-warning-foreground",
        ],
        idleLabel:
          "group-data-[drop-target=true]:text-warning-700 dark:group-data-[drop-target=true]:text-warning-500",
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
        uploadCard:
          "group-data-[drop-target=true]:border-danger/70 group-data-[drop-target=true]:bg-danger-50/80",
        iconWrapper: ["text-danger", "group-data-[drop-target=true]:text-danger-foreground"],
        idleLabel: "group-data-[drop-target=true]:text-danger-700",
        title: "group-data-[drop-target=true]:text-danger-700",
      },
    },
  ],
});

export type DropZoneVariantProps = VariantProps<typeof dropZone>;
export type DropZoneSlots = keyof ReturnType<typeof dropZone>;

export {dropZone};
