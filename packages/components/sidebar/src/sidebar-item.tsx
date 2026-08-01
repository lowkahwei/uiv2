import type {ButtonProps} from "@sytechui/button";
import type {LinkProps} from "@sytechui/link";
import type {SidebarItemProps} from "./types";

import {Button} from "@sytechui/button";
import {Link} from "@sytechui/link";
import {cn} from "@sytechui/theme";
import {Tooltip} from "@sytechui/tooltip";
import {useCallback} from "react";

import {useSidebar} from "./sidebar-context";

const SidebarItem = ({
  children,
  href,
  icon,
  badge,
  action,
  closeMobileOnAction = true,
  forceReload = false,
  isActive = false,
  isDisabled = false,
  tooltip,
  tooltipProps,
  className,
  onPress,
  target: targetProp,
  rel: relProp,
  ...props
}: SidebarItemProps) => {
  const {state, isMobile, setOpenMobile, reduceMotion} = useSidebar();
  const isCompact = state === "collapsed" && !isMobile;
  const isTooltipDisabled = !isCompact || tooltip === false;
  const isExternalLink = typeof href === "string" && /^https?:\/\//i.test(href);
  const target = forceReload ? "_top" : (targetProp ?? (isExternalLink ? "_blank" : undefined));
  const rel = isExternalLink ? (relProp ?? "noopener noreferrer") : relProp;
  const handlePress: LinkProps["onPress"] = useCallback(
    (event) => {
      onPress?.(event);
      if (isMobile && closeMobileOnAction) setOpenMobile(false);
    },
    [closeMobileOnAction, isMobile, onPress, setOpenMobile],
  );
  const itemClassName = cn(
    "relative flex min-h-9 w-full min-w-0 items-center gap-0 overflow-hidden rounded-md px-0 text-left font-medium",
    !reduceMotion && "transition-colors",
    isActive ? "bg-default text-foreground" : "text-foreground-500 hover:bg-content2",
    isDisabled && "cursor-not-allowed opacity-50",
    className,
  );
  const content = (
    <>
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
          "flex min-w-0 flex-1 items-center gap-2 truncate py-2 pr-3",
          !reduceMotion && "transition-[opacity,width] duration-[var(--sidebar-duration,150ms)]",
          isCompact && "w-0 flex-none overflow-hidden p-0 opacity-0",
        )}
        data-slot="label"
      >
        <span className="truncate">{children}</span>
        {badge != null && <span className="ml-auto shrink-0">{badge}</span>}
      </span>
      {isCompact && badge != null && (
        <span aria-hidden="true" className="absolute right-0.5 top-0.5" data-slot="compact-badge">
          {badge}
        </span>
      )}
    </>
  );
  const control =
    href != null ? (
      <Link
        {...props}
        aria-current={isActive ? "page" : undefined}
        className={itemClassName}
        color="foreground"
        data-active={isActive ? "true" : undefined}
        data-slot="control"
        href={href}
        isDisabled={isDisabled}
        rel={rel}
        target={target}
        underline="none"
        onPress={handlePress}
      >
        {content}
      </Link>
    ) : (
      <Button
        {...(props as ButtonProps)}
        fullWidth
        className={itemClassName}
        data-active={isActive ? "true" : undefined}
        data-slot="control"
        disableRipple={false}
        isDisabled={isDisabled}
        radius="sm"
        variant="light"
        onPress={handlePress}
      >
        {content}
      </Button>
    );

  return (
    <li
      className="group/item relative"
      data-active={isActive ? "true" : undefined}
      data-slot="item"
    >
      <Tooltip
        closeDelay={0}
        placement="right"
        {...tooltipProps}
        content={tooltip === false ? undefined : (tooltip ?? children)}
        isDisabled={isTooltipDisabled}
      >
        {control}
      </Tooltip>
      {action != null && !isCompact && (
        <span
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/item:opacity-100 group-hover/item:opacity-100",
            !reduceMotion && "transition-opacity",
          )}
          data-slot="action"
        >
          {action}
        </span>
      )}
    </li>
  );
};

SidebarItem.displayName = "HeroUI.SidebarItem";

export {SidebarItem};
