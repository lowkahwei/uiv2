import type {ButtonProps} from "@sytechui/button";
import type {InputProps} from "@sytechui/input";
import type {HTMLHeroUIProps} from "@sytechui/system";
import type {ComponentPropsWithoutRef} from "react";

import {Button} from "@sytechui/button";
import {Divider} from "@sytechui/divider";
import {Input} from "@sytechui/input";
import {PanelLeftIcon} from "@sytechui/shared-icons";
import {forwardRef} from "@sytechui/system";
import {cn} from "@sytechui/theme";
import {forwardRef as forwardRefNative} from "react";

import {useSidebarState, useSidebarStatic} from "./use-sidebar";

export interface SidebarTriggerProps extends Omit<ButtonProps, "isIconOnly" | "onPress"> {
  /** Called when the trigger is pressed, before the sidebar toggles. */
  onPress?: ButtonProps["onPress"];
}

const SidebarTrigger = forwardRefNative<HTMLButtonElement, SidebarTriggerProps>(
  ({className, onPress, children, ...props}, ref) => {
    const {classNames, collapsible, disableAnimation, slots, toggleSidebar} = useSidebarStatic();

    if (collapsible === "none") return null;

    return (
      <Button
        ref={ref}
        isIconOnly
        aria-label="Toggle sidebar"
        className={slots.trigger({class: cn(classNames?.trigger, className)})}
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        disableAnimation={disableAnimation}
        size="sm"
        variant="light"
        onPress={(event) => {
          onPress?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        {children ?? <PanelLeftIcon height={18} width={18} />}
      </Button>
    );
  },
);

SidebarTrigger.displayName = "SytechUI.SidebarTrigger";

const SidebarRail = forwardRef<"button", HTMLHeroUIProps<"button">>(
  ({as, className, ...props}, ref) => {
    const {classNames, collapsible, slots, toggleSidebar} = useSidebarStatic();
    const {isMobile} = useSidebarState();
    const Component = as || "button";

    if (isMobile || collapsible === "none") return null;

    return (
      <Component
        ref={ref}
        aria-label="Toggle sidebar"
        className={slots.rail({class: cn(classNames?.rail, className)})}
        data-sidebar="rail"
        data-slot="sidebar-rail"
        tabIndex={-1}
        title="Toggle sidebar"
        type="button"
        onClick={toggleSidebar}
        {...props}
      />
    );
  },
);

SidebarRail.displayName = "SytechUI.SidebarRail";

const SidebarInset = forwardRef<"main", HTMLHeroUIProps<"main">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "main";

    return (
      <Component
        ref={ref}
        className={slots.inset({class: cn(classNames?.inset, className)})}
        data-slot="sidebar-inset"
        {...props}
      />
    );
  },
);

SidebarInset.displayName = "SytechUI.SidebarInset";

const SidebarInput = forwardRefNative<HTMLInputElement, InputProps>(
  ({className, ...props}, ref) => {
    const {classNames, disableAnimation, slots} = useSidebarStatic();

    return (
      <Input
        ref={ref}
        className={slots.input({class: cn(classNames?.input, className)})}
        data-sidebar="input"
        data-slot="sidebar-input"
        disableAnimation={disableAnimation}
        size="sm"
        {...props}
      />
    );
  },
);

SidebarInput.displayName = "SytechUI.SidebarInput";

const SidebarHeader = forwardRef<"div", HTMLHeroUIProps<"div">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={slots.header({class: cn(classNames?.header, className)})}
        data-sidebar="header"
        data-slot="sidebar-header"
        {...props}
      />
    );
  },
);

SidebarHeader.displayName = "SytechUI.SidebarHeader";

const SidebarFooter = forwardRef<"div", HTMLHeroUIProps<"div">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={slots.footer({class: cn(classNames?.footer, className)})}
        data-sidebar="footer"
        data-slot="sidebar-footer"
        {...props}
      />
    );
  },
);

SidebarFooter.displayName = "SytechUI.SidebarFooter";

const SidebarSeparator = forwardRefNative<HTMLElement, ComponentPropsWithoutRef<typeof Divider>>(
  ({className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();

    return (
      <Divider
        ref={ref}
        className={slots.separator({class: cn(classNames?.separator, className)})}
        data-sidebar="separator"
        data-slot="sidebar-separator"
        {...props}
      />
    );
  },
);

SidebarSeparator.displayName = "SytechUI.SidebarSeparator";

const SidebarContent = forwardRef<"div", HTMLHeroUIProps<"div">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={slots.content({class: cn(classNames?.content, className)})}
        data-sidebar="content"
        data-slot="sidebar-content"
        {...props}
      />
    );
  },
);

SidebarContent.displayName = "SytechUI.SidebarContent";

export {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
};
