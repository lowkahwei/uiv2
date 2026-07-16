import type {ModalContentProps} from "@sytechui/modal";
import type {ReactNode} from "react";

import {ModalContent} from "@sytechui/modal";

import {useDrawerContext} from "./drawer-context";
import {useDrawerSwipe} from "./use-drawer-swipe";

interface DrawerContentInnerProps {
  children: ModalContentProps["children"];
  onClose: () => void;
}

const DrawerContentInner = ({children, onClose}: DrawerContentInnerProps) => {
  const {placement, showSwipeHandle, slots} = useDrawerContext();
  const swipeProps = useDrawerSwipe({onClose, placement});

  return (
    <>
      {showSwipeHandle && (
        <div
          aria-hidden="true"
          className={slots.swipeHandle()}
          data-slot="drawer-swipe-handle"
          {...swipeProps}
        >
          <div className={slots.swipeHandleBar()} />
        </div>
      )}
      {typeof children === "function" ? children(onClose) : (children as ReactNode)}
    </>
  );
};

const DrawerContent = ({children, ...props}: ModalContentProps) => {
  return (
    <ModalContent {...props}>
      {(onClose) => <DrawerContentInner onClose={onClose}>{children}</DrawerContentInner>}
    </ModalContent>
  );
};

DrawerContent.displayName = "HeroUI.DrawerContent";

export default DrawerContent;
