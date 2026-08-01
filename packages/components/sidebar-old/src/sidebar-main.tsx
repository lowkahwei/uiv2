import type {SidebarMainProps} from "./types";

import {cn} from "@sytechui/theme";

const SidebarMain = ({className, ...props}: SidebarMainProps) => (
  <main className={cn("min-w-0 flex-1 overflow-auto", className)} data-slot="main" {...props} />
);

SidebarMain.displayName = "HeroUI.SidebarMain";

export {SidebarMain};
