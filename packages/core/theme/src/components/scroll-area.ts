import type {VariantProps} from "tailwind-variants";

import {tv} from "../utils/tv";

/**
 * ScrollArea **Tailwind Variants** component
 *
 * @example
 * ```js
 * const {base, viewport, scrollbar, thumb, corner} = scrollArea({...})
 *
 * <div className={base()}>
 *   <div className={viewport()}>...</div>
 *   <div className={scrollbar()} data-orientation="vertical">
 *     <div className={thumb()} />
 *   </div>
 *   <div className={corner()} />
 * </div>
 * ```
 */
const scrollArea = tv({
  slots: {
    base: ["relative", "overflow-hidden"],
    viewport: ["h-full", "w-full", "rounded-[inherit]", "[&>div]:!block"],
    scrollbar: [
      "group",
      "flex",
      "touch-none",
      "select-none",
      "p-px",
      "transition-[width,height,background-color]",
      "duration-200",
      "data-[orientation=vertical]:h-full",
      "data-[orientation=vertical]:w-2.5",
      "data-[orientation=vertical]:border-l",
      "data-[orientation=vertical]:border-l-transparent",
      "data-[orientation=vertical]:hover:w-3",
      "data-[orientation=horizontal]:h-2.5",
      "data-[orientation=horizontal]:flex-col",
      "data-[orientation=horizontal]:border-t",
      "data-[orientation=horizontal]:border-t-transparent",
      "data-[orientation=horizontal]:hover:h-3",
    ],
    thumb: ["relative", "flex-1", "rounded-full", "bg-default-300", "group-hover:bg-default-400"],
    corner: ["bg-transparent"],
  },
  variants: {
    size: {
      sm: {
        scrollbar: [
          "data-[orientation=vertical]:w-2",
          "data-[orientation=vertical]:hover:w-2.5",
          "data-[orientation=horizontal]:h-2",
          "data-[orientation=horizontal]:hover:h-2.5",
        ],
      },
      md: {},
      lg: {
        scrollbar: [
          "data-[orientation=vertical]:w-3",
          "data-[orientation=vertical]:hover:w-3.5",
          "data-[orientation=horizontal]:h-3",
          "data-[orientation=horizontal]:hover:h-3.5",
        ],
      },
    },
    hideScrollBar: {
      true: {
        scrollbar: "hidden",
      },
      false: {},
    },
    hideScrollBarOnMobile: {
      true: {
        scrollbar: "hidden sm:flex",
      },
      false: {},
    },
  },
  defaultVariants: {
    size: "md",
    hideScrollBar: false,
    hideScrollBarOnMobile: false,
  },
});

export type ScrollAreaVariantProps = VariantProps<typeof scrollArea>;
export type ScrollAreaSlots = keyof ReturnType<typeof scrollArea>;
export type ScrollAreaReturnType = ReturnType<typeof scrollArea>;

export {scrollArea};
