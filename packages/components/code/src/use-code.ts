import type {CodeVariantProps} from "@sytechui/theme";
import type {HTMLHeroUIProps, PropGetter} from "@sytechui/system-rsc";
import type {ReactRef} from "@sytechui/react-utils";

import {code} from "@sytechui/theme";
import {mapPropsVariants} from "@sytechui/system-rsc";
import {useMemo} from "react";
import {objectToDeps} from "@sytechui/shared-utils";

export interface UseCodeProps extends HTMLHeroUIProps<"code">, CodeVariantProps {
  /**
   * Ref to the DOM node.
   */
  ref?: ReactRef<HTMLElement | null>;
}

export function useCode(originalProps: UseCodeProps) {
  const [props, variantProps] = mapPropsVariants(originalProps, code.variantKeys);

  const {as, children, className, ...otherProps} = props;

  const Component = as || "code";

  const styles = useMemo(
    () =>
      code({
        ...variantProps,
        className,
      }),
    [objectToDeps(variantProps), className],
  );

  const getCodeProps: PropGetter = () => {
    return {
      className: styles,
      ...otherProps,
    };
  };

  return {Component, children, getCodeProps};
}

export type UseCodeReturn = ReturnType<typeof useCode>;
