export type {
  As,
  DOMElement,
  DOMElements,
  CapitalizedDOMElements,
  DOMAttributes,
  OmitCommonProps,
  RightJoinProps,
  MergeWithAs,
  InternalForwardRefRenderFunction,
  PropsOf,
  Merge,
  HTMLHeroUIProps,
  PropGetter,
  ExtendVariantProps,
  ExtendVariantWithSlotsProps,
  ExtendVariants,
  SharedSelection,
} from "@sytechui/system-rsc";

export {
  forwardRef,
  toIterator,
  mapPropsVariants,
  mapPropsVariantsWithCommon,
  isHeroUIEl,
  extendVariants,
} from "@sytechui/system-rsc";

export type {HeroUIProviderProps} from "./provider";
export type {ProviderContextProps} from "./provider-context";

export {HeroUIProvider} from "./provider";
export {ProviderContext, useProviderContext} from "./provider-context";

export {useLabelPlacement} from "./hooks";
