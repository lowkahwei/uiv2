import type {HTMLHeroUIProps} from "@sytechui/system";

import {forwardRef} from "@sytechui/system";
import {useDOMRef} from "@sytechui/react-utils";
import {cn} from "@sytechui/theme";

import {useNavbarContext} from "./navbar-context";

export interface NavbarBrandProps extends HTMLHeroUIProps<"div"> {
  children?: React.ReactNode | React.ReactNode[];
}

const NavbarBrand = forwardRef<"div", NavbarBrandProps>((props, ref) => {
  const {as, className, children, ...otherProps} = props;

  const Component = as || "div";
  const domRef = useDOMRef(ref);

  const {slots, classNames} = useNavbarContext();

  const styles = cn(classNames?.brand, className);

  return (
    <Component ref={domRef} className={slots.brand?.({class: styles})} {...otherProps}>
      {children}
    </Component>
  );
});

NavbarBrand.displayName = "HeroUI.NavbarBrand";

export default NavbarBrand;
