import type {HTMLHeroUIProps} from "@sytechui/system";

import {forwardRef} from "@sytechui/system";
import {useDOMRef} from "@sytechui/react-utils";
import {dataAttr} from "@sytechui/shared-utils";
import {cn} from "@sytechui/theme";

import {useNavbarContext} from "./navbar-context";

export interface NavbarMenuItemProps extends HTMLHeroUIProps<"li"> {
  /**
   * Whether the item is active or not.
   * @default false
   */
  isActive?: boolean;
  children?: React.ReactNode;
}

const NavbarMenuItem = forwardRef<"li", NavbarMenuItemProps>((props, ref) => {
  const {className, children, isActive, ...otherProps} = props;

  const domRef = useDOMRef(ref);

  const {slots, isMenuOpen, classNames} = useNavbarContext();

  const styles = cn(classNames?.menuItem, className);

  return (
    <li
      ref={domRef}
      className={slots.menuItem?.({class: styles})}
      data-active={dataAttr(isActive)}
      data-open={dataAttr(isMenuOpen)}
      {...otherProps}
    >
      {children}
    </li>
  );
});

NavbarMenuItem.displayName = "HeroUI.NavbarMenuItem";

export default NavbarMenuItem;
