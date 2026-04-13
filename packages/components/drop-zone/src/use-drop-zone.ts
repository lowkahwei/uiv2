import type {DropEvent, DropItem} from "@react-aria/dnd";
import type {PropGetter} from "@heroui/system";
import type {KeyboardEvent, MouseEvent} from "react";
import type {DropZoneState, UseDropZoneProps} from "./types";

import {useProviderContext, mapPropsVariants} from "@heroui/system";
import {useDOMRef, filterDOMProps} from "@heroui/react-utils";
import {dataAttr, mergeProps, objectToDeps} from "@heroui/shared-utils";
import {cn, dropZone} from "@heroui/theme";
import {useFocusRing} from "@react-aria/focus";
import {useHover} from "@react-aria/interactions";
import {useClipboard, useDrop} from "@react-aria/dnd";
import {useCallback, useMemo} from "react";

import {useDropZoneSlots} from "./hooks/use-drop-zone-slots";
import {useDropZoneState} from "./hooks/use-drop-zone-state";
import {normalizeAccept} from "./lib/file-processing";

export type {AcceptedFileType, DropZoneState, UploadedFileInfo, UseDropZoneProps} from "./types";

export function useDropZone(originalProps: UseDropZoneProps) {
  const globalContext = useProviderContext();
  const [props, variantProps] = mapPropsVariants(originalProps, dropZone.variantKeys);

  const {
    ref,
    as,
    children,
    className,
    classNames,
    autoFocus,
    title = "Drop files here",
    icon,
    hideIcon = false,
    fileList,
    defaultFileList,
    accept,
    maxFileSize,
    maxFiles = 1,
    errorMessage,
    onChange,
    onDrop,
    onRemove,
    ...otherProps
  } = props;

  const Component = as || "div";
  const domRef = useDOMRef(ref);
  const inputRef = useDOMRef<HTMLInputElement>(null);
  const shouldFilterDOMProps = typeof Component === "string";
  const isDisabled = originalProps.isDisabled ?? false;
  const isInvalid = originalProps.isInvalid ?? false;
  const disableAnimation =
    originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false;
  const acceptedFileTypes = useMemo(() => normalizeAccept(accept), [accept]);
  const {
    uploadCards,
    uploadedFiles,
    validationMessage,
    clearUploadedFiles,
    removeUploadedFile,
    handleDrop,
    handleFileChange,
  } = useDropZoneState({
    acceptedFileTypes,
    fileList,
    defaultFileList,
    maxFileSize,
    maxFiles,
    onChange,
    onDrop,
    onRemove,
  });
  const hasInvalidState = isInvalid || !!validationMessage;

  const openFileDialog = useCallback(() => {
    if (isDisabled) return;

    inputRef.current?.click();
  }, [isDisabled, inputRef]);

  const {dropProps, isDropTarget} = useDrop({
    ...otherProps,
    ref: domRef,
    isDisabled,
    onDrop: handleDrop,
  });

  const {clipboardProps} = useClipboard({
    isDisabled,
    onPaste: (items: DropItem[]) => {
      void handleDrop({
        type: "drop",
        items,
        x: 0,
        y: 0,
        dropOperation: "copy",
      } satisfies DropEvent);
    },
  });

  const {isFocused, isFocusVisible, focusProps} = useFocusRing({
    autoFocus,
  });

  const {hoverProps, isHovered} = useHover({isDisabled});

  const slots = useMemo(
    () =>
      dropZone({
        ...variantProps,
        isDisabled,
        isInvalid: hasInvalidState,
        disableAnimation,
        className,
      }),
    [objectToDeps(variantProps), isDisabled, hasInvalidState, disableAnimation, className],
  );
  const slotProps = useDropZoneSlots({slots, classNames});

  const state = useMemo<DropZoneState>(
    () => ({
      isDropTarget,
      isFocused,
      isFocusVisible,
      isHovered,
      isDisabled,
      isInvalid: hasInvalidState,
      validationMessage: validationMessage ?? (isInvalid ? (errorMessage ?? null) : null),
      uploadCards,
      uploadedFiles,
      uploadedFile: uploadedFiles[0] ?? null,
      uploadedFilesCount: uploadedFiles.length,
    }),
    [
      isDropTarget,
      isFocused,
      isFocusVisible,
      isHovered,
      isDisabled,
      hasInvalidState,
      isInvalid,
      validationMessage,
      errorMessage,
      uploadCards,
      uploadedFiles,
    ],
  );

  const getBaseProps: PropGetter = useCallback(
    (props = {}) => {
      const domProps = filterDOMProps(otherProps, {enabled: shouldFilterDOMProps});
      const mergedProps = mergeProps(domProps, dropProps, props);

      return {
        ...mergedProps,
        ref: domRef,
        "data-slot": "base",
        "data-disabled": dataAttr(isDisabled),
        "data-invalid": dataAttr(hasInvalidState),
        "data-hover": dataAttr(isHovered),
        "data-focus": dataAttr(isFocused),
        "data-focus-visible": dataAttr(isFocusVisible),
        "data-drop-target": dataAttr(isDropTarget),
        "aria-disabled": isDisabled || undefined,
        className: slots.base({class: cn(classNames?.base, mergedProps.className)}),
      };
    },
    [
      domRef,
      otherProps,
      shouldFilterDOMProps,
      dropProps,
      isDisabled,
      hasInvalidState,
      isHovered,
      isFocused,
      isFocusVisible,
      isDropTarget,
      slots,
      classNames?.base,
    ],
  );

  const getUploadTriggerProps: PropGetter = useCallback(
    (props = {}) => {
      const mergedProps = mergeProps(clipboardProps, hoverProps, focusProps, props);

      return {
        ...mergedProps,
        role: mergedProps.role ?? "button",
        tabIndex: mergedProps.tabIndex ?? (isDisabled ? -1 : 0),
        onClick: (event: MouseEvent<HTMLDivElement>) => {
          mergedProps.onClick?.(event);

          if (!event.defaultPrevented) {
            openFileDialog();
          }
        },
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          mergedProps.onKeyDown?.(event);

          if (event.defaultPrevented) return;

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFileDialog();
          }
        },
        "aria-disabled": isDisabled || undefined,
      };
    },
    [clipboardProps, hoverProps, focusProps, isDisabled, openFileDialog],
  );

  const getInputProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      ref: inputRef,
      type: "file",
      tabIndex: -1,
      className: "hidden",
      accept: acceptedFileTypes.length > 0 ? acceptedFileTypes.join(",") : undefined,
      disabled: isDisabled,
      multiple: maxFiles > 1,
      onChange: handleFileChange,
    }),
    [inputRef, acceptedFileTypes, isDisabled, maxFiles, handleFileChange],
  );

  return {
    Component,
    children,
    title,
    icon,
    hideIcon,
    maxFiles,
    state,
    disableAnimation,
    clearUploadedFiles,
    removeUploadedFile,
    getBaseProps,
    getUploadTriggerProps,
    getInputProps,
    ...slotProps,
  };
}

export type UseDropZoneReturn = ReturnType<typeof useDropZone>;
