import type {VariantProps} from "tailwind-variants";

import {tv} from "../utils/tv";
import {focusVisibleClasses} from "../utils";

/**
 * BottomBar **Tailwind Variants** component.
 *
 * @example
 * ```tsx
 * const {base, list, item, link, selectionIndicator, icon, label} = bottomBar();
 *
 * <nav className={base()}>
 *   <ul className={list()}>
 *     <li className={selectionIndicator()} role="presentation" />
 *     <li className={item()}>
 *       <a className={link()} data-selected="true">
 *         <span className={icon()} />
 *         <span className={label()}>Home</span>
 *       </a>
 *     </li>
 *   </ul>
 * </nav>
 * ```
 */
const bottomBar = tv({
  slots: {
    base: ["z-50", "flex", "w-full", "pointer-events-none", "justify-center", "px-3"],
    list: [
      "relative",
      "flex",
      "w-full",
      "max-w-md",
      "items-center",
      "justify-around",
      "overflow-visible",
      "pointer-events-auto",
      "rounded-full",
      "border",
      "border-divider/60",
      "bg-content1/95",
      "shadow-large",
      "supports-[backdrop-filter]:bg-content1/65",
      "supports-[backdrop-filter]:backdrop-blur-2xl",
      "supports-[backdrop-filter]:backdrop-saturate-150",
    ],
    item: ["relative", "flex", "min-w-0", "flex-1", "list-none", "justify-center"],
    link: [
      "group",
      "relative",
      "isolate",
      "flex",
      "min-h-14",
      "w-full",
      "min-w-0",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-0.5",
      "px-2",
      "text-tiny",
      "font-medium",
      "text-default-500",
      "tap-highlight-transparent",
      "data-[selected=true]:font-semibold",
      "data-[disabled=true]:pointer-events-none",
      "data-[disabled=true]:opacity-disabled",
      "data-[prominent=true]:-translate-y-3",
      "data-[prominent=true]:mx-1",
      "data-[prominent=true]:min-h-16",
      "data-[prominent=true]:max-w-16",
      "data-[prominent=true]:rounded-full",
      "data-[prominent=true]:border",
      "data-[prominent=true]:border-divider/60",
      "data-[prominent=true]:bg-content1/95",
      "data-[prominent=true]:shadow-medium",
      "supports-[backdrop-filter]:data-[prominent=true]:bg-content1/70",
      ...focusVisibleClasses,
    ],
    selectionIndicator: [
      "absolute",
      "z-0",
      "pointer-events-none",
      "list-none",
      "rounded-full",
      "bg-default-100/80",
      "will-change-[left,top,width,height]",
      "invisible",
      "data-[initialized=true]:visible",
    ],
    icon: [
      "relative",
      "z-10",
      "flex",
      "size-6",
      "shrink-0",
      "items-center",
      "justify-center",
      "text-current",
      "[&>svg]:size-full",
    ],
    label: ["relative", "z-10", "max-w-full", "truncate", "text-current"],
  },
  variants: {
    position: {
      fixed: {
        base: ["fixed", "inset-x-0", "bottom-0", "pb-[calc(0.75rem+env(safe-area-inset-bottom))]"],
      },
      sticky: {
        base: ["sticky", "bottom-0", "pb-[calc(0.75rem+env(safe-area-inset-bottom))]"],
      },
      static: {
        base: ["relative", "py-3"],
      },
    },
    color: {
      default: {
        link: "data-[selected=true]:text-foreground",
        selectionIndicator: ["bg-default-200/80", "after:bg-foreground"],
      },
      primary: {
        link: "data-[selected=true]:text-primary",
        selectionIndicator: ["bg-primary/15", "after:bg-primary"],
      },
      secondary: {
        link: "data-[selected=true]:text-secondary",
        selectionIndicator: ["bg-secondary/15", "after:bg-secondary"],
      },
      success: {
        link: "data-[selected=true]:text-success",
        selectionIndicator: ["bg-success/15", "after:bg-success"],
      },
      warning: {
        link: "data-[selected=true]:text-warning",
        selectionIndicator: ["bg-warning/15", "after:bg-warning"],
      },
      danger: {
        link: "data-[selected=true]:text-danger",
        selectionIndicator: ["bg-danger/15", "after:bg-danger"],
      },
    },
    variant: {
      solid: {},
      underlined: {
        selectionIndicator: [
          "bg-transparent",
          "after:absolute",
          "after:bottom-0",
          "after:left-1/2",
          "after:h-[5px]",
          "after:w-5",
          "after:-translate-x-1/2",
          "after:rounded-full",
          "after:content-['']",
        ],
      },
      ghost: {
        selectionIndicator: "bg-transparent",
      },
    },
    hideLabels: {
      always: {
        label: "sr-only",
      },
      selected: {
        label: [
          "max-h-0",
          "opacity-0",
          "group-data-[selected=true]:max-h-5",
          "group-data-[selected=true]:opacity-100",
        ],
      },
      never: {},
    },
    disableAnimation: {
      true: {
        link: "transition-none",
        selectionIndicator: "transition-none",
        icon: "transition-none",
        label: "transition-none",
      },
      false: {
        link: "transition-[color,transform,opacity] duration-250 ease-out",
        selectionIndicator: [
          "data-[animated=true]:transition-[left,top,width,height]",
          "data-[animated=true]:duration-250",
          "data-[animated=true]:ease-out",
        ],
        icon: "transition-transform duration-250 ease-out group-data-[selected=true]:scale-105",
        label: "transition-[color,max-height,opacity] duration-250 ease-out",
      },
    },
  },
  defaultVariants: {
    position: "fixed",
    color: "primary",
    variant: "solid",
    hideLabels: "never",
    disableAnimation: false,
  },
});

export type BottomBarVariantProps = VariantProps<typeof bottomBar>;
export type BottomBarSlots = keyof ReturnType<typeof bottomBar>;
export type BottomBarReturnType = ReturnType<typeof bottomBar>;

export {bottomBar};
