import type {SidebarTriggerProps} from "./types";

import {Button} from "@sytechui/button";
import {cn} from "@sytechui/theme";

import {useSidebar} from "./sidebar-context";

const SidebarIcon = () => (
  <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
    <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="4" />
    <path d="M9 4v16" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const SidebarTrigger = ({label, className, onPress, children, ...props}: SidebarTriggerProps) => {
  const {state, isMobile, openMobile, toggleSidebar} = useSidebar();
  const accessibleLabel =
    label ??
    (isMobile
      ? openMobile
        ? "Close sidebar"
        : "Open sidebar"
      : state === "collapsed"
        ? "Expand sidebar"
        : "Collapse sidebar");

  return (
    <Button
      isIconOnly
      aria-label={accessibleLabel}
      className={cn("shrink-0", className)}
      data-slot="trigger"
      size="sm"
      title={accessibleLabel}
      variant="light"
      onPress={(event) => {
        onPress?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {children ?? <SidebarIcon />}
    </Button>
  );
};

SidebarTrigger.displayName = "HeroUI.SidebarTrigger";

export {SidebarTrigger};
