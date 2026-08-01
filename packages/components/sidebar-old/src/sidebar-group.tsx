import type {SidebarGroupProps} from "./types";

import {cn} from "@sytechui/theme";

import {useSidebar} from "./sidebar-context";

const SidebarGroup = ({children, title, className, ...props}: SidebarGroupProps) => {
  const {state, isMobile, reduceMotion} = useSidebar();
  const isCompact = state === "collapsed" && !isMobile;

  return (
    <section
      className={cn(
        "mb-2 last:mb-0",
        !reduceMotion &&
          "transition-[margin] duration-[var(--sidebar-duration,200ms)] ease-[var(--sidebar-ease,linear)] motion-reduce:transition-none",
        isCompact && "mb-0",
        className,
      )}
      data-slot="group"
      {...props}
    >
      {title != null && (
        <h2
          aria-hidden={isCompact || undefined}
          className={cn(
            "h-6 overflow-hidden whitespace-nowrap px-2 py-1 text-xs font-bold uppercase text-foreground-500",
            !reduceMotion &&
              "transition-[height,padding,opacity] duration-[var(--sidebar-duration,200ms)] ease-[var(--sidebar-ease,linear)] motion-reduce:transition-none",
            isCompact && "h-0 p-0 opacity-0",
          )}
          data-slot="group-label"
        >
          {title}
        </h2>
      )}
      <ul
        className="flex flex-col gap-[var(--sidebar-menu-row-gap,0.125rem)]"
        data-slot="group-content"
      >
        {children}
      </ul>
    </section>
  );
};

SidebarGroup.displayName = "HeroUI.SidebarGroup";

export {SidebarGroup};
