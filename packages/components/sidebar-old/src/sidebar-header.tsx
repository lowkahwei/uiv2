import type {SidebarHeaderProps} from "./types";

import {cn} from "@sytechui/theme";

const SidebarHeader = ({children, className, ...props}: SidebarHeaderProps) => (
  <div
    className={cn("shrink-0 overflow-hidden border-b border-divider bg-content1 p-3", className)}
    data-slot="header"
    {...props}
  >
    {children}
  </div>
);

SidebarHeader.displayName = "HeroUI.SidebarHeader";

export {SidebarHeader};
