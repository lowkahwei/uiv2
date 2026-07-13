import type {DropEvent, DropItem} from "@react-aria/dnd";
import type {PropGetter} from "@sytechui/system";
import type {DropZoneState, UseDropZoneProps} from "./types";

import {useProviderContext, mapPropsVariants} from "@sytechui/system";
import {useDOMRef, filterDOMProps} from "@sytechui/react-utils";
import {useAriaButton} from "@sytechui/use-aria-button";
import {dataAttr, mergeProps, objectToDeps} from "@sytechui/shared-utils";
import {cn, dropZone} from "@sytechui/theme";
import {useFocusRing} from "@react-aria/focus";
import {useHover} from "@react-aria/interactions";
import {useClipboard, useDrop} from "@react-aria/dnd";
import {useCallback, useMemo} from "react";

import {useDropZoneSlots} from "./hooks/use-drop-zone-slots";
import {useDropZoneState} from "./hooks/use-drop-zone-state";
import {isLikelyImageFile} from "./drop-zone-utils";
import {normalizeAccept} from "./lib/file-processing";

export type {
  AcceptedFileType,
  DropZoneErrorContext,
  DropZoneErrorMessages,
  DropZoneState,
  UploadedFileInfo,
  UseDropZoneProps,
} from "./types";

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
    isPreview = false,
    fileList,
    defaultFileList,
    accept,
    maxFileSize,
    maxFiles = 1,
    errorMessage,
    onChange,
    onDrop,
    onRemove,
    onUpload,
    onUploadSuccess,
    onUploadError,
    ...otherProps
  } = props;

  const Component = as || "div";
  const domRef = useDOMRef(ref);
  const inputRef = useDOMRef<HTMLInputElement>(null);
  const uploadTriggerRef = useDOMRef<HTMLDivElement>(null);
  const shouldFilterDOMProps = typeof Component === "string";
  const isDisabled = originalProps.isDisabled ?? false;
  const isInvalid = originalProps.isInvalid ?? false;
  const resolvedMaxFiles = isPreview ? 1 : maxFiles;
  const disableAnimation =
    originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false;
  const acceptedFileTypes = useMemo(() => normalizeAccept(accept), [accept]);
  const {
    uploadCards,
    uploadedFiles,
    validationMessage,
    clearUploadedFiles,
    removeUploadedFile,
    retryUpload,
    handleDrop,
    handleFileChange,
    handleUploadCardContentAnimationComplete,
  } = useDropZoneState({
    acceptedFileTypes,
    fileList,
    defaultFileList,
    maxFileSize,
    maxFiles: resolvedMaxFiles,
    disableAnimation,
    errorMessage,
    onChange,
    onDrop,
    onRemove,
    onUpload,
    onUploadSuccess,
    onUploadError,
  });
  const hasUploadError = uploadCards.some((card) => card.uploadState?.status === "error");
  const hasInvalidState = isInvalid || hasUploadError || !!validationMessage;
  const hasPreviewImage = isPreview && uploadedFiles.some(isLikelyImageFile);

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
  const {buttonProps: uploadTriggerButtonProps} = useAriaButton(
    {
      elementType: "div",
      isDisabled,
      onPress: openFileDialog,
    },
    uploadTriggerRef,
  );

  const slots = useMemo(
    () =>
      dropZone({
        ...variantProps,
        isDisabled,
        isInvalid: hasInvalidState,
        disableAnimation,
        hasPreviewImage,
        className,
      }),
    [
      objectToDeps(variantProps),
      isDisabled,
      hasInvalidState,
      disableAnimation,
      hasPreviewImage,
      className,
    ],
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
      validationMessage: validationMessage ?? (isInvalid ? (errorMessage?.invalid ?? null) : null),
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
      hasUploadError,
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
      const mergedProps = mergeProps(
        clipboardProps,
        uploadTriggerButtonProps,
        hoverProps,
        focusProps,
        props,
      );

      return {
        ...mergedProps,
        ref: uploadTriggerRef,
      };
    },
    [clipboardProps, uploadTriggerButtonProps, hoverProps, focusProps],
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
      multiple: resolvedMaxFiles > 1,
      onChange: handleFileChange,
    }),
    [inputRef, acceptedFileTypes, isDisabled, resolvedMaxFiles, handleFileChange],
  );

  return {
    Component,
    children,
    title,
    icon,
    hideIcon,
    maxFiles: resolvedMaxFiles,
    state,
    disableAnimation,
    clearUploadedFiles,
    removeUploadedFile,
    retryUpload,
    handleUploadCardContentAnimationComplete,
    getBaseProps,
    getUploadTriggerProps,
    getInputProps,
    ...slotProps,
  };
}

export type UseDropZoneReturn = ReturnType<typeof useDropZone>;
