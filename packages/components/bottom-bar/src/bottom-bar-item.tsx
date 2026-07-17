import type {UseBottomBarItemProps} from "./use-bottom-bar-item";

import {Link} from "@sytechui/link";
import {forwardRef} from "@sytechui/system";

import {useBottomBarItem} from "./use-bottom-bar-item";

export interface BottomBarItemProps extends UseBottomBarItemProps {}

const BottomBarItem = forwardRef<"a", BottomBarItemProps>((props, ref) => {
  const {children, getIconProps, getItemProps, getLabelProps, getLinkProps, renderedIcon} =
    useBottomBarItem({...props, ref});

  return (
    <li {...getItemProps()}>
      <Link {...getLinkProps()}>
        {renderedIcon != null && <span {...getIconProps()}>{renderedIcon}</span>}
        <span {...getLabelProps()}>{children}</span>
      </Link>
    </li>
  );
});

BottomBarItem.displayName = "HeroUI.BottomBarItem";

export default BottomBarItem;
