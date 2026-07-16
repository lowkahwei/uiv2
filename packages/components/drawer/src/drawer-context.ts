import type {drawer} from "@sytechui/theme";
import type {DrawerPlacement} from "./use-drawer";

import {createContext, useContext} from "react";

interface DrawerContextValue {
  placement: DrawerPlacement;
  showSwipeHandle: boolean;
  slots: ReturnType<typeof drawer>;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("DrawerContent must be used within Drawer");
  }

  return context;
}

export const DrawerProvider = DrawerContext.Provider;
