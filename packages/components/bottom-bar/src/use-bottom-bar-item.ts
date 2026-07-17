import type {LinkProps} from "@sytechui/link";
import type {PropGetter} from "@sytechui/system";
import type {ReactRef} from "@sytechui/react-utils";
import type {ReactNode} from "react";

import {useCallback} from "react";
import {cn} from "@sytechui/theme";
import {useDOMRef} from "@sytechui/react-utils";
import {dataAttr} from "@sytechui/shared-utils";

import {useBottomBarContext, useBottomBarItemKey} from "./bottom-bar-context";

interface Props extends Omit<
  LinkProps,
  | "anchorIcon"
  | "as"
  | "children"
  | "color"
  | "href"
  | "isBlock"
  | "ref"
  | "showAnchorIcon"
  | "size"
  | "underline"
> {
  /**
   * Ref to the link element.
   */
  ref?: ReactRef<HTMLAnchorElement | null>;
  /**
   * The optional route destination.
   */
  href?: LinkProps["href"];
  /**
   * The visible and accessible item label.
   */
  children: ReactNode;
  /**
   * Icon displayed when the item is not selected.
   */
  icon?: ReactNode;
  /**
   * Icon displayed when the item is selected.
   */
  selectedIcon?: ReactNode;
  /**
   * Whether the item should receive prominent styling.
   * @default false
   */
  isProminent?: boolean;
}

export type UseBottomBarItemProps = Props;

type BottomBarLinkProps = LinkProps & {
  "data-disabled"?: ReturnType<typeof dataAttr>;
  "data-prominent"?: ReturnType<typeof dataAttr>;
  "data-selected"?: ReturnType<typeof dataAttr>;
  "data-slot": "link";
};

export function useBottomBarItem(originalProps: UseBottomBarItemProps) {
  const {
    ref,
    children,
    icon,
    selectedIcon,
    isProminent = false,
    isDisabled = false,
    className,
    onPress,
    ...otherProps
  } = originalProps;

  const itemKey = useBottomBarItemKey();
  const {classNames, selectedKey, setSelectedKey, slots} = useBottomBarContext();
  const domRef = useDOMRef(ref);
  const isSelected = selectedKey === itemKey;
  const renderedIcon = isSelected && selectedIcon != null ? selectedIcon : icon;

  const handlePress: LinkProps["onPress"] = useCallback(
    (event) => {
      if (!isDisabled) {
        setSelectedKey(itemKey);
      }
      onPress?.(event);
    },
    [isDisabled, itemKey, onPress, setSelectedKey],
  );

  const getItemProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "item",
      "data-disabled": dataAttr(isDisabled),
      "data-prominent": dataAttr(isProminent),
      "data-selected": dataAttr(isSelected),
      className: slots.item({class: cn(classNames?.item, props.className)}),
    }),
    [classNames?.item, isDisabled, isProminent, isSelected, slots],
  );

  const getLinkProps = useCallback(
    (): BottomBarLinkProps => ({
      ref: domRef,
      ...otherProps,
      "aria-current": isSelected ? "page" : undefined,
      "data-slot": "link",
      "data-disabled": dataAttr(isDisabled),
      "data-prominent": dataAttr(isProminent),
      "data-selected": dataAttr(isSelected),
      className: slots.link({
        class: cn(classNames?.link, className),
      }),
      color: "foreground",
      href: originalProps.href,
      isDisabled,
      onPress: handlePress,
      underline: "none",
    }),
    [
      className,
      classNames?.link,
      domRef,
      handlePress,
      isDisabled,
      isProminent,
      isSelected,
      originalProps.href,
      otherProps,
      slots,
    ],
  );

  const getIconProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "aria-hidden": true,
      "data-slot": "icon",
      className: slots.icon({class: cn(classNames?.icon, props.className)}),
    }),
    [classNames?.icon, slots],
  );

  const getLabelProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "label",
      className: slots.label({class: cn(classNames?.label, props.className)}),
    }),
    [classNames?.label, slots],
  );

  return {
    children,
    getIconProps,
    getItemProps,
    getLabelProps,
    getLinkProps,
    isSelected,
    renderedIcon,
  };
}

export type UseBottomBarItemReturn = ReturnType<typeof useBottomBarItem>;
