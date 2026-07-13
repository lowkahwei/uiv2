import type {HTMLHeroUIProps} from "@sytechui/system";

import {forwardRef} from "@sytechui/system";
import {useDOMRef} from "@sytechui/react-utils";
import {cn} from "@sytechui/theme";

import {useCardContext} from "./card-context";

const CardHeader = forwardRef<"div", HTMLHeroUIProps<"div">>((props, ref) => {
  const {as, className, children, ...otherProps} = props;
  const Component = as || "div";

  const domRef = useDOMRef(ref);

  const {slots, classNames} = useCardContext();

  const headerStyles = cn(classNames?.header, className);

  return (
    <Component ref={domRef} className={slots.header?.({class: headerStyles})} {...otherProps}>
      {children}
    </Component>
  );
});

CardHeader.displayName = "HeroUI.CardHeader";

export default CardHeader;
