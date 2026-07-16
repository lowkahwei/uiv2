import type {VariantProps} from "tailwind-variants";

import {tv} from "../utils/tv";

/**
 * Modal **Tailwind Variants** component
 *
 * @example
 * ```js
 * const {base} = drawer({...})
 *
 * <div>
 *    <button>Open Drawer</button>
 *    <div className={base()}>
 *       Drawer Content
 *    </div>
 * </div>
 * ```
 */
const drawer = tv({
  slots: {
    base: ["absolute", "m-0", "sm:m-0", "overflow-y-auto"],
    swipeHandle: ["absolute", "z-10", "flex", "touch-none", "select-none"],
    swipeHandleBar: "rounded-full bg-default-300 pointer-events-none",
  },
  variants: {
    size: {
      xs: {
        base: "max-w-xs max-h-[20rem]",
      },
      sm: {
        base: "max-w-sm max-h-[24rem]",
      },
      md: {
        base: "max-w-md max-h-[28rem]",
      },
      lg: {
        base: "max-w-lg max-h-[32rem]",
      },
      xl: {
        base: "max-w-xl max-h-[36rem]",
      },
      "2xl": {
        base: "max-w-2xl max-h-[42rem]",
      },
      "3xl": {
        base: "max-w-3xl max-h-[48rem]",
      },
      "4xl": {
        base: "max-w-4xl max-h-[56rem]",
      },
      "5xl": {
        base: "max-w-5xl max-h-[64rem]",
      },
      full: {
        base: "max-w-full max-h-full h-[100dvh] !rounded-none",
      },
    },
    placement: {
      top: {
        base: [
          "inset-x-0 top-0 max-w-[none] rounded-t-none",
          "[--drawer-translate-x:0] [--drawer-translate-y:-100%]",
        ],
      },
      right: {
        base: [
          "inset-y-0 right-0 max-h-[none] rounded-r-none",
          "[--drawer-translate-x:100%] [--drawer-translate-y:0]",
        ],
      },
      bottom: {
        base: [
          "inset-x-0 bottom-0 max-w-[none] rounded-b-none",
          "[--drawer-translate-x:0] [--drawer-translate-y:100%]",
        ],
      },
      left: {
        base: [
          "inset-y-0 left-0 max-h-[none] rounded-l-none",
          "[--drawer-translate-x:-100%] [--drawer-translate-y:0]",
        ],
      },
    },
    nativeMotion: {
      true: {
        base: [
          "[will-change:translate,transform]",
          "[backface-visibility:hidden]",
          "data-[open=true]:animate-drawer-enter",
          "[&:not([data-open])]:animate-drawer-exit",
          "data-[disable-animation=true]:!animate-none",
        ],
      },
    },
  },
  compoundVariants: [
    {
      placement: ["top", "bottom"],
      class: {
        swipeHandle: "left-1/2 h-8 w-16 -translate-x-1/2 justify-center",
        swipeHandleBar: "h-1 w-9",
      },
    },
    {
      placement: "top",
      class: {
        swipeHandle: "bottom-0 items-end pb-2 cursor-row-resize",
      },
    },
    {
      placement: "bottom",
      class: {
        swipeHandle: "top-0 items-start pt-2 cursor-row-resize",
      },
    },
    {
      placement: ["left", "right"],
      class: {
        swipeHandle: "top-1/2 h-16 w-8 -translate-y-1/2 items-center",
        swipeHandleBar: "h-9 w-1",
      },
    },
    {
      placement: "left",
      class: {
        swipeHandle: "right-0 justify-end pr-2 cursor-col-resize",
      },
    },
    {
      placement: "right",
      class: {
        swipeHandle: "left-0 justify-start pl-2 cursor-col-resize",
      },
    },
  ],
});

export type DrawerVariants = VariantProps<typeof drawer>;

export {drawer};
