import type {SlotsToClasses, ScrollAreaSlots, ScrollAreaVariantProps} from "@sytechui/theme";
import type {PropGetter} from "@sytechui/system";
import type {ReactRef} from "@sytechui/react-utils";
import type {
  ScrollOverflowCheck,
  UseDataScrollOverflowProps,
} from "@sytechui/use-data-scroll-overflow";
import type * as React from "react";
import type {ReactNode} from "react";
import type * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import {scrollArea, scrollShadow, cn} from "@sytechui/theme";
import {mapPropsVariants} from "@sytechui/system";
import {useDOMRef, mergeRefs} from "@sytechui/react-utils";
import {useDataScrollOverflow} from "@sytechui/use-data-scroll-overflow";
import {objectToDeps, mergeProps} from "@sytechui/shared-utils";
import {useCallback, useMemo, useRef} from "react";

type RootProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>;
type ViewportProps = React.ComponentPropsWithRef<typeof ScrollAreaPrimitive.Viewport>;
type ScrollbarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;
type ThumbProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaThumb>;
type CornerProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner>;
export type ScrollBarBehavior = "inside" | "outside";

const emptyOutsideStyles = {
  base: "",
  viewport: "",
  scrollbar: "",
} as const;

const outsideStylesByOrientation = {
  horizontal: {
    base: "flex flex-col",
    viewport: "min-h-0 flex-1",
    scrollbar: "w-full shrink-0",
  },
  vertical: {
    base: "flex flex-row",
    viewport: "min-w-0 flex-1",
    scrollbar: "shrink-0",
  },
  both: emptyOutsideStyles,
} as const;

interface Props extends Omit<RootProps, "children">, Omit<UseDataScrollOverflowProps, "domRef"> {
  /**
   * Ref to the root DOM node.
   */
  ref?: ReactRef<HTMLDivElement | null>;
  /**
   * The scrollable content.
   */
  children?: ReactNode;
  /**
   * Enables scroll shadows on the viewport.
   * @default false
   */
  shadow?: boolean;
  /**
   * The shadow size in pixels.
   * @default 40
   */
  shadowSize?: number;
  /**
   * Additional slot-level class overrides.
   */
  classNames?: SlotsToClasses<ScrollAreaSlots>;
  /**
   * Viewport props.
   */
  viewportProps?: Omit<ViewportProps, "children" | "ref">;
  /**
   * Shared scrollbar props for each rendered scrollbar.
   */
  scrollbarProps?: Omit<ScrollbarProps, "children" | "orientation">;
  /**
   * Shared thumb props for each rendered thumb.
   */
  thumbProps?: Omit<ThumbProps, "children">;
  /**
   * Corner props.
   */
  cornerProps?: CornerProps;
  /**
   * Optional ref to the viewport DOM node.
   */
  scrollViewPortRef?: ReactRef<HTMLDivElement | null>;
  /**
   * The viewport scroll direction.
   * @default "vertical"
   */
  orientation?: ScrollOverflowCheck;
  /**
   * Controls whether the scrollbar is positioned inside or outside the root.
   * @default "inside"
   */
  scrollBehavior?: ScrollBarBehavior;
}

export type UseScrollAreaProps = Props & ScrollAreaVariantProps;

export function useScrollArea(originalProps: UseScrollAreaProps) {
  const [props, variantProps] = mapPropsVariants(originalProps, scrollArea.variantKeys);

  const {
    ref,
    children,
    className,
    classNames,
    shadow = false,
    shadowSize = 40,
    scrollViewPortRef,
    onScroll,
    viewportProps,
    scrollbarProps,
    thumbProps,
    cornerProps,
    orientation = "vertical",
    scrollBehavior = "inside",
    offset = 0,
    visibility = "auto",
    isEnabled = true,
    onVisibilityChange,
    updateDeps = [],
    ...otherProps
  } = props;

  const domRef = useDOMRef<HTMLDivElement>(ref);
  const viewportRef = useRef<HTMLDivElement>(null);
  const outsideStyles =
    scrollBehavior === "outside" ? outsideStylesByOrientation[orientation] : emptyOutsideStyles;

  useDataScrollOverflow({
    domRef: viewportRef,
    offset,
    visibility,
    isEnabled: shadow && isEnabled,
    onVisibilityChange,
    updateDeps,
    overflowCheck: orientation,
  });

  const slots = useMemo(() => scrollArea(variantProps), [objectToDeps(variantProps)]);

  const viewportShadowStyles = useMemo(
    () =>
      shadow
        ? scrollShadow({
            orientation,
            hideScrollBar: false,
          })
        : "",
    [shadow, orientation],
  );

  const getBaseProps = useCallback<PropGetter>(
    (props = {}) => {
      const mergedProps = mergeProps(otherProps, props);

      return {
        ...mergedProps,
        ref: domRef,
        "data-slot": "base",
        className: slots.base({
          class: cn(classNames?.base, outsideStyles.base, className, mergedProps.className),
        }),
      };
    },
    [domRef, slots, classNames?.base, outsideStyles.base, className, otherProps],
  );

  const getViewportProps = useCallback(
    (props: ViewportProps = {}) => {
      const mergedOnScroll: ViewportProps["onScroll"] = (event) => {
        viewportProps?.onScroll?.(event);
        onScroll?.(event as React.UIEvent<HTMLDivElement>);
        props.onScroll?.(event);
      };

      return {
        ...viewportProps,
        ...props,
        ref: mergeRefs(viewportRef, scrollViewPortRef, props.ref),
        "data-slot": "viewport" as const,
        "data-orientation": orientation,
        className: slots.viewport({
          class: cn(
            classNames?.viewport,
            outsideStyles.viewport,
            viewportShadowStyles,
            viewportProps?.className,
            props.className,
          ),
        }),
        style: {
          ...(shadow ? {"--scroll-shadow-size": `${shadowSize}px`} : {}),
          ...viewportProps?.style,
          ...props.style,
        } as React.CSSProperties,
        onScroll: mergedOnScroll,
      };
    },
    [
      slots,
      classNames?.viewport,
      viewportShadowStyles,
      viewportProps,
      onScroll,
      shadow,
      shadowSize,
      scrollViewPortRef,
      orientation,
      outsideStyles.viewport,
    ],
  );

  const getScrollbarProps = useCallback(
    (scrollbarOrientation: Exclude<ScrollOverflowCheck, "both">, props: ScrollbarProps = {}) => {
      const mergedProps = mergeProps(scrollbarProps || {}, props);

      return {
        ...mergedProps,
        "data-slot": "scrollbar" as const,
        "data-orientation": scrollbarOrientation,
        orientation: scrollbarOrientation,
        style:
          scrollBehavior === "outside"
            ? {
                ...mergedProps.style,
                position: undefined,
              }
            : mergedProps.style,
        className: slots.scrollbar({
          class: cn(classNames?.scrollbar, outsideStyles.scrollbar, mergedProps.className),
        }),
      };
    },
    [slots, classNames?.scrollbar, scrollbarProps, scrollBehavior, outsideStyles.scrollbar],
  );

  const getThumbProps = useCallback(
    (scrollbarOrientation: Exclude<ScrollOverflowCheck, "both">, props: ThumbProps = {}) => {
      const mergedProps = mergeProps(thumbProps || {}, props);

      return {
        ...mergedProps,
        "data-slot": "thumb" as const,
        "data-orientation": scrollbarOrientation,
        className: slots.thumb({
          class: cn(classNames?.thumb, mergedProps.className),
        }),
      };
    },
    [slots, classNames?.thumb, thumbProps],
  );

  const getCornerProps = useCallback(
    (props: CornerProps = {}) => {
      const mergedProps = mergeProps(cornerProps || {}, props);

      return {
        ...mergedProps,
        "data-slot": "corner" as const,
        className: slots.corner({
          class: cn(classNames?.corner, mergedProps.className),
        }),
      };
    },
    [slots, classNames?.corner, cornerProps],
  );

  return {
    children,
    domRef,
    viewportRef,
    orientation,
    showVerticalScrollbar: orientation === "vertical" || orientation === "both",
    showHorizontalScrollbar: orientation === "horizontal" || orientation === "both",
    getBaseProps,
    getViewportProps,
    getScrollbarProps,
    getThumbProps,
    getCornerProps,
  };
}

export type UseScrollAreaReturn = ReturnType<typeof useScrollArea>;
