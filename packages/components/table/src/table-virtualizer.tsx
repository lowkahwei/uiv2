"use client";

import type {Key} from "@react-types/shared";
import type {ComponentPropsWithRef, ReactNode} from "react";
import type {
  TableLayoutProps,
  VirtualizerProps as ReactAriaVirtualizerProps,
} from "react-aria-components/Virtualizer";
import type {ColumnGeometry, ColumnGeometryDefinition} from "./column-geometry";

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {TableColumnResizeStateContext} from "react-aria-components/Table";
import {TableLayout, Virtualizer} from "react-aria-components/Virtualizer";

import {
  calculateColumnGeometry,
  getPinnedShadowColumns,
  normalizeScrollOffset,
} from "./column-geometry";

export const TableColumnDefinitionsContext = createContext<
  readonly ColumnGeometryDefinition[] | undefined
>(undefined);

interface TableColumnGeometryContextValue {
  geometry: ColumnGeometry;
  setColumnWidths: (widths: ReadonlyMap<Key, number>) => void;
}

export const TableColumnGeometryContext = createContext<TableColumnGeometryContextValue | null>(
  null,
);
export const TableGeometryModeContext = createContext<"native" | "virtualized" | null>(null);

/**
 * Native-only: rAF-batches pinned-shadow updates and writes the 1-based column position used by
 * the generated nth-child selectors without triggering React renders on the scroll hot path.
 */
function useNativePinnedShadowSync(
  containerRef: React.RefObject<HTMLElement | null>,
  geometry: ColumnGeometry,
) {
  const geometryRef = useRef(geometry);

  geometryRef.current = geometry;

  const viewportRef = useRef<HTMLElement | null>(null);
  const shadowStateRef = useRef({end: "", start: ""});
  const updateShadows = useCallback(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;

    if (!container || !viewport) return;

    const geometry = geometryRef.current;
    const direction = getComputedStyle(viewport).direction === "rtl" ? "rtl" : "ltr";
    const scrollOffset = normalizeScrollOffset(
      viewport.scrollLeft,
      Math.max(0, geometry.totalWidth - geometry.viewportWidth),
      direction,
    );
    const shadows = getPinnedShadowColumns(geometry, scrollOffset);
    const nextEnd = shadows.end == null ? "" : String(shadows.end.index + 1);
    const nextStart = shadows.start == null ? "" : String(shadows.start.index + 1);
    const state = shadowStateRef.current;

    if (nextStart !== state.start) {
      state.start = nextStart;
      if (nextStart) container.dataset.tableStartShadow = nextStart;
      else delete container.dataset.tableStartShadow;
    }

    if (nextEnd !== state.end) {
      state.end = nextEnd;
      if (nextEnd) container.dataset.tableEndShadow = nextEnd;
      else delete container.dataset.tableEndShadow;
    }
  }, [containerRef]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const viewport =
      container.querySelector<HTMLElement>("[data-table-scroll-container]") ?? container;

    viewportRef.current = viewport;

    let frame: number | undefined;
    const scheduleShadowUpdate = () => {
      if (frame == null) {
        frame = requestAnimationFrame(() => {
          frame = undefined;
          updateShadows();
        });
      }
    };

    updateShadows();
    viewport.addEventListener("scroll", scheduleShadowUpdate, {passive: true});

    return () => {
      viewport.removeEventListener("scroll", scheduleShadowUpdate);
      if (frame != null) cancelAnimationFrame(frame);
      viewportRef.current = null;
      shadowStateRef.current = {end: "", start: ""};
      delete container.dataset.tableEndShadow;
      delete container.dataset.tableStartShadow;
    };
  }, [containerRef, updateShadows]);

  // Geometry can change without a scroll event (e.g. a column resize shifts pinnedOffsets),
  // so the frontier still needs to be recomputed here — just without touching the listener.
  useLayoutEffect(() => {
    updateShadows();
  }, [geometry, updateShadows]);
}

// Virtualized tables consume managed column widths only. Pinning stays native-only.
export class TableGeometryLayout<T> extends TableLayout<T> {
  useLayoutOptions() {
    // React Aria calls this method as a custom hook from its CollectionRoot.
    /* eslint-disable react-hooks/rules-of-hooks */
    const geometryContext = useContext(TableColumnGeometryContext);
    const resizeState = useContext(TableColumnResizeStateContext);
    const options = useMemo(
      () => ({
        columnWidths:
          resizeState?.columnWidths ??
          (geometryContext?.geometry.columns.length ? geometryContext.geometry.widths : undefined),
      }),
      [
        geometryContext?.geometry.columns.length,
        geometryContext?.geometry.widths,
        resizeState?.columnWidths,
      ],
    );
    /* eslint-enable react-hooks/rules-of-hooks */

    return options;
  }
}

export interface TableVirtualizerProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
  children: ReactNode;
  fillContainer?: boolean;
  layout?: ReactAriaVirtualizerProps<TableLayoutProps>["layout"];
  layoutOptions?: Omit<TableLayoutProps, "columnWidths">;
  viewportWidth?: number;
}

interface TableGeometryContainerProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
  children: ReactNode;
  fillContainer?: boolean;
  viewportWidth?: number;
}

export function setForwardedRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

export const TableVirtualizer = forwardRef<HTMLDivElement, TableVirtualizerProps>(
  function TableVirtualizer(
    {
      children,
      fillContainer = false,
      layout = TableGeometryLayout,
      layoutOptions,
      style,
      viewportWidth: controlledViewportWidth,
      ...props
    },
    forwardedRef,
  ) {
    const definitions = useContext(TableColumnDefinitionsContext);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [measuredViewportWidth, setMeasuredViewportWidth] = useState(0);
    const [widthOverrides, setWidthOverrides] = useState<ReadonlyMap<Key, number>>(() => new Map());
    const setContainerRef = useCallback(
      (element: HTMLDivElement | null) => {
        containerRef.current = element;
        setForwardedRef(forwardedRef, element);
      },
      [forwardedRef],
    );

    useLayoutEffect(() => {
      if (controlledViewportWidth != null || !containerRef.current) return;

      const container = containerRef.current;
      const viewport = container.querySelector<HTMLElement>('[role="grid"]') ?? container;
      const updateWidth = () => setMeasuredViewportWidth(viewport.clientWidth);

      updateWidth();

      if (typeof ResizeObserver === "undefined") {
        window.addEventListener("resize", updateWidth);

        return () => window.removeEventListener("resize", updateWidth);
      }

      const observer = new ResizeObserver(updateWidth);

      observer.observe(viewport);

      return () => observer.disconnect();
    }, [controlledViewportWidth]);

    const viewportWidth = controlledViewportWidth ?? measuredViewportWidth;
    const geometry = useMemo(
      () =>
        calculateColumnGeometry(definitions ?? [], viewportWidth, widthOverrides, fillContainer),
      [definitions, fillContainer, viewportWidth, widthOverrides],
    );
    const geometryContext = useMemo(
      () => ({geometry, setColumnWidths: setWidthOverrides}),
      [geometry],
    );
    const resolvedLayoutOptions = useMemo(
      () => ({
        ...layoutOptions,
        ...(definitions?.length ? {columnWidths: geometry.widths} : {}),
      }),
      [definitions, geometry.widths, layoutOptions],
    );

    return (
      <div ref={setContainerRef} style={{minWidth: 0, width: "100%", ...style}} {...props}>
        <TableColumnGeometryContext.Provider value={geometryContext}>
          <TableGeometryModeContext.Provider value="virtualized">
            <Virtualizer layout={layout} layoutOptions={resolvedLayoutOptions}>
              {children}
            </Virtualizer>
          </TableGeometryModeContext.Provider>
        </TableColumnGeometryContext.Provider>
      </div>
    );
  },
);

TableVirtualizer.displayName = "SytechUI.Table.Virtualizer";

export const TableGeometryContainer = forwardRef<HTMLDivElement, TableGeometryContainerProps>(
  function TableGeometryContainer(
    {children, fillContainer = false, style, viewportWidth: controlledViewportWidth, ...props},
    forwardedRef,
  ) {
    const definitions = useContext(TableColumnDefinitionsContext);
    const geometryId = useId();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [measuredViewportWidth, setMeasuredViewportWidth] = useState(0);
    const [widthOverrides, setWidthOverrides] = useState<ReadonlyMap<Key, number>>(() => new Map());
    const setContainerRef = useCallback(
      (element: HTMLDivElement | null) => {
        containerRef.current = element;
        setForwardedRef(forwardedRef, element);
      },
      [forwardedRef],
    );

    useLayoutEffect(() => {
      if (controlledViewportWidth != null || !containerRef.current) return;

      const container = containerRef.current;
      const viewport =
        container.querySelector<HTMLElement>("[data-table-scroll-container]") ?? container;
      const updateWidth = () => {
        const computedStyle = window.getComputedStyle(viewport);
        const horizontalPadding =
          (Number.parseFloat(computedStyle.paddingLeft) || 0) +
          (Number.parseFloat(computedStyle.paddingRight) || 0);

        setMeasuredViewportWidth(Math.max(0, viewport.clientWidth - horizontalPadding));
      };

      updateWidth();

      if (typeof ResizeObserver === "undefined") {
        window.addEventListener("resize", updateWidth);

        return () => window.removeEventListener("resize", updateWidth);
      }

      const observer = new ResizeObserver(updateWidth);

      observer.observe(viewport);

      return () => observer.disconnect();
    }, [controlledViewportWidth]);

    const viewportWidth = controlledViewportWidth ?? measuredViewportWidth;
    const geometry = useMemo(
      () =>
        calculateColumnGeometry(definitions ?? [], viewportWidth, widthOverrides, fillContainer),
      [definitions, fillContainer, viewportWidth, widthOverrides],
    );
    const geometryContext = useMemo(
      () => ({geometry, setColumnWidths: setWidthOverrides}),
      [geometry],
    );

    useLayoutEffect(() => {
      if (
        process.env.NODE_ENV !== "production" &&
        viewportWidth > 0 &&
        !geometry.hasValidPinnedWidth
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          `Table pinned columns use ${geometry.pinnedStartWidth + geometry.pinnedEndWidth}px ` +
            `of a ${viewportWidth}px viewport. Unpin or resize a column to preserve scrollable content.`,
        );
      }
    }, [
      geometry.hasValidPinnedWidth,
      geometry.pinnedEndWidth,
      geometry.pinnedStartWidth,
      viewportWidth,
    ]);

    useNativePinnedShadowSync(containerRef, geometry);

    const pinnedStyles = useMemo(
      () =>
        geometry.columns
          .flatMap((column, index) => {
            if (!column.pinned) return [];

            const isStart = column.pinned === "start";
            // The pinned column's own edge anchors it to the viewport (inset-inline-start/end);
            // the shadow strip anchors to the OPPOSITE logical edge of that same box so it lands
            // just past the column, over the adjacent scrolling content rather than on the
            // column itself — matching antd's "content slides under the column" look.
            const offsetProperty = isStart ? "inset-inline-start" : "inset-inline-end";
            const shadowAttribute = isStart ? "data-table-start-shadow" : "data-table-end-shadow";
            const shadow = isStart
              ? "10px 0 8px -8px var(--table-pinned-shadow, color-mix(in srgb, currentColor 28%, transparent)) inset"
              : "-10px 0 8px -8px var(--table-pinned-shadow, color-mix(in srgb, currentColor 28%, transparent)) inset";
            const rtlShadow = isStart
              ? "-10px 0 8px -8px var(--table-pinned-shadow, color-mix(in srgb, currentColor 28%, transparent)) inset"
              : "10px 0 8px -8px var(--table-pinned-shadow, color-mix(in srgb, currentColor 28%, transparent)) inset";
            const childIndex = index + 1;
            const geometrySelector = `[data-table-geometry="${geometryId}"]`;
            // Bare fragments (no geometrySelector prefix) for reuse under the shadow-attribute
            // selector below — prefixing them again there would require a second, nested
            // [data-table-geometry] ancestor that doesn't exist, matching nothing.
            const headerCellBare = `thead > tr > th:nth-child(${childIndex})`;
            const bodyCellBare = `tbody > tr > td:nth-child(${childIndex})`;
            const headerCell = `${geometrySelector} ${headerCellBare}`;
            const bodyCell = `${geometrySelector} ${bodyCellBare}`;

            // Start beats end on both header and body tiers (th stays above td, matching the
            // existing sticky-header-over-sticky-column corner behavior) so an end-pinned cell
            // sliding through its normal scroll position can never paint over an already-stuck
            // start-pinned one.
            const bodyZIndex = isStart ? 2 : 1;

            return [
              `${bodyCell} {` +
                `position: sticky; ${offsetProperty}: ${column.pinnedOffset ?? 0}px; z-index: ${bodyZIndex};` +
                `background-color: var(--table-pinned-bg);` +
                `}`,
              `${headerCell}::after, ${bodyCell}::after {` +
                `content: ''; position: absolute; inset-block: 0; width: 30px;` +
                `pointer-events: none; ${offsetProperty}: 100%;` +
                `}`,
              `${geometrySelector}[${shadowAttribute}="${childIndex}"] ${headerCellBare}::after,` +
                `${geometrySelector}[${shadowAttribute}="${childIndex}"] ${bodyCellBare}::after ` +
                `{box-shadow: ${shadow};}`,
              `${geometrySelector}[${shadowAttribute}="${childIndex}"] ${headerCellBare}:dir(rtl)::after,` +
                `${geometrySelector}[${shadowAttribute}="${childIndex}"] ${bodyCellBare}:dir(rtl)::after ` +
                `{box-shadow: ${rtlShadow};}`,
            ];
          })
          .join("\n"),
      [geometry.columns, geometryId],
    );

    return (
      <div
        ref={setContainerRef}
        data-table-geometry={geometryId}
        data-table-pinned-width-invalid={geometry.hasValidPinnedWidth ? undefined : ""}
        style={{minWidth: 0, width: "100%", ...style}}
        {...props}
      >
        <TableColumnGeometryContext.Provider value={geometryContext}>
          <TableGeometryModeContext.Provider value="native">
            {pinnedStyles ? <style>{pinnedStyles}</style> : null}
            {children}
          </TableGeometryModeContext.Provider>
        </TableColumnGeometryContext.Provider>
      </div>
    );
  },
);

TableGeometryContainer.displayName = "SytechUI.Table.GeometryContainer";
