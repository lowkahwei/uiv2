import type {UseDrawerProps} from "./use-drawer";

import {forwardRef} from "@sytechui/system";
import {Modal} from "@sytechui/modal";

import {DrawerProvider} from "./drawer-context";
import {useDrawer} from "./use-drawer";

export interface DrawerProps extends UseDrawerProps {
  children: React.ReactNode;
}

const Drawer = forwardRef<"div", DrawerProps>(({children, ...props}, ref) => {
  const {domRef, drawerContext, getModalProps} = useDrawer({...props, ref});

  return (
    <DrawerProvider value={drawerContext}>
      <Modal ref={domRef} {...getModalProps()}>
        {children}
      </Modal>
    </DrawerProvider>
  );
});

Drawer.displayName = "HeroUI.Drawer";

export default Drawer;
