import type {DividerVariantProps} from "@sytechui/theme";
import type {HTMLHeroUIProps, PropGetter} from "@sytechui/system-rsc";
import type {Ref} from "react";
import type {SeparatorProps as AriaSeparatorProps} from "./use-separator";

import {divider} from "@sytechui/theme";

import {useSeparator} from "./use-separator";

interface Props extends HTMLHeroUIProps<"hr"> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<HTMLElement> | undefined;
  /**
   * Whether the divider is purely decorative.
   * @default false
   */
  isDecorative?: boolean;
}

export type UseDividerProps = Props & DividerVariantProps & Omit<AriaSeparatorProps, "elementType">;

export function useDivider(props: UseDividerProps) {
  const {as, className, isDecorative = false, orientation = "horizontal", ...otherProps} = props;

  let Component = as || "hr";

  if (Component === "hr" && orientation === "vertical") {
    Component = "div";
  }

  const {separatorProps} = useSeparator({
    elementType: typeof Component === "string" ? Component : undefined,
    orientation,
  });

  const styles = divider({
    orientation,
    className,
  });

  const decorativeProps = isDecorative
    ? {
        role: "presentation" as const,
        "aria-orientation": undefined,
      }
    : {};

  const getDividerProps: PropGetter = (props = {}) => ({
    className: styles,
    ...separatorProps,
    ...otherProps,
    ...props,
    "data-orientation": orientation,
    ...decorativeProps,
  });

  return {Component, getDividerProps};
}

export type UseDividerReturn = ReturnType<typeof useDivider>;
