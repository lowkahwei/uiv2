import type {UseBottomBarReturn} from "./use-bottom-bar";
import type {Key} from "react";

import {createContext} from "@sytechui/react-utils";

export const [BottomBarProvider, useBottomBarContext] = createContext<UseBottomBarReturn>({
  name: "BottomBarContext",
  strict: true,
  errorMessage:
    "useBottomBarContext: `context` is undefined. Wrap BottomBarItem within <BottomBar />.",
});

export const [BottomBarItemKeyProvider, useBottomBarItemKey] = createContext<Key>({
  name: "BottomBarItemKeyContext",
  strict: true,
  errorMessage:
    "useBottomBarItemKey: `context` is undefined. Wrap BottomBarItem within <BottomBar />.",
});
