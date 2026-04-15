import type {UseScrollAreaProps} from "./use-scroll-area";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import {forwardRef} from "@heroui/system";

import {useScrollArea} from "./use-scroll-area";

export interface ScrollAreaProps extends UseScrollAreaProps {}

const ScrollArea = forwardRef<"div", ScrollAreaProps>((props, ref) => {
  const {
    children,
    showHorizontalScrollbar,
    showVerticalScrollbar,
    getBaseProps,
    getViewportProps,
    getScrollbarProps,
    getThumbProps,
    getCornerProps,
  } = useScrollArea({...props, ref});

  return (
    <ScrollAreaPrimitive.Root {...getBaseProps()}>
      <ScrollAreaPrimitive.Viewport {...getViewportProps()}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      {showHorizontalScrollbar && (
        <ScrollAreaPrimitive.ScrollAreaScrollbar {...getScrollbarProps("horizontal")}>
          <ScrollAreaPrimitive.ScrollAreaThumb {...getThumbProps("horizontal")} />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
      )}
      {showVerticalScrollbar && (
        <ScrollAreaPrimitive.ScrollAreaScrollbar {...getScrollbarProps("vertical")}>
          <ScrollAreaPrimitive.ScrollAreaThumb {...getThumbProps("vertical")} />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
      )}
      <ScrollAreaPrimitive.Corner {...getCornerProps()} />
    </ScrollAreaPrimitive.Root>
  );
});

ScrollArea.displayName = "HeroUI.ScrollArea";

export default ScrollArea;
