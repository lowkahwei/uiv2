import type {SidebarContentProps} from "./types";

import {ScrollShadow} from "@sytechui/scroll-shadow";
import {cn} from "@sytechui/theme";

const SidebarContent = ({children, className, ...props}: SidebarContentProps) => (
  <ScrollShadow
    hideScrollBar
    as="nav"
    className={cn("min-h-0 flex-1 px-3 py-2", className)}
    data-slot="content"
    {...props}
  >
    {children}
  </ScrollShadow>
);

SidebarContent.displayName = "HeroUI.SidebarContent";

export {SidebarContent};
