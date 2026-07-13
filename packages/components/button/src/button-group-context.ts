import type {ContextType} from "./use-button-group";

import {createContext} from "@sytechui/react-utils";

export const [ButtonGroupProvider, useButtonGroupContext] = createContext<ContextType>({
  name: "ButtonGroupContext",
  strict: false,
});
