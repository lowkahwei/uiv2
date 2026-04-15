import type {UseScrollAreaProps} from "./use-scroll-area";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import {forwardRef} from "@heroui/system";

import {useScrollArea} from "./use-scroll-area";

export interface ScrollBarProps
  extends Pick<
      UseScrollAreaProps,
      | "classNames"
      | "scrollbarProps"
      | "thumbProps"
      | "size"
      | "hideScrollBar"
      | "hideScrollBarOnMobile"
    >,
    Omit<
      React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
      "children" | "dir"
    > {}

const ScrollBar = forwardRef<"div", ScrollBarProps>((props, ref) => {
  const {orientation = "vertical", className, ...otherProps} = props;
  const {getScrollbarProps, getThumbProps} = useScrollArea({
    orientation,
    ...(otherProps as Omit<UseScrollAreaProps, "orientation">),
  });

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      {...getScrollbarProps(orientation, {className})}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb {...getThumbProps(orientation)} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});

ScrollBar.displayName = "HeroUI.ScrollBar";

export default ScrollBar;
