import type {
  InternalStepperItemProps,
  StepperItemProps,
  StepperItemRenderProps,
} from "./use-stepper-item";

import {CheckIcon, CloseIcon} from "@sytechui/shared-icons";
import {cn} from "@sytechui/theme";
import {forwardRef} from "@sytechui/system";

import {useStepperItem} from "./use-stepper-item";

export type {StepperItemProps} from "./use-stepper-item";

const StepperItem = forwardRef<"li", StepperItemProps>((publicProps, ref) => {
  const props = publicProps as InternalStepperItemProps;
  const {
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
  } = useStepperItem({...props, ref});

  const renderProps: StepperItemRenderProps = {
    index,
    total,
    status: resolvedStatus,
    isCurrent,
    isDisabled,
  };

  const defaultIndicator =
    variant === "dot"
      ? null
      : {
          complete: <CheckIcon />,
          error: <CloseIcon />,
          loading: (
            <span
              className={cn(
                "h-[1em] w-[1em] rounded-full border-2 border-current border-t-transparent",
                !disableAnimation && "animate-spin",
              )}
            />
          ),
          current: index + 1,
          pending: index + 1,
        }[resolvedStatus];

  return (
    <li {...getBaseProps()}>
      <Component {...getTriggerProps()}>
        <span {...getIndicatorProps()}>
          {typeof indicator === "function"
            ? indicator(renderProps)
            : (indicator ?? defaultIndicator)}
        </span>
        <span {...getContentProps()}>
          <span {...getTitleProps()}>{title}</span>
          {description != null && <span {...getDescriptionProps()}>{description}</span>}
          {statusLabel != null && <span className="sr-only">{statusLabel}</span>}
        </span>
      </Component>
      {!isLast && <span {...getSeparatorProps()} />}
    </li>
  );
});

StepperItem.displayName = "SytechUI.StepperItem";

export default StepperItem;
