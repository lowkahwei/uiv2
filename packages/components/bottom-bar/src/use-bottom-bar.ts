import type {BottomBarSlots, BottomBarVariantProps, SlotsToClasses} from "@sytechui/theme";
import type {HTMLHeroUIProps, PropGetter} from "@sytechui/system";
import type {ReactRef} from "@sytechui/react-utils";
import type {Key, ReactElement, ReactNode} from "react";
import type {BottomBarItemProps} from "./bottom-bar-item";

import {Children, isValidElement, useCallback, useMemo} from "react";
import {bottomBar, cn} from "@sytechui/theme";
import {mapPropsVariants, useProviderContext} from "@sytechui/system";
import {filterDOMProps, useDOMRef} from "@sytechui/react-utils";
import {mergeProps, objectToDeps} from "@sytechui/shared-utils";
import {useControlledState} from "@react-stately/utils";

interface Props extends Omit<HTMLHeroUIProps<"nav">, "children"> {
  /**
   * Ref to the navigation element.
   */
  ref?: ReactRef<HTMLElement | null>;
  /**
   * The bottom navigation items.
   */
  children?:
    | ReactElement<BottomBarItemProps>
    | (ReactElement<BottomBarItemProps> | null | false)[]
    | null
    | false;
  /**
   * The key of the currently selected item.
   */
  selectedKey?: Key;
  /**
   * The key of the initially selected item.
   */
  defaultSelectedKey?: Key;
  /**
   * Handler called when the selected item changes.
   */
  onSelectionChange?: (key: Key) => void;
  /**
   * Class names for each BottomBar slot.
   */
  classNames?: SlotsToClasses<BottomBarSlots>;
}

export type UseBottomBarProps = Props & BottomBarVariantProps;

function getFirstEnabledKey(children: ReactNode): Key | null {
  let firstKey: Key | null = null;

  Children.forEach(children, (child, index) => {
    if (firstKey === null && isValidElement<BottomBarItemProps>(child) && !child.props.isDisabled) {
      firstKey = child.key ?? index;
    }
  });

  return firstKey;
}

export function useBottomBar(originalProps: UseBottomBarProps) {
  const globalContext = useProviderContext();
  const [props, variantProps] = mapPropsVariants(originalProps, bottomBar.variantKeys);

  const {
    ref,
    as,
    children,
    selectedKey: selectedKeyProp,
    defaultSelectedKey,
    onSelectionChange,
    className,
    classNames,
    ...otherProps
  } = props;

  const Component = as || "nav";
  const shouldFilterDOMProps = typeof Component === "string";
  const domRef = useDOMRef(ref);
  const disableAnimation =
    originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false;
  const firstEnabledKey = useMemo(() => getFirstEnabledKey(children), [children]);

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (key !== null) {
        onSelectionChange?.(key);
      }
    },
    [onSelectionChange],
  );

  const [selectedKey, setSelectedKey] = useControlledState<Key | null>(
    selectedKeyProp,
    defaultSelectedKey ?? firstEnabledKey,
    handleSelectionChange,
  );

  const slots = useMemo(
    () =>
      bottomBar({
        ...variantProps,
        disableAnimation,
      }),
    [objectToDeps(variantProps), disableAnimation],
  );

  const baseStyles = cn(classNames?.base, className);

  const getBaseProps: PropGetter = useCallback(
    (props = {}) => ({
      ref: domRef,
      ...mergeProps(
        filterDOMProps(otherProps, {
          enabled: shouldFilterDOMProps,
        }),
        props,
      ),
      "data-slot": "base",
      className: slots.base({class: cn(baseStyles, props.className)}),
    }),
    [baseStyles, domRef, otherProps, shouldFilterDOMProps, slots],
  );

  const getListProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "list",
      className: slots.list({class: cn(classNames?.list, props.className)}),
    }),
    [classNames?.list, slots],
  );

  const getSelectionIndicatorProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "aria-hidden": true,
      "data-selected": "true",
      "data-slot": "selectionIndicator",
      className: slots.selectionIndicator({
        class: cn(classNames?.selectionIndicator, props.className),
      }),
    }),
    [classNames?.selectionIndicator, slots],
  );

  return {
    Component,
    children,
    classNames,
    disableAnimation,
    domRef,
    selectedKey,
    setSelectedKey,
    slots,
    getBaseProps,
    getListProps,
    getSelectionIndicatorProps,
  };
}

export type UseBottomBarReturn = ReturnType<typeof useBottomBar>;
