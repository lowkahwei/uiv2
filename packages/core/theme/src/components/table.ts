import type {VariantProps} from "tailwind-variants";

import {dataFocusVisibleClasses} from "../utils";
import {tv} from "../utils/tv";

/**
 * Table **Tailwind Variants** component
 *
 * @example
 * ```js
 * const {base, table, thead, tbody, tr, th, td, tfoot} = table({...})
 *
 * <div className={base()}>
 *   <table className={table()}>
 *    <thead className={thead()}>
 *      <tr className={tr()}>
 *        <th className={th()}>...</th>
 *        <th className={th()}>...</th>
 *      </tr>
 *    </thead>
 *    <tbody className={tbody()}>
 *      <tr className={tr()}>
 *        <td className={td()}>...</td>
 *        <td className={td()}>...</td>
 *      </tr>
 *      <tr className={tr()}>
 *        <td className={td()}>...</td>
 *        <td className={td()}>...</td>
 *     </tr>
 *   </tbody>
 *    <tfoot className={tfoot()}>
 *      <tr className={tr()}>
 *        <td className={td()}>...</td>
 *        <td className={td()}>...</td>
 *      </tr>
 *    </tfoot>
 *  </table>
 * </div>
 * ```
 */
const table = tv({
  slots: {
    base: "flex flex-col relative gap-4",
    wrapper: [
      "p-4",
      "z-0",
      "flex",
      "flex-col",
      "relative",
      "justify-between",
      "gap-4",
      "shadow-small",
      "bg-content1",
    ],
    scrollContainer: ["scrollbar", "overflow-x-auto"],
    resizableContainer: ["relative", "scrollbar", "overflow-auto"],
    table: "min-w-full h-auto",
    thead: [
      // VirtualizerItem wraps each column, so round via the header row rather than the column.
      "[&>[role=row]>[role=presentation]:first-child>[role=columnheader]]:rounded-s-lg",
      "[&>[role=row]>[role=presentation]:last-child>[role=columnheader]]:rounded-e-lg",
      "[&>[role=row]>[role=presentation]:last-child>[role=columnheader]]:before:hidden",
      "[&>[role=row]>[role=presentation]:last-child>[role=columnheader]>[data-slot=table-column-resizer]]:hidden",
      "[&>tr>th:last-child>[data-slot=table-column-resizer]]:hidden",
    ],
    tbody: [
      "[&:is(tbody)]:after:block",
      // A virtualized body is a div. Clip it instead of relying on first/last table cells.
      "[&:not(tbody)]:relative",
      "[&:not(tbody)]:h-full",
      "[&:not(tbody)]:overflow-hidden",
      "[&:not(tbody)]:rounded-lg",
    ],
    tr: [
      "group/tr",
      "outline-solid outline-transparent",
      "[&:not(tr)]:h-full",
      ...dataFocusVisibleClasses,
    ],
    th: [
      "group/th",
      "relative",
      "px-3",
      "h-10",
      "text-start",
      "align-middle",
      "bg-default-100",
      "whitespace-nowrap",
      "text-foreground-500",
      "text-tiny",
      "font-semibold",
      "[&:not(th)]:flex [&:not(th)]:items-center",
      "[&:is(th):first-child]:rounded-s-lg",
      "[&:is(th):last-child]:rounded-e-lg",
      "[&:is(th):last-child]:before:hidden",
      "before:pointer-events-none",
      "before:absolute",
      "before:end-0",
      "before:top-1/2",
      "before:h-4",
      "before:w-px",
      "before:-translate-y-1/2",
      "before:rounded-small",
      "before:bg-default-300",
      "before:content-['']",
      "outline-solid outline-transparent",
      "data-[allows-sorting]:cursor-pointer",
      ...dataFocusVisibleClasses,
    ],
    columnResizer: [
      "absolute",
      "end-0",
      "top-1/2",
      "h-4",
      "w-px",
      "-translate-y-1/2",
      "translate-x-1/2",
      "rounded-small",
      "bg-default-300",
      "bg-clip-content",
      "box-content",
      "cursor-col-resize",
      "touch-none",
      "border-none",
      "outline-none",
      "px-2",
      "data-[hovered=true]:h-full",
      "data-[hovered=true]:w-0.5",
      "data-[hovered=true]:bg-primary",
      "data-[resizing=true]:h-full",
      "data-[resizing=true]:w-0.5",
      "data-[resizing=true]:bg-primary",
      "data-[focus-visible=true]:h-full",
      "data-[focus-visible=true]:w-0.5",
      "data-[focus-visible=true]:bg-focus",
    ],
    td: [
      "py-2",
      "px-3",
      "relative",
      "isolate",
      "z-0",
      "align-middle",
      "whitespace-normal",
      "text-small",
      "font-normal",
      "[&:not(td)]:h-full",
      "outline-solid outline-transparent",
      "[&>*]:z-1",
      "[&>*]:relative",
      ...dataFocusVisibleClasses,
      // before content for selection
      "before:pointer-events-none",
      "before:content-['']",
      "before:absolute",
      "before:-z-10",
      "before:inset-0",
      "before:opacity-0",
      "data-[selected=true]:before:opacity-100",
      "data-[selected]:before:opacity-100",
      "group-aria-[selected=true]/tr:before:opacity-100",
      // disabled
      "group-data-[disabled=true]/tr:text-foreground-300",
      "group-data-[disabled=true]/tr:cursor-not-allowed",
    ],
    tfoot: "",
    sortIcon: [
      "ms-2",
      "mb-px",
      "opacity-0",
      "text-inherit",
      "inline-block",
      "transition-transform-opacity",
      "data-[visible=true]:opacity-100",
      "group-data-[hover=true]/th:opacity-100",
      "data-[direction=ascending]:rotate-180",
    ],
    emptyWrapper:
      "flex h-40 w-full items-center justify-center text-center align-middle text-foreground-400",
    loadingWrapper: "absolute inset-0 flex items-center justify-center",
  },
  variants: {
    color: {
      default: {
        td: "before:bg-default-300",
      },
      primary: {
        td: "before:bg-primary/20",
      },
      secondary: {
        td: "before:bg-secondary/20",
      },
      success: {
        td: "before:bg-success/20",
      },
      warning: {
        td: "before:bg-warning/20",
      },
      danger: {
        td: "before:bg-danger/20",
      },
    },
    layout: {
      auto: {
        table: "table-auto",
      },
      fixed: {
        table: "table-fixed",
      },
    },
    overflowMode: {
      wrap: {
        td: "whitespace-normal break-words",
      },
      truncate: {
        td: "truncate",
      },
    },
    shadow: {
      none: {
        wrapper: "shadow-none",
      },
      sm: {
        wrapper: "shadow-small",
      },
      md: {
        wrapper: "shadow-medium",
      },
      lg: {
        wrapper: "shadow-large",
      },
    },
    hideHeader: {
      true: {
        thead: "hidden",
      },
    },
    isStriped: {
      true: {
        td: [
          "group-even/tr:before:bg-default-100/50",
          "group-even/tr:before:opacity-100",
          "group-even/tr:before:-z-10",
        ],
      },
    },
    isCompact: {
      true: {
        td: "py-1",
      },
      false: {},
    },
    isBordered: {
      true: {
        // Inner grid lines only: no border after the last column or under the last row.
        // The end border is cleared from the row because a virtualized cell is wrapped in a
        // VirtualizerItem, so `:last-child` on the cell itself matches every column.
        td: ["border-b", "border-divider", "group-last/tr:border-b-0"],
      },
    },
    isGlass: {
      true: {},
    },
    isSticky: {
      true: {
        thead: [
          "sticky top-0 z-20",
          // A virtualized rowgroup is 0-height (its children are all absolutely
          // positioned by VirtualizerItem). Stretch it to fill the sticky wrapper
          // so it has real area to paint on — same role a native <thead> already has.
          "[&:not(thead)]:absolute",
          "[&:not(thead)]:inset-0",
        ],
      },
    },
    isFooterSticky: {
      true: {
        tfoot: "sticky bottom-0 z-20 rounded-lg bg-default-100",
      },
    },
    isSelectable: {
      true: {
        tr: "cursor-default",
        td: [
          "group-aria-[selected=false]/tr:group-data-[hovered]/tr:before:bg-default-100",
          "group-aria-[selected=false]/tr:group-data-[hovered]/tr:before:opacity-70",
        ],
      },
    },
    isMultiSelectable: {
      true: {
        td: [
          // first
          "group-first/tr:first:before:rounded-ss-lg",
          "group-first/tr:last:before:rounded-se-lg",
          // middle
          "group-[&:not(:first-child):not(:last-child)]/tr:before:rounded-none",
          // last
          "group-last/tr:first:before:rounded-es-lg",
          "group-last/tr:last:before:rounded-ee-lg",
        ],
      },
      false: {
        td: ["first:before:rounded-s-lg", "last:before:rounded-e-lg"],
      },
    },
    radius: {
      none: {
        wrapper: "rounded-none",
        tfoot: "rounded-none",
        thead: [
          "[&>[role=row]>[role=presentation]:first-child>[role=columnheader]]:rounded-s-none",
          "[&>[role=row]>[role=presentation]:last-child>[role=columnheader]]:rounded-e-none",
        ],
        tbody: "[&:not(tbody)]:rounded-none",
        th: [
          "[&:is(th):first-child]:rounded-s-none",
          "[&:is(th):first-child]:before:rounded-s-none",
          "[&:is(th):last-child]:rounded-e-none",
          "[&:is(th):last-child]:before:rounded-e-none",
        ],
        td: [
          "first:before:rounded-s-none",
          "last:before:rounded-e-none",
          "group-first/tr:first:before:rounded-ss-none",
          "group-first/tr:last:before:rounded-se-none",
          "group-last/tr:first:before:rounded-es-none",
          "group-last/tr:last:before:rounded-ee-none",
        ],
      },
      sm: {
        wrapper: "rounded-small",
      },
      md: {
        wrapper: "rounded-medium",
      },
      lg: {
        wrapper: "rounded-large",
      },
    },
    fullWidth: {
      true: {
        base: "w-full",
        wrapper: "w-full",
        table: "w-full",
      },
    },
    align: {
      start: {
        th: "text-start",
        td: "text-start",
      },
      center: {
        th: "text-center",
        td: "text-center",
      },
      end: {
        th: "text-end",
        td: "text-end",
      },
    },
  },
  defaultVariants: {
    layout: "auto",
    shadow: "sm",
    radius: "lg",
    color: "default",
    isCompact: false,
    isGlass: true,
    hideHeader: false,
    isStriped: false,
    fullWidth: true,
    align: "start",
    overflowMode: "wrap",
  },
  compoundVariants: [
    {
      isGlass: true,
      isSticky: true,
      class: {
        // The single glass surface lives on the thead slot (rowgroup) — see the
        // isSticky variant above for why that works in both native and virtualized DOM.
        thead: "bg-default-100/80 backdrop-blur-sm",
        th: [
          // Cells stay transparent so the row group is the only thing painting glass —
          // per-cell backdrop-filter would clamp its sampling to each cell's own box,
          // producing a visible seam at every column boundary.
          "bg-transparent",
          // Native-only: a horizontally-pinned column header is sticky *within* the row
          // group, so it can scroll away from the row group's own (also-scrolling)
          // background box. It needs its own glass to stay opaque as content passes under it.
          "data-[pinned]:bg-default-100/80",
          "data-[pinned]:backdrop-blur-sm",
        ],
      },
    },
    {
      isFooterSticky: true,
      isGlass: true,
      class: {
        tfoot: "bg-default-100/80 backdrop-blur-sm",
      },
    },
    {
      isStriped: true,
      color: "default",
      class: {
        td: "group-even/tr:data-[selected=true]:before:bg-default/60",
      },
    },
    {
      isStriped: true,
      color: "primary",
      class: {
        td: "group-even/tr:data-[selected=true]:before:bg-primary/20",
      },
    },
    {
      isStriped: true,
      color: "secondary",
      class: {
        td: "group-even/tr:data-[selected=true]:before:bg-secondary/20",
      },
    },
    {
      isStriped: true,
      color: "success",
      class: {
        td: "group-even/tr:data-[selected=true]:before:bg-success/20",
      },
    },
    {
      isStriped: true,
      color: "warning",
      class: {
        td: "group-even/tr:data-[selected=true]:before:bg-warning/20",
      },
    },
    {
      isStriped: true,
      color: "danger",
      class: {
        td: "group-even/tr:data-[selected=true]:before:bg-danger/20",
      },
    },
  ],
});

export type TableVariantProps = VariantProps<typeof table>;
export type TableSlots = keyof ReturnType<typeof table>;
export type TableReturnType = ReturnType<typeof table>;

export {table};
