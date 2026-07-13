import type {HTMLHeroUIProps} from "@sytechui/system";

import {forwardRef} from "@sytechui/system";
import {useDOMRef} from "@sytechui/react-utils";
import {cn} from "@sytechui/theme";

import {useCardContext} from "./card-context";

export interface CardFooterProps extends HTMLHeroUIProps<"div"> {}

const CardFooter = forwardRef<"div", CardFooterProps>((props, ref) => {
  const {as, className, children, ...otherProps} = props;

  const Component = as || "div";
  const domRef = useDOMRef(ref);

  const {slots, classNames} = useCardContext();

  const footerStyles = cn(classNames?.footer, className);

  return (
    <Component ref={domRef} className={slots.footer?.({class: footerStyles})} {...otherProps}>
      {children}
    </Component>
  );
});

CardFooter.displayName = "HeroUI.CardFooter";

export default CardFooter;
