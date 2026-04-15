"use client";

import * as React from "react";
import {ScrollArea as HeroUIScrollArea, cn} from "@heroui/react";

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

export {ScrollArea};
