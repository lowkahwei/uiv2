import type {SidebarGroupProps} from "./types";

import {cn} from "@sytechui/theme";

import {useSidebar} from "./sidebar-context";

const SidebarGroup = ({children, title, className, ...props}: SidebarGroupProps) => {
  const {state, isMobile} = useSidebar();
  const isCompact = state === "collapsed" && !isMobile;

  return (
    <section
      className={cn("mb-2 last:mb-0", isCompact && "mb-0", className)}
      data-slot="group"
      {...props}
    >
      {title != null && !isCompact && (
        <h2
          className="overflow-hidden px-2 py-1 text-xs font-bold uppercase text-foreground-500"
          data-slot="group-label"
        >
          {title}
        </h2>
      )}
      <ul className="flex flex-col gap-1" data-slot="group-content">
        {children}
      </ul>
    </section>
  );
};

SidebarGroup.displayName = "HeroUI.SidebarGroup";

export {SidebarGroup};
