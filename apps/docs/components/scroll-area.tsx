"use client";

import * as React from "react";
import {ScrollArea as HeroUIScrollArea, ScrollBar as HeroUIScrollBar, cn} from "@heroui/react";

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof HeroUIScrollArea>
>(({className, viewportProps, ...props}, ref) => (
  <HeroUIScrollArea
    ref={ref}
    className={cn(className)}
    viewportProps={{
      ...viewportProps,
      className: cn("pb-28", viewportProps?.className),
    }}
    {...props}
  />
));

ScrollArea.displayName = "DocsScrollArea";

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof HeroUIScrollBar>
>((props, ref) => <HeroUIScrollBar ref={ref} {...props} />);

ScrollBar.displayName = "DocsScrollBar";

export {ScrollArea, ScrollBar};
