import type {SidebarFooterProps} from "./types";

import {cn} from "@sytechui/theme";

const SidebarFooter = ({children, className, ...props}: SidebarFooterProps) => (
  <div
    className={cn("shrink-0 overflow-hidden border-t border-divider bg-content1 p-3", className)}
    data-slot="footer"
    {...props}
  >
    {children}
  </div>
);

SidebarFooter.displayName = "HeroUI.SidebarFooter";

export {SidebarFooter};
