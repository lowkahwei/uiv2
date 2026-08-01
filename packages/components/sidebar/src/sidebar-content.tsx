import type {SidebarContentProps} from "./types";

import {cn} from "@sytechui/theme";

const SidebarContent = ({children, className, ...props}: SidebarContentProps) => (
  <nav
    className={cn("scrollbar-hide min-h-0 flex-1 overflow-y-auto px-3 py-2", className)}
    data-slot="content"
    {...props}
  >
    {children}
  </nav>
);

SidebarContent.displayName = "HeroUI.SidebarContent";

export {SidebarContent};
