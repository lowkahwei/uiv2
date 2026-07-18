import type {
  StepperReturnType,
  StepperSlots,
  StepperVariantProps,
  SlotsToClasses,
} from "@sytechui/theme";
import type {ReactRef} from "@sytechui/react-utils";
import type {HTMLHeroUIProps, PropGetter} from "@sytechui/system";
import type {Key, ReactNode} from "react";

import {useFocusRing} from "@react-aria/focus";
import {useHover, usePress} from "@react-aria/interactions";
import {cn} from "@sytechui/theme";
import {filterDOMProps, useDOMRef} from "@sytechui/react-utils";
import {dataAttr, mergeProps} from "@sytechui/shared-utils";

export type StepperStatus = "pending" | "current" | "complete" | "error" | "loading";
export type StepperItemStatus = Exclude<StepperStatus, "current">;

export type StepperItemRenderProps = {
  index: number;
  total: number;
  status: StepperStatus;
  isCurrent: boolean;
  isDisabled: boolean;
};

export interface StepperItemProps extends Omit<HTMLHeroUIProps<"li">, "children" | "title"> {
  /**
   * Ref to the list item.
   */
  ref?: ReactRef<HTMLLIElement | null>;
  /**
   * Ref to the interactive trigger.
   */
  triggerRef?: ReactRef<HTMLButtonElement | null>;
  /**
   * Primary step label.
   */
  title: ReactNode;
  /**
   * Optional secondary label.
   */
  description?: ReactNode;
  /**
   * Overrides the status inferred from the current step.
   */
  status?: StepperItemStatus;
  /**
   * Custom indicator content.
   */
  indicator?: ReactNode | ((props: StepperItemRenderProps) => ReactNode);
  /**
   * Optional localized status text exposed to assistive technology.
   */
  statusLabel?: ReactNode;
  /**
   * Disables this step interaction.
   * @default false
   */
  isDisabled?: boolean;
}

export interface InternalStepperItemProps extends StepperItemProps {
  stepKey: Key;
  index: number;
  total: number;
  resolvedStatus: StepperStatus;
  isCurrent: boolean;
  isLast: boolean;
  isInteractive: boolean;
  disableAnimation: boolean;
  variant: StepperVariantProps["variant"];
  slots: StepperReturnType;
  classNames?: SlotsToClasses<StepperSlots>;
  onCurrentChange?: (key: Key) => void;
}

export function useStepperItem(props: InternalStepperItemProps) {
  const {
    ref,
    triggerRef,
    stepKey,
    index,
    total,
    title,
    description,
    indicator,
    statusLabel,
    resolvedStatus,
    isCurrent,
    isLast,
    isInteractive,
    isDisabled = false,
    disableAnimation,
    variant,
    slots,
    classNames,
    onCurrentChange,
    className,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    ...otherProps
  } = props;

  const domRef = useDOMRef(ref);
  const triggerDomRef = useDOMRef(triggerRef);
  const canPress = isInteractive && !isDisabled && !isCurrent;
  const Component = isInteractive ? "button" : "div";

  const {isPressed, pressProps} = usePress({
    isDisabled: !canPress,
    onPress: () => onCurrentChange?.(stepKey),
  });
  const {isHovered, hoverProps} = useHover({isDisabled: !canPress});
  const {isFocused, isFocusVisible, focusProps} = useFocusRing();

  const getBaseProps: PropGetter = (props = {}) => ({
    ref: domRef,
    "data-slot": "item",
    "data-key": String(stepKey),
    "data-current": dataAttr(isCurrent),
    "data-status": resolvedStatus,
    "data-disabled": dataAttr(isDisabled),
    className: slots.item({class: cn(classNames?.item, className, props.className)}),
    ...mergeProps(filterDOMProps(otherProps), props),
  });

  const getTriggerProps: PropGetter = (props = {}) => ({
    ref: triggerDomRef,
    type: Component === "button" ? "button" : undefined,
    disabled: Component === "button" && isDisabled ? true : undefined,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-current": isCurrent ? "step" : undefined,
    "aria-busy": resolvedStatus === "loading" || undefined,
    "aria-disabled": isDisabled || undefined,
    "data-slot": "trigger",
    "data-clickable": dataAttr(canPress),
    "data-current": dataAttr(isCurrent),
    "data-status": resolvedStatus,
    "data-disabled": dataAttr(isDisabled),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-hover": dataAttr(isHovered),
    "data-pressed": dataAttr(isPressed),
    className: slots.trigger({class: cn(classNames?.trigger, props.className)}),
    ...mergeProps(canPress ? pressProps : {}, focusProps, hoverProps, props),
  });

  const getIndicatorProps: PropGetter = (props = {}) => ({
    "aria-hidden": true,
    "data-slot": "indicator",
    "data-status": resolvedStatus,
    className: slots.indicator({class: cn(classNames?.indicator, props.className)}),
  });

  const getContentProps: PropGetter = (props = {}) => ({
    "data-slot": "content",
    className: slots.content({class: cn(classNames?.content, props.className)}),
  });

  const getTitleProps: PropGetter = (props = {}) => ({
    "data-slot": "title",
    className: slots.title({class: cn(classNames?.title, props.className)}),
  });

  const getDescriptionProps: PropGetter = (props = {}) => ({
    "data-slot": "description",
    className: slots.description({class: cn(classNames?.description, props.className)}),
  });

  const getSeparatorProps: PropGetter = (props = {}) => ({
    "aria-hidden": true,
    "data-slot": "separator",
    "data-status": resolvedStatus,
    className: slots.separator({class: cn(classNames?.separator, props.className)}),
  });

  return {
    Component,
    description,
    disableAnimation,
    getBaseProps,
    getContentProps,
    getDescriptionProps,
    getIndicatorProps,
    getSeparatorProps,
    getTitleProps,
    getTriggerProps,
    index,
    indicator,
    isCurrent,
    isDisabled,
    isLast,
    resolvedStatus,
    statusLabel,
    title,
    total,
    variant,
  };
}
