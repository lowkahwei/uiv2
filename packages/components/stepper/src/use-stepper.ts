import type {StepperSlots, StepperVariantProps, SlotsToClasses} from "@sytechui/theme";
import type {ReactRef} from "@sytechui/react-utils";
import type {HTMLHeroUIProps, PropGetter} from "@sytechui/system";
import type {Key, ReactElement, ReactNode} from "react";
import type {StepperItemProps} from "./stepper-item";

import {stepper, cn} from "@sytechui/theme";
import {filterDOMProps, useDOMRef} from "@sytechui/react-utils";
import {mapPropsVariants, useProviderContext} from "@sytechui/system";
import {mergeProps, objectToDeps} from "@sytechui/shared-utils";
import {Children, Fragment, isValidElement, useMemo} from "react";

import StepperItem from "./stepper-item";

function flattenStepperItems(children: ReactNode): ReactElement<StepperItemProps>[] {
  const items: ReactElement<StepperItemProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === Fragment) {
      flattenStepperItems((child.props as {children?: ReactNode}).children).forEach((item) =>
        items.push(item),
      );
    } else if (child.type === StepperItem) {
      items.push(child as ReactElement<StepperItemProps>);
    }
  });

  return items;
}

export type StepperStateProps =
  | {
      currentKey: Key;
      isComplete?: false;
    }
  | {
      currentKey?: never;
      isComplete: true;
    };

interface StepperBaseProps<T extends object> extends Omit<HTMLHeroUIProps<"div">, "children"> {
  /**
   * Ref to the root DOM node.
   */
  ref?: ReactRef<HTMLElement | null>;
  /**
   * Static step items or a render function used with `items`.
   */
  children: ReactNode | ((item: T) => ReactElement<StepperItemProps>);
  /**
   * Dynamic items rendered by the children function.
   */
  items?: Iterable<T>;
  /**
   * Called when an enabled, non-current step is pressed.
   * Providing this callback makes step triggers interactive.
   */
  onCurrentChange?: (key: Key) => void;
  /**
   * Disables all step interactions.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Classes for the component slots.
   */
  classNames?: SlotsToClasses<StepperSlots>;
}

export type UseStepperProps<T extends object> = StepperBaseProps<T> &
  StepperStateProps &
  StepperVariantProps;

export function useStepper<T extends object>(originalProps: UseStepperProps<T>) {
  const globalContext = useProviderContext();
  const [props, variantProps] = mapPropsVariants(originalProps, stepper.variantKeys);

  const {
    ref,
    as,
    children: childrenProp,
    items,
    className,
    classNames,
    onCurrentChange,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...otherProps
  } = props;

  const disableAnimation =
    originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false;
  const isDisabled = originalProps.isDisabled ?? false;
  const orientation = (variantProps as StepperVariantProps).orientation ?? "horizontal";
  const variant = (variantProps as StepperVariantProps).variant ?? "solid";
  const Component = as || (onCurrentChange ? "nav" : "div");
  const isNavigation = Component === "nav" || otherProps.role === "navigation";
  const domRef = useDOMRef(ref);

  const renderedChildren = useMemo(
    () =>
      typeof childrenProp === "function"
        ? Array.from(items ?? [], (item) => childrenProp(item))
        : childrenProp,
    [childrenProp, items],
  );
  const children = flattenStepperItems(renderedChildren);

  const slots = useMemo(
    () =>
      stepper({
        ...variantProps,
        disableAnimation,
        isDisabled,
      }),
    [objectToDeps(variantProps), disableAnimation, isDisabled],
  );

  const getBaseProps: PropGetter = (props = {}) => ({
    ref: domRef,
    "data-slot": "base",
    "data-orientation": orientation,
    "aria-label": isNavigation ? ariaLabel : undefined,
    "aria-labelledby": isNavigation ? ariaLabelledBy : undefined,
    className: slots.base({class: cn(classNames?.base, className, props.className)}),
    ...mergeProps(
      filterDOMProps(otherProps, {
        enabled: typeof Component === "string",
      }),
      props,
    ),
  });

  const getListProps: PropGetter = (props = {}) => ({
    "data-slot": "list",
    "data-orientation": orientation,
    "aria-label": !isNavigation ? ariaLabel : undefined,
    "aria-labelledby": !isNavigation ? ariaLabelledBy : undefined,
    className: slots.list({class: cn(classNames?.list, props.className)}),
  });

  return {
    Component,
    children,
    classNames,
    currentKey: originalProps.currentKey,
    disableAnimation,
    domRef,
    getBaseProps,
    getListProps,
    isComplete: originalProps.isComplete === true,
    isDisabled,
    onCurrentChange,
    orientation,
    slots,
    variant,
  };
}

export type UseStepperReturn = ReturnType<typeof useStepper>;
