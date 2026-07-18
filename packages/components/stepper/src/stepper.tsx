import type {InternalStepperItemProps, StepperStatus} from "./use-stepper-item";
import type {UseStepperProps} from "./use-stepper";
import type {ForwardedRef, ReactElement} from "react";

import {cloneElement} from "react";
import {forwardRef} from "@sytechui/system";

import {useStepper} from "./use-stepper";

export type StepperProps<T extends object = object> = UseStepperProps<T>;

const Stepper = forwardRef(function Stepper<T extends object>(
  props: StepperProps<T>,
  ref: ForwardedRef<HTMLElement>,
) {
  const {
    Component,
    children,
    classNames,
    currentKey,
    disableAnimation,
    getBaseProps,
    getListProps,
    isComplete,
    isDisabled,
    onCurrentChange,
    slots,
    variant,
  } = useStepper({...props, ref});

  const currentIndex = children.findIndex(
    (child, index) => String(child.key ?? index) === String(currentKey),
  );
  const total = children.length;

  const steps = children.map((child, index) => {
    const stepKey = child.key ?? index;
    const isCurrent = !isComplete && String(stepKey) === String(currentKey);
    const resolvedStatus: StepperStatus =
      child.props.status ??
      (isComplete
        ? "complete"
        : isCurrent
          ? "current"
          : currentIndex >= 0 && index < currentIndex
            ? "complete"
            : "pending");

    return cloneElement(child as ReactElement<InternalStepperItemProps>, {
      ...child.props,
      stepKey,
      index,
      total,
      resolvedStatus,
      isCurrent,
      isLast: index === total - 1,
      isInteractive: !!onCurrentChange,
      isDisabled: isDisabled || child.props.isDisabled,
      disableAnimation,
      variant,
      slots,
      classNames,
      onCurrentChange,
    } satisfies InternalStepperItemProps);
  });

  return (
    <Component {...getBaseProps()}>
      <ol {...getListProps()}>{steps}</ol>
    </Component>
  );
}) as <T extends object>(props: StepperProps<T>) => ReactElement;

export default Stepper;
