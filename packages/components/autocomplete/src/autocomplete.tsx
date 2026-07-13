import type {ForwardedRef, ReactElement} from "react";
import type {UseAutocompleteProps} from "./use-autocomplete";

import {forwardRef} from "@sytechui/system";
import {FreeSoloPopover} from "@sytechui/popover";
import {ScrollShadow} from "@sytechui/scroll-shadow";
import {ChevronDownIcon, CloseIcon} from "@sytechui/shared-icons";
import {Listbox} from "@sytechui/listbox";
import {Button} from "@sytechui/button";
import {Input} from "@sytechui/input";
import {AnimatePresence} from "framer-motion";

import {useAutocomplete} from "./use-autocomplete";

interface Props<T> extends UseAutocompleteProps<T> {}

export type AutocompleteProps<T extends object = object> = Props<T>;

const Autocomplete = forwardRef(function Autocomplete<T extends object>(
  props: AutocompleteProps<T>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const {
    Component,
    isOpen,
    disableAnimation,
    selectorIcon = <ChevronDownIcon />,
    clearIcon = <CloseIcon />,
    endContent,
    getBaseProps,
    getSelectorButtonProps,
    getInputProps,
    getListBoxProps,
    getPopoverProps,
    getEmptyPopoverProps,
    getClearButtonProps,
    getListBoxWrapperProps,
    getEndContentWrapperProps,
  } = useAutocomplete<T>({...props, ref});

  const listboxProps = getListBoxProps();

  const popoverContent = isOpen ? (
    <FreeSoloPopover {...getPopoverProps()}>
      <ScrollShadow {...getListBoxWrapperProps()}>
        <Listbox {...listboxProps} />
      </ScrollShadow>
    </FreeSoloPopover>
  ) : listboxProps.state?.collection.size === 0 ? (
    <div {...getEmptyPopoverProps()} />
  ) : null;

  return (
    <Component {...getBaseProps()}>
      <Input
        {...getInputProps()}
        endContent={
          <div {...getEndContentWrapperProps()}>
            {endContent || <Button {...getClearButtonProps()}>{clearIcon}</Button>}
            {selectorIcon && <Button {...getSelectorButtonProps()}>{selectorIcon}</Button>}
          </div>
        }
      />
      {disableAnimation ? popoverContent : <AnimatePresence>{popoverContent}</AnimatePresence>}
    </Component>
  );
}) as <T extends object>(props: AutocompleteProps<T>) => ReactElement;

export default Autocomplete;
