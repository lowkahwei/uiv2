import type {VariantProps} from "tailwind-variants";

import {tv} from "../utils/tv";
import {colorVariants, dataFocusVisibleClasses} from "../utils";

/**
 * Tabs wrapper **Tailwind Variants** component
 *
 * @example
 * ```js
 * const {base, tabList, tab, panel} = tabs({...})
 *
 * <div className={base())}>
 *  <div className={tabList())}>
 *    <div className={tab())} data-selected="boolean">Tab 1</div>
 *    <div className={tab())} data-selected="boolean" data-disabled="boolean">Tab 2</div>
 *    <div className={tab())} data-selected="boolean">Tab 3</div>
 *  </div>
 *  <div className={panel())}>Selected panel</div>
 * </div>
 * ```
 */
const tabs = tv({
  slots: {
    base: "group relative inline-flex max-w-full bg-default-100",
    scroller: "max-w-full",
    tabList: [
      "relative",
      "inline-flex",
      "p-1",
      "h-fit",
      "gap-2",
      "items-center",
      "flex-nowrap",
      "w-max",
      "min-w-full",
    ],
    scrollPrev: [
      "absolute",
      "z-20",
      "hidden",
      "size-4",
      "items-center",
      "justify-center",
      "rounded-full",
      "bg-transparent",
      "outline-none",
      "text-foreground",
      "transition-opacity",
      "hover:opacity-70",
      "focus-visible:outline-2",
      "focus-visible:outline-focus",
      "group-has-[[data-left-scroll=true]]:flex",
      "group-has-[[data-left-right-scroll=true]]:flex",
      "group-has-[[data-top-scroll=true]]:flex",
      "group-has-[[data-top-bottom-scroll=true]]:flex",
    ],
    scrollNext: [
      "absolute",
      "z-20",
      "hidden",
      "size-4",
      "items-center",
      "justify-center",
      "rounded-full",
      "bg-transparent",
      "outline-none",
      "text-foreground",
      "transition-opacity",
      "hover:opacity-70",
      "focus-visible:outline-2",
      "focus-visible:outline-focus",
      "group-has-[[data-right-scroll=true]]:flex",
      "group-has-[[data-left-right-scroll=true]]:flex",
      "group-has-[[data-bottom-scroll=true]]:flex",
      "group-has-[[data-top-bottom-scroll=true]]:flex",
    ],
    tab: [
      "z-0",
      "w-full",
      "px-3",
      "py-1",
      "flex",
      "group",
      "relative",
      "justify-center",
      "items-center",
      "outline-solid outline-transparent",
      "cursor-pointer",
      "transition-opacity",
      "tap-highlight-transparent",
      "data-[disabled=true]:cursor-not-allowed",
      "data-[disabled=true]:opacity-30",
      "data-[hover-unselected=true]:opacity-disabled",
      // focus ring
      ...dataFocusVisibleClasses,
    ],
    tabContent: [
      "relative",
      "z-10",
      "text-inherit",
      "whitespace-nowrap",
      "transition-colors",
      "text-default-500",
      "group-data-[selected=true]:text-foreground",
    ],
    cursor: [
      "absolute",
      "z-0",
      "bg-white",
      // WebKit can drop nested tab title content when a composited cursor is inside ScrollShadow.
      "will-change-auto",
      "invisible",
      "data-[initialized=true]:visible",
      "data-[animated=true]:transition-[left,top,width,height]",
      "data-[animated=true]:duration-250",
      "data-[animated=true]:ease-out",
    ],
    panel: [
      "py-3",
      "px-1",
      "outline-solid outline-transparent",
      "data-[inert=true]:hidden",
      // focus ring
      ...dataFocusVisibleClasses,
    ],
    tabWrapper: [],
  },
  variants: {
    variant: {
      solid: {},
      light: {
        base: "bg-transparent dark:bg-transparent",
      },
      underlined: {
        base: "bg-transparent dark:bg-transparent",
        cursor: "h-[2px] w-[80%] bottom-0 shadow-[0_1px_0px_0_rgba(0,0,0,0.05)]",
      },
      bordered: {
        base: "bg-transparent dark:bg-transparent border-medium border-default-200 shadow-xs",
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
        base: "rounded-medium",
        tabList: "rounded-medium",
        tab: "h-7 text-tiny rounded-small",
        cursor: "rounded-small",
      },
      md: {
        base: "rounded-medium",
        tabList: "rounded-medium",
        tab: "h-8 text-small rounded-small",
        cursor: "rounded-small",
      },
      lg: {
        base: "rounded-large",
        tabList: "rounded-large",
        tab: "h-9 text-medium rounded-medium",
        cursor: "rounded-medium",
      },
    },
    radius: {
      none: {
        base: "rounded-none",
        tabList: "rounded-none",
        tab: "rounded-none",
        cursor: "rounded-none",
      },
      sm: {
        base: "rounded-medium",
        tabList: "rounded-medium",
        tab: "rounded-small",
        cursor: "rounded-small",
      },
      md: {
        base: "rounded-medium",
        tabList: "rounded-medium",
        tab: "rounded-small",
        cursor: "rounded-small",
      },
      lg: {
        base: "rounded-large",
        tabList: "rounded-large",
        tab: "rounded-medium",
        cursor: "rounded-medium",
      },
      full: {
        base: "rounded-full",
        tabList: "rounded-full",
        tab: "rounded-full",
        cursor: "rounded-full",
      },
    },
    fullWidth: {
      true: {
        base: "w-full",
        scroller: "w-full",
      },
    },
    isDisabled: {
      true: {
        tabList: "opacity-disabled pointer-events-none",
      },
    },
    disableAnimation: {
      true: {
        tab: "transition-none",
        tabContent: "transition-none",
      },
    },
    placement: {
      top: {
        scrollPrev: "top-1/2 left-1 -translate-y-1/2",
        scrollNext: "top-1/2 right-1 -translate-y-1/2",
      },
      start: {
        scroller: "h-full",
        tabList: "min-w-0 flex-col",
        panel: "py-0 px-3",
        tabWrapper: "flex",
        scrollPrev: "top-1 left-1/2 -translate-x-1/2",
        scrollNext: "bottom-1 left-1/2 -translate-x-1/2",
      },
      end: {
        scroller: "h-full",
        tabList: "min-w-0 flex-col",
        panel: "py-0 px-3",
        tabWrapper: "flex flex-row-reverse",
        scrollPrev: "top-1 left-1/2 -translate-x-1/2",
        scrollNext: "bottom-1 left-1/2 -translate-x-1/2",
      },
      bottom: {
        tabWrapper: "flex flex-col-reverse",
        scrollPrev: "top-1/2 left-1 -translate-y-1/2",
        scrollNext: "top-1/2 right-1 -translate-y-1/2",
      },
    },
  },
  defaultVariants: {
    color: "default",
    variant: "solid",
    size: "md",
    fullWidth: false,
    isDisabled: false,
  },
  compoundVariants: [
    /**
     * Variants & Colors
     */
    // solid + bordered + light && color
    {
      variant: ["solid", "bordered", "light"],
      color: "default",
      class: {
        cursor: ["bg-default-50", "dark:bg-default-200", "shadow-small"],
        tabContent: "group-data-[selected=true]:text-default-foreground",
      },
    },
    {
      variant: ["solid", "bordered", "light"],
      color: "primary",
      class: {
        cursor: colorVariants.solid.primary,
        tabContent: "group-data-[selected=true]:text-primary-foreground",
      },
    },
    {
      variant: ["solid", "bordered", "light"],
      color: "secondary",
      class: {
        cursor: colorVariants.solid.secondary,
        tabContent: "group-data-[selected=true]:text-secondary-foreground",
      },
    },
    {
      variant: ["solid", "bordered", "light"],
      color: "success",
      class: {
        cursor: colorVariants.solid.success,
        tabContent: "group-data-[selected=true]:text-success-foreground",
      },
    },
    {
      variant: ["solid", "bordered", "light"],
      color: "warning",
      class: {
        cursor: colorVariants.solid.warning,
        tabContent: "group-data-[selected=true]:text-warning-foreground",
      },
    },
    {
      variant: ["solid", "bordered", "light"],
      color: "danger",
      class: {
        cursor: colorVariants.solid.danger,
        tabContent: "group-data-[selected=true]:text-danger-foreground",
      },
    },
    // underlined && color
    {
      variant: "underlined",
      color: "default",
      class: {
        cursor: "bg-foreground",
        tabContent: "group-data-[selected=true]:text-foreground",
      },
    },
    {
      variant: "underlined",
      color: "primary",
      class: {
        cursor: "bg-primary",
        tabContent: "group-data-[selected=true]:text-primary",
      },
    },
    {
      variant: "underlined",
      color: "secondary",
      class: {
        cursor: "bg-secondary",
        tabContent: "group-data-[selected=true]:text-secondary",
      },
    },
    {
      variant: "underlined",
      color: "success",
      class: {
        cursor: "bg-success",
        tabContent: "group-data-[selected=true]:text-success",
      },
    },
    {
      variant: "underlined",
      color: "warning",
      class: {
        cursor: "bg-warning",
        tabContent: "group-data-[selected=true]:text-warning",
      },
    },
    {
      variant: "underlined",
      color: "danger",
      class: {
        cursor: "bg-danger",
        tabContent: "group-data-[selected=true]:text-danger",
      },
    },
    /**
     * Disable animation & Variants & Colors
     */
    // disabledAnimation && underlined
    {
      disableAnimation: true,
      variant: "underlined",
      class: {
        tab: [
          "after:content-['']",
          "after:absolute",
          "after:bottom-0",
          "after:h-[2px]",
          "after:w-[80%]",
          "after:opacity-0",
          "after:shadow-[0_1px_0px_0_rgba(0,0,0,0.05)]",
          "data-[selected=true]:after:opacity-100",
        ],
      },
    },

    // disableAnimation && color && solid/bordered
    {
      disableAnimation: true,
      color: "default",
      variant: ["solid", "bordered", "light"],
      class: {
        tab: "data-[selected=true]:bg-default data-[selected=true]:text-default-foreground",
      },
    },
    {
      disableAnimation: true,
      color: "primary",
      variant: ["solid", "bordered", "light"],
      class: {
        tab: "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
      },
    },
    {
      disableAnimation: true,
      color: "secondary",
      variant: ["solid", "bordered", "light"],
      class: {
        tab: "data-[selected=true]:bg-secondary data-[selected=true]:text-secondary-foreground",
      },
    },
    {
      disableAnimation: true,
      color: "success",
      variant: ["solid", "bordered", "light"],
      class: {
        tab: "data-[selected=true]:bg-success data-[selected=true]:text-success-foreground",
      },
    },
    {
      disableAnimation: true,
      color: "warning",
      variant: ["solid", "bordered", "light"],
      class: {
        tab: "data-[selected=true]:bg-warning data-[selected=true]:text-warning-foreground",
      },
    },
    {
      disableAnimation: true,
      color: "danger",
      variant: ["solid", "bordered", "light"],
      class: {
        tab: "data-[selected=true]:bg-danger data-[selected=true]:text-danger-foreground",
      },
    },
    // disableAnimation && color && underlined
    {
      disableAnimation: true,
      color: "default",
      variant: "underlined",
      class: {
        tab: "data-[selected=true]:after:bg-foreground",
      },
    },
    {
      disableAnimation: true,
      color: "primary",
      variant: "underlined",
      class: {
        tab: "data-[selected=true]:after:bg-primary",
      },
    },
    {
      disableAnimation: true,
      color: "secondary",
      variant: "underlined",
      class: {
        tab: "data-[selected=true]:after:bg-secondary",
      },
    },
    {
      disableAnimation: true,
      color: "success",
      variant: "underlined",
      class: {
        tab: "data-[selected=true]:after:bg-success",
      },
    },
    {
      disableAnimation: true,
      color: "warning",
      variant: "underlined",
      class: {
        tab: "data-[selected=true]:after:bg-warning",
      },
    },
    {
      disableAnimation: true,
      color: "danger",
      variant: "underlined",
      class: {
        tab: "data-[selected=true]:after:bg-danger",
      },
    },
  ],
  compoundSlots: [
    {
      variant: "underlined",
      slots: ["tab", "tabList", "cursor"],
      class: ["rounded-none"],
    },
  ],
});

export type TabsVariantProps = VariantProps<typeof tabs>;
export type TabsSlots = keyof ReturnType<typeof tabs>;
export type TabsReturnType = ReturnType<typeof tabs>;

export {tabs};
