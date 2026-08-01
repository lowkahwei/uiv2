import type {SidebarSubmenuProps} from "./types";

import {Button} from "@sytechui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@sytechui/popover";
import {cn} from "@sytechui/theme";
import {Tooltip} from "@sytechui/tooltip";
import {useState} from "react";

import {SidebarExpandedScope, useSidebar} from "./sidebar-context";

const ChevronIcon = ({isOpen, reduceMotion}: {isOpen: boolean; reduceMotion: boolean}) => (
  <svg
    aria-hidden="true"
    className={cn(
      "ml-auto shrink-0",
      !reduceMotion && "transition-transform duration-[var(--sidebar-duration,200ms)]",
      isOpen && "rotate-90",
    )}
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
  showGuideLines = true,
  className,
  ...props
}: SidebarSubmenuProps) => {
  const {state, isMobile, reduceMotion} = useSidebar();
  const isCompact = state === "collapsed" && !isMobile;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const isTooltipDisabled = !isCompact || tooltip === false;
  const isExpanded = isOpen && !isCompact;
  const submenuContentClassName = cn(
    "mt-0.5 ml-[calc(var(--sidebar-menu-indent,1rem)/2)] flex flex-col gap-[var(--sidebar-menu-row-gap,0.125rem)] pl-[calc(var(--sidebar-menu-indent,1rem)/2)]",
    showGuideLines === true &&
      "border-l border-[var(--sidebar-menu-guide-color,hsl(var(--heroui-divider)/0.1))]",
    showGuideLines === "hover" && [
      "border-l border-transparent group-hover/submenu:border-[var(--sidebar-menu-guide-color,hsl(var(--heroui-divider)/0.1))]",
      !reduceMotion && "transition-colors",
    ],
  );

  const trigger = (
    <Button
      {...props}
      fullWidth
      aria-expanded={isCompact ? flyoutOpen : isExpanded}
      className={cn(
        "relative flex h-9 min-h-9 w-full min-w-0 items-center gap-0 overflow-hidden rounded-md px-0 text-left text-sm font-medium text-foreground-500 hover:bg-content2",
        !reduceMotion && "transition-colors",
        className,
      )}
      data-slot="control"
      disableRipple={false}
      radius="sm"
      variant="light"
      onPress={() => !isCompact && setIsOpen((open) => !open)}
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
          "flex min-w-0 flex-1 items-center gap-2 truncate whitespace-nowrap py-1.5 pr-3",
          icon == null && "pl-2.5",
        )}
        data-slot="label"
      >
        <span className="truncate">{label}</span>
        {badge != null && <span className="shrink-0">{badge}</span>}
        <ChevronIcon isOpen={isOpen} reduceMotion={reduceMotion} />
      </span>
    </Button>
  );

  return (
    <li className="group/submenu" data-slot="submenu">
      {isCompact ? (
        <Popover isOpen={flyoutOpen} placement="right-start" onOpenChange={setFlyoutOpen}>
          <PopoverTrigger>{trigger}</PopoverTrigger>
          <PopoverContent className="group/submenu min-w-48 p-2">
            <p className="px-2 py-1 text-xs font-bold uppercase text-foreground-500">{label}</p>
            <SidebarExpandedScope>
              <ul
                className={submenuContentClassName}
                data-guide-lines={String(showGuideLines)}
                data-slot="submenu-content"
                onClickCapture={() => setFlyoutOpen(false)}
              >
                {children}
              </ul>
            </SidebarExpandedScope>
          </PopoverContent>
        </Popover>
      ) : (
        <Tooltip
          closeDelay={0}
          placement="right"
          {...tooltipProps}
          content={tooltip === false ? undefined : (tooltip ?? label)}
          isDisabled={isTooltipDisabled}
        >
          {trigger}
        </Tooltip>
      )}
      {isExpanded && (
        <ul
          className={submenuContentClassName}
          data-guide-lines={String(showGuideLines)}
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
