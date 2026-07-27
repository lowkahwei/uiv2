"use client";

import type {AlertSlots, AlertVariants, SlotsToClasses} from "@sytechui/theme";
import type {HTMLHeroUIProps} from "@sytechui/system";

import {forwardRef} from "@sytechui/system";
import {DangerIcon, InfoIcon, SuccessIcon, WarningIcon} from "@sytechui/shared-icons";
import {alertVariants} from "@sytechui/theme";
import {createContext, useContext, useMemo} from "react";

type AlertStatus = NonNullable<AlertVariants["status"]>;
type AlertContextValue = {
  classNames?: SlotsToClasses<AlertSlots>;
  slots?: ReturnType<typeof alertVariants>;
  status?: AlertStatus;
};

const AlertContext = createContext<AlertContextValue>({});

export interface AlertRootProps extends HTMLHeroUIProps<"div"> {
  /** The visual status of the alert. */
  status?: AlertStatus;
  /** The border radius of the alert. */
  radius?: AlertVariants["radius"];
  /** Classes applied to each alert slot. */
  classNames?: SlotsToClasses<AlertSlots>;
}

const AlertRoot = forwardRef<"div", AlertRootProps>(
  ({as, children, className, classNames, radius, status = "default", ...props}, ref) => {
    const Component = as || "div";
    const slots = useMemo(() => alertVariants({radius, status}), [radius, status]);

    return (
      <AlertContext.Provider value={{classNames, slots, status}}>
        <Component
          ref={ref}
          className={slots.base({class: [classNames?.base, className]})}
          data-slot="alert-root"
          role="alert"
          {...props}
        >
          {children}
        </Component>
      </AlertContext.Provider>
    );
  },
);

export interface AlertIndicatorProps extends HTMLHeroUIProps<"div"> {}

const statusIcons = {
  default: InfoIcon,
  accent: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  danger: DangerIcon,
} satisfies Record<AlertStatus, typeof InfoIcon>;

const AlertIndicator = forwardRef<"div", AlertIndicatorProps>(
  ({as, children, className, ...props}, ref) => {
    const Component = as || "div";
    const {classNames, slots, status = "default"} = useContext(AlertContext);
    const Icon = statusIcons[status];

    return (
      <Component
        ref={ref}
        className={slots?.indicator({class: [classNames?.indicator, className]})}
        data-slot="alert-indicator"
        {...props}
      >
        {children ?? <Icon data-slot="alert-default-icon" />}
      </Component>
    );
  },
);

export interface AlertContentProps extends HTMLHeroUIProps<"div"> {}

const AlertContent = forwardRef<"div", AlertContentProps>(
  ({as, children, className, ...props}, ref) => {
    const Component = as || "div";
    const {classNames, slots} = useContext(AlertContext);

    return (
      <Component
        ref={ref}
        className={slots?.content({class: [classNames?.content, className]})}
        data-slot="alert-content"
        {...props}
      >
        {children}
      </Component>
    );
  },
);

export interface AlertTitleProps extends HTMLHeroUIProps<"p"> {}

const AlertTitle = forwardRef<"p", AlertTitleProps>(({as, children, className, ...props}, ref) => {
  const Component = as || "p";
  const {classNames, slots} = useContext(AlertContext);

  return (
    <Component
      ref={ref}
      className={slots?.title({class: [classNames?.title, className]})}
      data-slot="alert-title"
      {...props}
    >
      {children}
    </Component>
  );
});

export interface AlertDescriptionProps extends HTMLHeroUIProps<"span"> {}

const AlertDescription = forwardRef<"span", AlertDescriptionProps>(
  ({as, children, className, ...props}, ref) => {
    const Component = as || "span";
    const {classNames, slots} = useContext(AlertContext);

    return (
      <Component
        ref={ref}
        className={slots?.description({class: [classNames?.description, className]})}
        data-slot="alert-description"
        {...props}
      >
        {children}
      </Component>
    );
  },
);

AlertRoot.displayName = "SytechUI.Alert";
AlertIndicator.displayName = "SytechUI.AlertIndicator";
AlertContent.displayName = "SytechUI.AlertContent";
AlertTitle.displayName = "SytechUI.AlertTitle";
AlertDescription.displayName = "SytechUI.AlertDescription";

export {AlertRoot, AlertIndicator, AlertContent, AlertTitle, AlertDescription};
