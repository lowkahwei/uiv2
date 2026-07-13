import {capitalize} from "@sytechui/shared-utils";
import {useEffect, useRef} from "react";

export type ScrollOverflowVisibility =
  | "auto"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "both"
  | "none";

export type ScrollOverflowEdgeCheck = "all" | "top" | "bottom" | "left" | "right";

export type ScrollOverflowOrientation = "horizontal" | "vertical";
export type ScrollOverflowCheck = ScrollOverflowOrientation | "both";

export interface UseDataScrollOverflowProps {
  /**
   * The reference to the DOM element on which we're checking overflow.
   */
  domRef?: React.RefObject<HTMLElement>;
  /**
   * Determines the direction of overflow to check.
   * - "horizontal" will check for overflow on the x-axis.
   * - "vertical" will check for overflow on the y-axis.
   * - "both" (default) will check for overflow on both axes.
   *
   * @default "both"
   */
  overflowCheck?: ScrollOverflowCheck;
  /**
   * Controlled visible state. Passing "auto" will make the shadow visible only when the scroll reaches the edge.
   * use "left" / "right" for horizontal scroll and "top" / "bottom" for vertical scroll.
   * @default "auto"
   */
  visibility?: ScrollOverflowVisibility;
  /**
   * Enables or disables the overflow checking mechanism.
   * @default true
   */
  isEnabled?: boolean;
  /**
   * Defines a buffer or margin within which we won't treat the scroll as reaching the edge.
   *
   * @default 0 - meaning the check will behave exactly at the edge.
   */
  offset?: number;
  /**
   * List of dependencies to update the overflow check.
   */
  updateDeps?: any[];
  /**
   * Callback to be called when the overflow state changes.
   *
   * @param visibility ScrollOverflowVisibility
   */
  onVisibilityChange?: (overflow: ScrollOverflowVisibility) => void;
}

export function useDataScrollOverflow(props: UseDataScrollOverflowProps = {}) {
  const {
    domRef,
    isEnabled = true,
    overflowCheck = "vertical",
    visibility = "auto",
    offset = 0,
    onVisibilityChange,
    updateDeps = [],
  } = props;

  const visibleRef = useRef<ScrollOverflowVisibility>(visibility);

  useEffect(() => {
    const el = domRef?.current;

    if (!el || !isEnabled) return;

    let resizeObserver: ResizeObserver | undefined;
    let mutationObserver: MutationObserver | undefined;

    const setAttributes = (
      direction: string,
      hasBefore: boolean,
      hasAfter: boolean,
      prefix: string,
      suffix: string,
    ) => {
      if (visibility === "auto") {
        const both = `${prefix}${capitalize(suffix)}Scroll`;

        if (hasBefore && hasAfter) {
          el.dataset[both] = "true";
          el.removeAttribute(`data-${prefix}-scroll`);
          el.removeAttribute(`data-${suffix}-scroll`);
        } else {
          el.dataset[`${prefix}Scroll`] = hasBefore.toString();
          el.dataset[`${suffix}Scroll`] = hasAfter.toString();
          el.removeAttribute(`data-${prefix}-${suffix}-scroll`);
        }
      } else {
        const next =
          hasBefore && hasAfter ? "both" : hasBefore ? prefix : hasAfter ? suffix : "none";

        if (next !== visibleRef.current) {
          onVisibilityChange?.(next as ScrollOverflowVisibility);
          visibleRef.current = next as ScrollOverflowVisibility;
        }
      }
    };

    const checkOverflow = () => {
      const directions = [
        {type: "vertical", prefix: "top", suffix: "bottom"},
        {type: "horizontal", prefix: "left", suffix: "right"},
      ];

      const listbox = el.querySelector('ul[data-slot="list"]');

      // in virtualized listbox, el.scrollHeight is the height of the visible listbox
      const scrollHeight = +(
        listbox?.getAttribute("data-virtual-scroll-height") ?? el.scrollHeight
      );

      // in virtualized listbox, el.scrollTop is always 0
      const scrollTop = +(listbox?.getAttribute("data-virtual-scroll-top") ?? el.scrollTop);

      for (const {type, prefix, suffix} of directions) {
        if (overflowCheck === type || overflowCheck === "both") {
          const hasBefore = type === "vertical" ? scrollTop > offset : el.scrollLeft > offset;
          const hasAfter =
            type === "vertical"
              ? scrollTop + el.clientHeight + offset < scrollHeight
              : el.scrollLeft + el.clientWidth + offset < el.scrollWidth;

          setAttributes(type, hasBefore, hasAfter, prefix, suffix);
        }
      }
    };

    const clearOverflow = () => {
      ["top", "bottom", "top-bottom", "left", "right", "left-right"].forEach((attr) => {
        el.removeAttribute(`data-${attr}-scroll`);
      });
    };

    // auto
    checkOverflow();
    el.addEventListener("scroll", checkOverflow, true);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(el);

      const listbox = el.querySelector('ul[data-slot="list"]');

      if (listbox instanceof HTMLElement) {
        resizeObserver.observe(listbox);
      }
    }

    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(checkOverflow);
      mutationObserver.observe(el, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "data-virtual-scroll-height",
          "data-virtual-scroll-top",
          "style",
          "class",
        ],
      });
    }

    // controlled
    if (visibility !== "auto") {
      clearOverflow();
      if (visibility === "both") {
        el.dataset.topBottomScroll = String(
          overflowCheck === "vertical" || overflowCheck === "both",
        );
        el.dataset.leftRightScroll = String(
          overflowCheck === "horizontal" || overflowCheck === "both",
        );
      } else {
        el.dataset.topBottomScroll = "false";
        el.dataset.leftRightScroll = "false";

        ["top", "bottom", "left", "right"].forEach((attr) => {
          el.dataset[`${attr}Scroll`] = String(visibility === attr);
        });
      }
    }

    return () => {
      el.removeEventListener("scroll", checkOverflow, true);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      clearOverflow();
    };
  }, [...updateDeps, isEnabled, visibility, overflowCheck, onVisibilityChange, domRef]);
}

export type UseDataScrollOverflowReturn = ReturnType<typeof useDataScrollOverflow>;
