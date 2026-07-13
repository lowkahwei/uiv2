import type {MenuProps} from "@sytechui/menu";
import type {ForwardedRef, ReactElement} from "react";

import {PopoverContent} from "@sytechui/popover";
import {FocusScope} from "@react-aria/focus";
import {forwardRef} from "@sytechui/system";
import {Menu} from "@sytechui/menu";

import {useDropdownContext} from "./dropdown-context";

interface Props<T extends object = object> extends Omit<MenuProps<T>, "menuProps"> {}

export type DropdownMenuProps<T extends object = object> = Props<T>;

const DropdownMenu = forwardRef(function DropdownMenu<T extends object>(
  props: DropdownMenuProps<T>,
  ref: ForwardedRef<HTMLUListElement>,
) {
  const {getMenuProps} = useDropdownContext();

  return (
    <PopoverContent>
      <FocusScope contain restoreFocus>
        <Menu {...getMenuProps<T>(props, ref)} />
      </FocusScope>
    </PopoverContent>
  );
}) as <T extends object>(props: DropdownMenuProps<T>) => ReactElement;

export default DropdownMenu;
