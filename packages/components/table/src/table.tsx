"use client";

import type {SlotsToClasses, TableReturnType, TableSlots, TableVariantProps} from "@sytechui/theme";
import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";
import type {ColumnGeometryDefinition} from "./column-geometry";
import type {TableVirtualizerProps} from "./table-virtualizer";

import {ChevronDownIcon} from "@sytechui/shared-icons";
import {objectToDeps} from "@sytechui/shared-utils";
import {checkbox, cn, table} from "@sytechui/theme";
import React, {createContext, forwardRef, useCallback, useContext, useMemo} from "react";
import {composeRenderProps} from "react-aria-components";
import {
  Cell as CellPrimitive,
  Checkbox as CheckboxPrimitive,
  Collection as CollectionPrimitive,
  Column as ColumnPrimitive,
  ColumnResizer as ColumnResizerPrimitive,
  ResizableTableContainer as ResizableTableContainerPrimitive,
  Row as RowPrimitive,
  Table as TablePrimitive,
  TableBody as TableBodyPrimitive,
  TableHeader as TableHeaderPrimitive,
  TableLoadMoreItem as TableLoadMoreItemPrimitive,
} from "react-aria-components/Table";

import {
  TableColumnDefinitionsContext,
  TableColumnGeometryContext,
  TableGeometryContainer,
  TableGeometryModeContext,
  TableGeometryLayout,
  TableVirtualizer,
} from "./table-virtualizer";

class TableNonStickyGeometryLayout<T> extends TableGeometryLayout<T> {
  protected buildTableHeader() {
    const header = super.buildTableHeader();

    header.layoutInfo.isSticky = false;

    return header;
  }
}

type PublicTableVariantProps = Omit<
  TableVariantProps,
  "isFooterSticky" | "isMultiSelectable" | "isSelectable"
>;

interface TableContextValue {
  classNames?: SlotsToClasses<TableSlots>;
  slots?: TableReturnType;
  variants?: PublicTableVariantProps;
}

const TableContext = createContext<TableContextValue>({});
const TableResizableContext = createContext(false);

type ClassNameOrFunction<T> = string | ((values: T) => string);
type StyleOrFunction<T> = CSSProperties | ((values: T) => CSSProperties | undefined);

function composeClassName<T>(
  slotClassName: string | undefined,
  className: ClassNameOrFunction<T> | undefined,
): ClassNameOrFunction<T> {
  return typeof className === "function"
    ? (values) => cn(slotClassName, className(values)) ?? ""
    : (cn(slotClassName, className) ?? "");
}

function composeStyle<T>(
  geometryStyle: CSSProperties | undefined,
  style: StyleOrFunction<T> | undefined,
): StyleOrFunction<T> | undefined {
  if (!geometryStyle) return style;

  return (values) => ({
    ...(values as unknown as {defaultStyle?: CSSProperties}).defaultStyle,
    ...geometryStyle,
    ...(typeof style === "function" ? (style(values) ?? {}) : style),
  });
}

/* -------------------------------------------------------------------------------------------------
 * Table Root
 * -----------------------------------------------------------------------------------------------*/
export interface TableRootProps
  extends Omit<ComponentPropsWithoutRef<"div">, "color" | "onResize">, PublicTableVariantProps {
  classNames?: SlotsToClasses<TableSlots>;
  /**
   * The currently rendered leaf columns, in the same order as `Table.Header` and each
   * `Table.Row`. Use the same filtered/reordered array for all three.
   */
  columns?: readonly ColumnGeometryDefinition[];
  isResizable?: boolean;
  isVirtualized?: boolean;
  layoutOptions?: TableVirtualizerProps["layoutOptions"];
  onResize?: ComponentPropsWithRef<typeof ResizableTableContainerPrimitive>["onResize"];
  onResizeEnd?: ComponentPropsWithRef<typeof ResizableTableContainerPrimitive>["onResizeEnd"];
  onResizeStart?: ComponentPropsWithRef<typeof ResizableTableContainerPrimitive>["onResizeStart"];
  removeWrapper?: boolean;
}

export const TableRoot = forwardRef<HTMLDivElement, TableRootProps>(function TableRoot(
  {
    align,
    children,
    className,
    classNames,
    color,
    columns,
    fullWidth,
    hideHeader,
    isBordered,
    isCompact,
    isGlass,
    isSticky,
    isResizable,
    isStriped,
    isVirtualized,
    layout,
    layoutOptions,
    onResize,
    onResizeEnd,
    onResizeStart,
    overflowMode,
    radius,
    removeWrapper,
    shadow,
    ...props
  },
  ref,
) {
  const variants = useMemo(
    () => ({
      align,
      color,
      fullWidth,
      hideHeader,
      isBordered,
      isCompact,
      isGlass,
      isSticky,
      isStriped,
      layout,
      overflowMode,
      radius,
      shadow,
    }),
    [
      align,
      color,
      fullWidth,
      hideHeader,
      isBordered,
      isCompact,
      isGlass,
      isSticky,
      isStriped,
      layout,
      overflowMode,
      radius,
      shadow,
    ],
  );
  const slots = useMemo(() => table(variants), [variants]);
  const context = useMemo(
    () => ({classNames, slots, variants}),
    [objectToDeps(classNames), slots, variants],
  );

  let content: ReactNode = isResizable ? (
    <TableResizableContainer
      removeWrapper={removeWrapper}
      onResize={onResize}
      onResizeEnd={onResizeEnd}
      onResizeStart={onResizeStart}
    >
      {children}
    </TableResizableContainer>
  ) : (
    <TableScrollContainer removeWrapper={removeWrapper}>{children}</TableScrollContainer>
  );

  if (columns?.length) {
    content = isVirtualized ? (
      <TableVirtualizer
        fillContainer={fullWidth !== false}
        layout={isSticky ? TableGeometryLayout : TableNonStickyGeometryLayout}
        layoutOptions={layoutOptions}
      >
        {content}
      </TableVirtualizer>
    ) : (
      <TableGeometryContainer fillContainer={fullWidth !== false}>{content}</TableGeometryContainer>
    );
  }

  return (
    <TableColumnDefinitionsContext.Provider value={columns}>
      <TableContext.Provider value={context}>
        <div ref={ref} className={slots.base({class: cn(classNames?.base, className)})} {...props}>
          {content}
        </div>
      </TableContext.Provider>
    </TableColumnDefinitionsContext.Provider>
  );
});

TableRoot.displayName = "SytechUI.Table";

/* -------------------------------------------------------------------------------------------------
 * Table Scroll Container
 * -----------------------------------------------------------------------------------------------*/
interface TableScrollContainerProps extends ComponentPropsWithRef<"div"> {
  removeWrapper?: boolean;
}

const TableScrollContainer = forwardRef<HTMLDivElement, TableScrollContainerProps>(
  function TableScrollContainer({className, removeWrapper, ...props}, ref) {
    const {classNames, slots} = useContext(TableContext);
    const scrollContainer = (
      <div
        ref={ref}
        className={slots?.scrollContainer({class: cn(classNames?.scrollContainer, className)})}
        data-table-scroll-container=""
        {...props}
      />
    );

    return removeWrapper ? (
      scrollContainer
    ) : (
      <div className={slots?.wrapper({class: classNames?.wrapper})}>{scrollContainer}</div>
    );
  },
);

TableScrollContainer.displayName = "SytechUI.Table.ScrollContainer";

/* -------------------------------------------------------------------------------------------------
 * Table Content
 * -----------------------------------------------------------------------------------------------*/
export interface TableContentProps extends Omit<
  ComponentPropsWithRef<typeof TablePrimitive>,
  "className"
> {
  className?: ComponentPropsWithRef<typeof TablePrimitive>["className"];
}

export const TableContent = forwardRef<HTMLDivElement | HTMLTableElement, TableContentProps>(
  function TableContent({className, selectionMode = "none", style, ...props}, ref) {
    const context = useContext(TableContext);
    const geometryContext = useContext(TableColumnGeometryContext);
    const geometryMode = useContext(TableGeometryModeContext);
    const {classNames, variants} = context;
    const slots = useMemo(
      () =>
        table({
          ...variants,
          isMultiSelectable: selectionMode === "multiple",
          isSelectable: selectionMode !== "none",
        }),
      [selectionMode, variants],
    );
    const nestedContext = useMemo(() => ({...context, slots}), [context, slots]);
    const geometryStyle =
      geometryMode === "native" && geometryContext?.geometry.columns.length
        ? ({
            minWidth: geometryContext.geometry.totalWidth,
            tableLayout: "fixed",
            width: geometryContext.geometry.totalWidth,
          } as const)
        : undefined;

    return (
      <TableContext.Provider value={nestedContext}>
        <TablePrimitive
          ref={ref}
          className={composeClassName(slots.table({class: classNames?.table}), className)}
          selectionMode={selectionMode}
          style={composeStyle(geometryStyle, style)}
          {...props}
        />
      </TableContext.Provider>
    );
  },
);

TableContent.displayName = "SytechUI.Table.Content";

/* -------------------------------------------------------------------------------------------------
 * Table Header
 * -----------------------------------------------------------------------------------------------*/
export interface TableHeaderProps<T extends object> extends ComponentPropsWithRef<
  typeof TableHeaderPrimitive<T>
> {}

export const TableHeader = forwardRef(function TableHeader<T extends object>(
  {className, ...props}: TableHeaderProps<T>,
  ref: React.ForwardedRef<HTMLDivElement | HTMLTableSectionElement>,
) {
  const {classNames, slots} = useContext(TableContext);

  return (
    <TableHeaderPrimitive
      ref={ref}
      className={composeClassName(slots?.thead({class: classNames?.thead}), className)}
      {...props}
    />
  );
}) as <T extends object>(props: TableHeaderProps<T>) => ReactElement;

(TableHeader as React.FC).displayName = "SytechUI.Table.Header";

/* -------------------------------------------------------------------------------------------------
 * Table Column
 * -----------------------------------------------------------------------------------------------*/
export interface TableColumnProps extends ComponentPropsWithRef<typeof ColumnPrimitive> {
  align?: TableVariantProps["align"];
}

export const TableColumn = forwardRef<HTMLDivElement | HTMLTableCellElement, TableColumnProps>(
  function TableColumn(
    {align, children, className, defaultWidth, id, maxWidth, minWidth, style, width, ...props},
    ref,
  ) {
    const {classNames, slots} = useContext(TableContext);
    const definitions = useContext(TableColumnDefinitionsContext);
    const geometryContext = useContext(TableColumnGeometryContext);
    const geometryMode = useContext(TableGeometryModeContext);
    const isResizable = useContext(TableResizableContext);
    const definition = definitions?.find((column) => column.id === id);
    const columnGeometry = id == null ? undefined : geometryContext?.geometry.byId.get(id);
    const resolvedDefaultWidth =
      defaultWidth ?? definition?.width ?? (`${definition?.flex ?? 1}fr` as `${number}fr`);
    const geometryStyle: CSSProperties | undefined =
      geometryMode === "native" && columnGeometry
        ? {
            ...(columnGeometry.pinned
              ? {
                  [columnGeometry.pinned === "start" ? "insetInlineStart" : "insetInlineEnd"]:
                    columnGeometry.pinnedOffset ?? 0,
                  position: "sticky",
                  // Both sides are "positioned" elements and can visually cross paths mid-scroll
                  // (an end-pinned column sliding through its normal position before it reaches
                  // its own sticky threshold can pass over an already-stuck start-pinned one) —
                  // give start a fixed edge over end so that collision has a deterministic winner
                  // instead of falling back to DOM order.
                  zIndex: columnGeometry.pinned === "start" ? 4 : 3,
                }
              : {}),
            width: columnGeometry.width,
          }
        : undefined;
    // Pinned columns are native-only (see the comment above TableGeometryLayout in
    // table-virtualizer.tsx), so this attribute — which the generated <style> in
    // TableGeometryContainer keys off of — is native-only too.
    const pinnedAttribute = geometryMode === "native" ? columnGeometry?.pinned : undefined;
    const resolvedChildren = isResizable
      ? composeRenderProps(children, (children) => (
          <>
            {children}
            <TableColumnResizer />
          </>
        ))
      : children;

    return (
      <ColumnPrimitive
        ref={ref}
        className={composeClassName(slots?.th({align, class: classNames?.th}), className)}
        data-pinned={pinnedAttribute}
        defaultWidth={isResizable ? resolvedDefaultWidth : defaultWidth}
        id={id}
        maxWidth={isResizable ? (maxWidth ?? definition?.maxWidth) : maxWidth}
        minWidth={isResizable ? (minWidth ?? definition?.minWidth) : minWidth}
        style={composeStyle(geometryStyle, style)}
        width={width}
        {...props}
      >
        {resolvedChildren}
      </ColumnPrimitive>
    );
  },
);

TableColumn.displayName = "SytechUI.Table.Column";

/* -------------------------------------------------------------------------------------------------
 * Table Body
 * -----------------------------------------------------------------------------------------------*/
export interface TableBodyProps<T extends object> extends ComponentPropsWithRef<
  typeof TableBodyPrimitive<T>
> {}

export const TableBody = forwardRef(function TableBody<T extends object>(
  {className, renderEmptyState, ...props}: TableBodyProps<T>,
  ref: React.ForwardedRef<HTMLDivElement | HTMLTableSectionElement>,
) {
  const {classNames, slots} = useContext(TableContext);

  return (
    <TableBodyPrimitive
      ref={ref}
      className={composeClassName(slots?.tbody({class: classNames?.tbody}), className)}
      renderEmptyState={
        renderEmptyState
          ? (values) => (
              <div className={slots?.emptyWrapper({class: classNames?.emptyWrapper})}>
                {renderEmptyState(values)}
              </div>
            )
          : undefined
      }
      {...props}
    />
  );
}) as <T extends object>(props: TableBodyProps<T>) => ReactElement;

(TableBody as React.FC).displayName = "SytechUI.Table.Body";

/* -------------------------------------------------------------------------------------------------
 * Table Row
 * -----------------------------------------------------------------------------------------------*/
export interface TableRowProps<T extends object> extends ComponentPropsWithRef<
  typeof RowPrimitive<T>
> {}

export const TableRow = forwardRef(function TableRow<T extends object>(
  {className, ...props}: TableRowProps<T>,
  ref: React.ForwardedRef<HTMLDivElement | HTMLTableRowElement>,
) {
  const {classNames, slots} = useContext(TableContext);

  return (
    <RowPrimitive
      ref={ref}
      className={composeClassName(slots?.tr({class: classNames?.tr}), className)}
      {...props}
    />
  );
}) as <T extends object>(props: TableRowProps<T>) => ReactElement;

(TableRow as React.FC).displayName = "SytechUI.Table.Row";

/* -------------------------------------------------------------------------------------------------
 * Table Cell
 * -----------------------------------------------------------------------------------------------*/
export interface TableCellProps extends ComponentPropsWithRef<typeof CellPrimitive> {
  align?: TableVariantProps["align"];
  overflowMode?: TableVariantProps["overflowMode"];
}

export const TableCell = forwardRef<HTMLDivElement | HTMLTableCellElement, TableCellProps>(
  function TableCell({align, children, className, overflowMode, ...props}, ref) {
    const {classNames, slots, variants} = useContext(TableContext);
    const resolvedOverflowMode = overflowMode ?? variants?.overflowMode ?? "wrap";
    const resolvedChildren =
      resolvedOverflowMode === "truncate"
        ? composeRenderProps(children, (children) => (
            <div className="min-w-0 max-w-full truncate" data-table-cell-content="">
              {children}
            </div>
          ))
        : children;

    return (
      <CellPrimitive
        ref={ref}
        className={composeClassName(
          slots?.td({
            align,
            class: classNames?.td,
            overflowMode: resolvedOverflowMode === "truncate" ? "wrap" : resolvedOverflowMode,
          }),
          className,
        )}
        {...props}
      >
        {resolvedChildren}
      </CellPrimitive>
    );
  },
);

TableCell.displayName = "SytechUI.Table.Cell";

/* -------------------------------------------------------------------------------------------------
 * Table Selection Checkbox
 * -----------------------------------------------------------------------------------------------*/
export interface TableSelectionCheckboxProps extends Omit<
  ComponentPropsWithRef<typeof CheckboxPrimitive>,
  "children" | "slot"
> {
  color?: TableVariantProps["color"];
}

export const TableSelectionCheckbox = forwardRef<HTMLLabelElement, TableSelectionCheckboxProps>(
  function TableSelectionCheckbox({className, color, ...props}, ref) {
    const {variants} = useContext(TableContext);
    const resolvedColor = color ?? variants?.color ?? "default";
    const checkboxSlots = useMemo(
      () => checkbox({color: resolvedColor, size: "md"}),
      [resolvedColor],
    );

    return (
      <CheckboxPrimitive
        ref={ref}
        className={composeClassName(checkboxSlots.base(), className)}
        slot="selection"
        {...props}
      >
        {({isHovered, isIndeterminate, isSelected}) => (
          <span
            aria-hidden="true"
            className={checkboxSlots.wrapper({
              class: cn(
                "me-0",
                isHovered && "before:border-default-400",
                (isSelected || isIndeterminate) && "after:scale-100 after:opacity-100",
              ),
            })}
          >
            <svg
              className={checkboxSlots.icon({
                class: (isSelected || isIndeterminate) && "opacity-100",
              })}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isIndeterminate ? 3 : 2}
              viewBox="0 0 18 18"
            >
              {isIndeterminate ? (
                <line x1="15" x2="3" y1="9" y2="9" />
              ) : (
                <polyline points="2 9 7 14 16 4" />
              )}
            </svg>
          </span>
        )}
      </CheckboxPrimitive>
    );
  },
);

TableSelectionCheckbox.displayName = "SytechUI.Table.SelectionCheckbox";

/* -------------------------------------------------------------------------------------------------
 * Table Footer
 * -----------------------------------------------------------------------------------------------*/
export interface TableFooterProps extends ComponentPropsWithRef<"div"> {
  alignColumns?: boolean;
  isSticky?: boolean;
}

export const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(function TableFooter(
  {alignColumns = false, className, isSticky, style, ...props},
  ref,
) {
  const {classNames, slots} = useContext(TableContext);
  const geometryContext = useContext(TableColumnGeometryContext);
  const geometryStyle =
    alignColumns && geometryContext
      ? {
          display: "grid",
          gridTemplateColumns: geometryContext.geometry.columns
            .map((column) => `${column.width}px`)
            .join(" "),
          width: geometryContext.geometry.totalWidth,
        }
      : undefined;

  return (
    <div
      ref={ref}
      className={slots?.tfoot({
        class: cn(classNames?.tfoot, className),
        isFooterSticky: isSticky,
      })}
      style={{...geometryStyle, ...style}}
      {...props}
    />
  );
});

TableFooter.displayName = "SytechUI.Table.Footer";

/* -------------------------------------------------------------------------------------------------
 * Resizing and loading
 * -----------------------------------------------------------------------------------------------*/
interface TableResizableContainerProps extends ComponentPropsWithRef<
  typeof ResizableTableContainerPrimitive
> {
  removeWrapper?: boolean;
}

const TableResizableContainer = forwardRef<HTMLDivElement, TableResizableContainerProps>(
  function TableResizableContainer({children, className, onResize, removeWrapper, ...props}, ref) {
    const {classNames, slots} = useContext(TableContext);
    const geometryContext = useContext(TableColumnGeometryContext);
    const handleResize = useCallback<NonNullable<TableResizableContainerProps["onResize"]>>(
      (widths) => {
        geometryContext?.setColumnWidths(
          new Map(
            [...widths].flatMap(([key, value]) =>
              typeof value === "number" ? [[key, value] as const] : [],
            ),
          ),
        );
        onResize?.(widths);
      },
      [geometryContext, onResize],
    );
    const resizableContainer = (
      <ResizableTableContainerPrimitive
        ref={ref}
        className={slots?.resizableContainer({
          class: cn(classNames?.resizableContainer, className),
        })}
        data-table-scroll-container=""
        onResize={handleResize}
        {...props}
      >
        {children}
      </ResizableTableContainerPrimitive>
    );

    return (
      <TableResizableContext.Provider value>
        {removeWrapper ? (
          resizableContainer
        ) : (
          <div className={slots?.wrapper({class: classNames?.wrapper})}>{resizableContainer}</div>
        )}
      </TableResizableContext.Provider>
    );
  },
);

TableResizableContainer.displayName = "SytechUI.Table.ResizableContainer";

function TableColumnResizer() {
  const {classNames, slots} = useContext(TableContext);

  return (
    <ColumnResizerPrimitive
      className={slots?.columnResizer({class: classNames?.columnResizer})}
      data-slot="table-column-resizer"
    />
  );
}

export interface TableLoadMoreItemProps extends ComponentPropsWithRef<
  typeof TableLoadMoreItemPrimitive
> {}

export const TableLoadMoreItem = forwardRef<HTMLTableRowElement, TableLoadMoreItemProps>(
  function TableLoadMoreItem({className, ...props}, ref) {
    return (
      <TableLoadMoreItemPrimitive
        ref={ref}
        className={cn("[&>td]:text-center", className)}
        {...props}
      />
    );
  },
);

TableLoadMoreItem.displayName = "SytechUI.Table.LoadMore";

export interface TableLoadMoreContentProps extends ComponentPropsWithRef<"div"> {}

export const TableLoadMoreContent = forwardRef<HTMLDivElement, TableLoadMoreContentProps>(
  function TableLoadMoreContent({className, ...props}, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex h-12 w-full items-center justify-center", className)}
        {...props}
      />
    );
  },
);

TableLoadMoreContent.displayName = "SytechUI.Table.LoadMoreContent";

export interface TableLoadingOverlayProps extends ComponentPropsWithRef<"div"> {}

export const TableLoadingOverlay = forwardRef<HTMLDivElement, TableLoadingOverlayProps>(
  function TableLoadingOverlay({className, ...props}, ref) {
    const {classNames, slots} = useContext(TableContext);

    return (
      <div
        ref={ref}
        className={slots?.loadingWrapper({
          class: cn("z-20", classNames?.loadingWrapper, className),
        })}
        {...props}
      />
    );
  },
);

TableLoadingOverlay.displayName = "SytechUI.Table.LoadingOverlay";

/* -------------------------------------------------------------------------------------------------
 * Sortable column header
 * -----------------------------------------------------------------------------------------------*/
export type TableSortDirection = "ascending" | "descending";

export interface TableSortableColumnHeaderProps extends Omit<
  ComponentPropsWithRef<"span">,
  "children"
> {
  children?: ReactNode;
  indicator?: ReactNode;
  showIndicator?: boolean;
  sortDirection?: TableSortDirection;
}

export const TableSortableColumnHeader = forwardRef<
  HTMLSpanElement,
  TableSortableColumnHeaderProps
>(function TableSortableColumnHeader(
  {children, className, indicator, showIndicator = true, sortDirection, ...props},
  ref,
) {
  const {classNames, slots} = useContext(TableContext);
  const indicatorProps = {
    "aria-hidden": true,
    "data-direction": sortDirection,
    "data-visible": sortDirection ? "true" : "false",
    className: slots?.sortIcon({class: classNames?.sortIcon}),
  } as const;
  let indicatorElement: ReactNode = null;

  if (showIndicator) {
    if (indicator === undefined) {
      indicatorElement = <ChevronDownIcon strokeWidth={3} {...indicatorProps} />;
    } else if (React.isValidElement(indicator)) {
      const element = indicator as ReactElement<{className?: string}>;

      indicatorElement = React.cloneElement(element, {
        ...indicatorProps,
        className: cn(indicatorProps.className, element.props.className),
      });
    } else {
      indicatorElement = indicator;
    }
  }

  return (
    <span ref={ref} className={className} data-direction={sortDirection} {...props}>
      {children}
      {indicatorElement}
    </span>
  );
});

TableSortableColumnHeader.displayName = "SytechUI.Table.SortableColumnHeader";

export const TableCollection = CollectionPrimitive;
