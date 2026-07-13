import type {ContextType} from "./use-radio-group";

import {createContext} from "@sytechui/react-utils";

export const [RadioGroupProvider, useRadioGroupContext] = createContext<ContextType>({
  name: "RadioGroupContext",
  strict: false,
});
