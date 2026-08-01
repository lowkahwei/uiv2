import type {SidebarSubmenuProps} from "./types";

import {Button} from "@sytechui/button";
import {cn} from "@sytechui/theme";
import {Tooltip} from "@sytechui/tooltip";
import {useState} from "react";

import {useSidebar} from "./sidebar-context";

const ChevronIcon = ({isOpen}: {isOpen: boolean}) => (
  <svg
    aria-hidden="true"
    className={cn("ml-auto shrink-0 transition-transform duration-150", isOpen && "rotate-90")}
    fill="none"
    height="14"
    viewBox="0 0 24 24"
    width="14"
  >
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const SidebarSubmenu = ({
  label,
  children,
  icon,
  badge,
  defaultOpen = false,
  tooltip,
  tooltipProps,
  className,
  ...props
}: SidebarSubmenuProps) => {
  const {state, isMobile, setOpen} = useSidebar();
  const isCompact = state === "collapsed" && !isMobile;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isTooltipDisabled = !isCompact || tooltip === false;
  const isExpanded = isOpen && !isCompact;

  const trigger = (
    <Button
      {...props}
      fullWidth
      aria-expanded={isExpanded}
      className={cn(
        "relative flex min-h-9 w-full min-w-0 items-center gap-0 overflow-hidden rounded-md px-0 text-left font-medium text-foreground-500 transition-colors hover:bg-content2",
        className,
      )}
      data-slot="control"
      disableRipple={false}
      radius="sm"
      variant="light"
      onPress={() => {
        if (isCompact) {
          setOpen(true);
          setIsOpen(true);
        } else {
          setIsOpen((open) => !open);
        }
      }}
    >
      {icon != null && (
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center [&>svg]:block [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0"
          data-slot="icon"
        >
          {icon}
        </span>
      )}
      <span
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 truncate py-2 pr-3 transition-[opacity,width] duration-150",
          isCompact && "w-0 flex-none overflow-hidden p-0 opacity-0",
        )}
        data-slot="label"
      >
        <span className="truncate">{label}</span>
        {badge != null && <span className="shrink-0">{badge}</span>}
        {!isCompact && <ChevronIcon isOpen={isOpen} />}
      </span>
    </Button>
  );

  return (
    <li data-slot="submenu">
      <Tooltip
        closeDelay={0}
        placement="right"
        {...tooltipProps}
        content={tooltip === false ? undefined : (tooltip ?? label)}
        isDisabled={isTooltipDisabled}
      >
        {trigger}
      </Tooltip>
      {isExpanded && (
        <ul
          className="mt-1 flex flex-col gap-1 border-l border-divider pl-4"
          data-slot="submenu-content"
        >
          {children}
        </ul>
      )}
    </li>
  );
};

SidebarSubmenu.displayName = "HeroUI.SidebarSubmenu";

export {SidebarSubmenu};
