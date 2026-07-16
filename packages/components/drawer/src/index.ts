import type {
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from "@sytechui/modal";

import {ModalHeader, ModalBody, ModalFooter} from "@sytechui/modal";

import Drawer from "./drawer";
import DrawerContent from "./drawer-content";

// export types
export type {DrawerProps} from "./drawer";
export type {DrawerMotionDuration} from "./use-drawer";
export type {
  ModalContentProps as DrawerContentProps,
  ModalHeaderProps as DrawerHeaderProps,
  ModalBodyProps as DrawerBodyProps,
  ModalFooterProps as DrawerFooterProps,
};

// export hooks
export {useDrawer} from "./use-drawer";

// export component
export {Drawer};

// export subcomponents
export {
  ModalHeader as DrawerHeader,
  ModalBody as DrawerBody,
  ModalFooter as DrawerFooter,
  DrawerContent,
};
