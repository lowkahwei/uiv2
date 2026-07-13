import type {ContextType} from "./use-checkbox-group";

import {createContext} from "@sytechui/react-utils";

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<ContextType>({
  name: "CheckboxGroupContext",
  strict: false,
});
