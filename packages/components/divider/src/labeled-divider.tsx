import type {HTMLHeroUIProps} from "@sytechui/system-rsc";
import type {LabeledDividerSlots, SlotsToClasses} from "@sytechui/theme";
import type {ReactNode} from "react";

import {forwardRef} from "@sytechui/system-rsc";
import {labeledDivider} from "@sytechui/theme";

export interface LabeledDividerProps extends HTMLHeroUIProps<"div"> {
  /**
   * Inline content displayed between the decorative lines.
   */
  children: ReactNode;
  /**
   * Class names for the component slots.
   */
  classNames?: SlotsToClasses<LabeledDividerSlots>;
}

const LabeledDivider = forwardRef<"div", LabeledDividerProps>((props, ref) => {
  const {as, children, className, classNames, ...otherProps} = props;
  const Component = as || "div";
  const slots = labeledDivider();

  return (
    <Component
      ref={ref}
      className={slots.base({class: [classNames?.base, className]})}
      data-slot="base"
      {...otherProps}
    >
      <span aria-hidden="true" className={slots.line({class: classNames?.line})} data-slot="line" />
      <span className={slots.label({class: classNames?.label})} data-slot="label">
        {children}
      </span>
      <span aria-hidden="true" className={slots.line({class: classNames?.line})} data-slot="line" />
    </Component>
  );
});

LabeledDivider.displayName = "HeroUI.LabeledDivider";

export default LabeledDivider;
