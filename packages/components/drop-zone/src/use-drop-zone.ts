import type {DropEvent, DropItem} from "@react-aria/dnd";
import type {PropGetter} from "@heroui/system";
import type {ChangeEvent, MouseEvent, ReactNode} from "react";
import type {AcceptedFileType, DropZoneState, UploadedFileInfo, UseDropZoneProps} from "./types";

import {useProviderContext, mapPropsVariants} from "@heroui/system";
import {useDOMRef, filterDOMProps} from "@heroui/react-utils";
import {dataAttr, mergeProps, objectToDeps} from "@heroui/shared-utils";
import {cn, dropZone} from "@heroui/theme";
import {useFocusRing} from "@react-aria/focus";
import {useHover} from "@react-aria/interactions";
import {useClipboard, useDrop} from "@react-aria/dnd";
import {useCallback, useMemo, useState} from "react";

export type {AcceptedFileType, DropZoneState, UploadedFileInfo, UseDropZoneProps} from "./types";

async function getUploadedFiles(items: DropItem[]) {
  const uploadedFiles = await Promise.all(
    items
      .filter((item): item is Extract<DropItem, {kind: "file"}> => item.kind === "file")
      .map(async (item) => {
        const file = await item.getFile();

        return {
          name: file.name,
          size: file.size,
          type: file.type,
        } satisfies UploadedFileInfo;
      }),
  );

  return uploadedFiles;
}

function normalizeAccept(accept?: AcceptedFileType) {
  if (!accept) return [];

  const values = Array.isArray(accept) ? accept : accept.split(",");

  return values.map((value) => value.trim()).filter(Boolean);
}

function matchesAcceptedFileType(file: File, acceptedFileTypes: string[]) {
  if (acceptedFileTypes.length === 0) return true;

  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return acceptedFileTypes.some((acceptedType) => {
    const normalizedType = acceptedType.toLowerCase();

    if (normalizedType.startsWith(".")) {
      return fileName.endsWith(normalizedType);
    }

    if (normalizedType.endsWith("/*")) {
      const mimeGroup = normalizedType.slice(0, -1);

      return mimeType.startsWith(mimeGroup);
    }

    return mimeType === normalizedType;
  });
}

function filterAcceptedFiles(
  files: File[],
  acceptedFileTypes: string[],
  maxFileSize?: number,
  maxFiles = 1,
) {
  return files
    .filter((file) => matchesAcceptedFileType(file, acceptedFileTypes))
    .filter((file) => (typeof maxFileSize === "number" ? file.size <= maxFileSize : true))
    .slice(0, Math.max(maxFiles, 0));
}

function formatAcceptedFileTypesLabel(acceptedFileTypes: string[]) {
  if (acceptedFileTypes.length === 0) return "allowed file types";

  return acceptedFileTypes
    .map((type) => {
      const normalizedType = type.trim();

      if (normalizedType.startsWith(".")) {
        return normalizedType.slice(1).toUpperCase();
      }

      if (normalizedType.endsWith("/*")) {
        return `${normalizedType.slice(0, -2).toUpperCase()} files`;
      }

      return normalizedType.split("/").at(-1)?.split("+").at(0)?.toUpperCase() || normalizedType;
    })
    .join(", ");
}

function getValidationMessage(
  files: File[],
  acceptedFileTypes: string[],
  maxFileSize?: number,
  maxFiles = 1,
) {
  if (files.length > maxFiles) {
    return `You can upload up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`;
  }

  const invalidTypeFile = files.find((file) => !matchesAcceptedFileType(file, acceptedFileTypes));

  if (invalidTypeFile) {
    return `Only ${formatAcceptedFileTypesLabel(acceptedFileTypes)} are allowed.`;
  }

  if (typeof maxFileSize === "number") {
    const oversizedFile = files.find((file) => file.size > maxFileSize);

    if (oversizedFile) {
      return `Each file must be ${Math.round(maxFileSize / (1024 * 1024))} MB or smaller.`;
    }
  }

  return null;
}

function createDropItemsFromFiles(files: FileList | File[]): DropItem[] {
  return Array.from(files).map((file) => ({
    kind: "file" as const,
    type: file.type,
    name: file.name,
    getFile: async () => file,
    getText: async () => file.text(),
  }));
}

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
    accept,
    maxFileSize,
    maxFiles = 1,
    errorMessage,
    onDrop,
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [validationMessage, setValidationMessage] = useState<ReactNode>(null);
  const acceptedFileTypes = useMemo(() => normalizeAccept(accept), [accept]);
  const hasInvalidState = isInvalid || !!validationMessage;

  const setUploadedFilesFromList = useCallback((files: FileList | File[]) => {
    const nextUploadedFiles = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setUploadedFiles(nextUploadedFiles);
  }, []);

  const handleDrop = useCallback(
    async (event: DropEvent) => {
      const droppedItems = event.items.filter(
        (item): item is Extract<DropItem, {kind: "file"}> => item.kind === "file",
      );
      const droppedFiles = await Promise.all(droppedItems.map((item) => item.getFile()));
      const nextValidationMessage = getValidationMessage(
        droppedFiles,
        acceptedFileTypes,
        maxFileSize,
        maxFiles,
      );
      const acceptedDropItems = droppedItems.filter((item, index) => {
        const file = droppedFiles[index];

        return filterAcceptedFiles([file], acceptedFileTypes, maxFileSize, 1).length > 0;
      });
      const acceptedFiles = filterAcceptedFiles(
        droppedFiles,
        acceptedFileTypes,
        maxFileSize,
        maxFiles,
      );
      const limitedAcceptedDropItems = acceptedDropItems.slice(0, acceptedFiles.length);
      const nextUploadedFiles = await getUploadedFiles(limitedAcceptedDropItems);

      setUploadedFiles(nextUploadedFiles);
      setValidationMessage(nextValidationMessage);

      onDrop?.({
        ...event,
        items: limitedAcceptedDropItems,
      });
    },
    [acceptedFileTypes, maxFileSize, maxFiles, onDrop],
  );

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files?.length) return;

      const nextFiles = Array.from(files);
      const nextValidationMessage = getValidationMessage(
        nextFiles,
        acceptedFileTypes,
        maxFileSize,
        maxFiles,
      );
      const acceptedFiles = filterAcceptedFiles(
        nextFiles,
        acceptedFileTypes,
        maxFileSize,
        maxFiles,
      );

      setUploadedFilesFromList(acceptedFiles);
      setValidationMessage(nextValidationMessage);
      onDrop?.({
        type: "drop",
        items: createDropItemsFromFiles(acceptedFiles),
        x: 0,
        y: 0,
        dropOperation: "copy",
      } satisfies DropEvent);
      event.target.value = "";
    },
    [acceptedFileTypes, maxFileSize, maxFiles, onDrop, setUploadedFilesFromList],
  );

  const openFileDialog = useCallback(() => {
    if (isDisabled) return;

    inputRef.current?.click();
  }, [isDisabled, inputRef]);

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
    setValidationMessage(null);
  }, []);

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

  const state = useMemo<DropZoneState>(
    () => ({
      isDropTarget,
      isFocused,
      isFocusVisible,
      isHovered,
      isDisabled,
      isInvalid: hasInvalidState,
      validationMessage: validationMessage ?? (isInvalid ? (errorMessage ?? null) : null),
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
      uploadedFiles,
    ],
  );

  const getBaseProps: PropGetter = useCallback(
    (props = {}) => {
      const domProps = filterDOMProps(otherProps, {enabled: shouldFilterDOMProps});
      const mergedProps = mergeProps(
        domProps,
        dropProps,
        clipboardProps,
        hoverProps,
        focusProps,
        props,
      );

      return {
        ...mergedProps,
        ref: domRef,
        role: mergedProps.role ?? "button",
        tabIndex: mergedProps.tabIndex ?? (isDisabled ? -1 : 0),
        onClick: (event: MouseEvent<HTMLDivElement>) => {
          mergedProps.onClick?.(event);

          if (!event.defaultPrevented) {
            openFileDialog();
          }
        },
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
      clipboardProps,
      hoverProps,
      focusProps,
      isDisabled,
      hasInvalidState,
      isHovered,
      isFocused,
      isFocusVisible,
      isDropTarget,
      slots,
      classNames?.base,
      openFileDialog,
    ],
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

  const getContentProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "content",
      className: slots.content({class: cn(classNames?.content, props.className)}),
    }),
    [slots, classNames?.content],
  );

  const getUploadCardWrapperProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "upload-card-wrapper",
      className: slots.uploadCardWrapper({
        class: cn(classNames?.uploadCardWrapper, props.className),
      }),
    }),
    [slots, classNames?.uploadCardWrapper],
  );

  const getUploadCardProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "upload-card",
      className: slots.uploadCard({class: cn(classNames?.uploadCard, props.className)}),
    }),
    [slots, classNames?.uploadCard],
  );

  const getUploadCardOverlayProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "upload-card-overlay",
      className: slots.uploadCardOverlay({
        class: cn(classNames?.uploadCardOverlay, props.className),
      }),
    }),
    [slots, classNames?.uploadCardOverlay],
  );

  const getUploadedContentProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "uploaded-content",
      className: slots.uploadedContent({class: cn(classNames?.uploadedContent, props.className)}),
    }),
    [slots, classNames?.uploadedContent],
  );

  const getIdleContentProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "idle-content",
      className: slots.idleContent({class: cn(classNames?.idleContent, props.className)}),
    }),
    [slots, classNames?.idleContent],
  );

  const getIdleCardProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "idle-card",
      className: slots.idleCard({class: cn(classNames?.idleCard, props.className)}),
    }),
    [slots, classNames?.idleCard],
  );

  const getIdleLabelProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "idle-label",
      className: slots.idleLabel({class: cn(classNames?.idleLabel, props.className)}),
    }),
    [slots, classNames?.idleLabel],
  );

  const getIconWrapperProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "icon-wrapper",
      className: slots.iconWrapper({class: cn(classNames?.iconWrapper, props.className)}),
    }),
    [slots, classNames?.iconWrapper],
  );

  const getIconProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "icon",
      "aria-hidden": true,
      focusable: false,
      className: slots.icon({class: cn(classNames?.icon, props.className)}),
    }),
    [slots, classNames?.icon],
  );

  const getDetailCardProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "detail-card",
      className: slots.detailCard({class: cn(classNames?.detailCard, props.className)}),
    }),
    [slots, classNames?.detailCard],
  );

  const getClearButtonProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "clear-button",
      className: slots.clearButton({class: cn(classNames?.clearButton, props.className)}),
    }),
    [slots, classNames?.clearButton],
  );

  const getClearButtonIconProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "clear-button-icon",
      "aria-hidden": true,
      focusable: false,
      className: slots.clearButtonIcon({class: cn(classNames?.clearButtonIcon, props.className)}),
    }),
    [slots, classNames?.clearButtonIcon],
  );

  const getFileIconWrapperProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "file-icon-wrapper",
      className: slots.fileIconWrapper({class: cn(classNames?.fileIconWrapper, props.className)}),
    }),
    [slots, classNames?.fileIconWrapper],
  );

  const getFileIconProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "file-icon",
      className: slots.fileIcon({class: cn(classNames?.fileIcon, props.className)}),
    }),
    [slots, classNames?.fileIcon],
  );

  const getFileTypeBadgeProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "file-type-badge",
      className: slots.fileTypeBadge({class: cn(classNames?.fileTypeBadge, props.className)}),
    }),
    [slots, classNames?.fileTypeBadge],
  );

  const getFileInfoProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "file-info",
      className: slots.fileInfo({class: cn(classNames?.fileInfo, props.className)}),
    }),
    [slots, classNames?.fileInfo],
  );

  const getFileNameProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "file-name",
      className: slots.fileName({class: cn(classNames?.fileName, props.className)}),
    }),
    [slots, classNames?.fileName],
  );

  const getFileMetaProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "file-meta",
      className: slots.fileMeta({class: cn(classNames?.fileMeta, props.className)}),
    }),
    [slots, classNames?.fileMeta],
  );

  const getTitleProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "title",
      className: slots.title({class: cn(classNames?.title, props.className)}),
    }),
    [slots, classNames?.title],
  );

  const getHelperTextProps: PropGetter = useCallback(
    (props = {}) => ({
      ...props,
      "data-slot": "helper-text",
      className: slots.helperText({class: cn(classNames?.helperText, props.className)}),
    }),
    [slots, classNames?.helperText],
  );

  return {
    Component,
    children,
    title,
    icon,
    hideIcon,
    state,
    disableAnimation,
    clearUploadedFiles,
    getBaseProps,
    getInputProps,
    getContentProps,
    getUploadCardWrapperProps,
    getUploadCardProps,
    getUploadCardOverlayProps,
    getUploadedContentProps,
    getIdleContentProps,
    getIdleCardProps,
    getIdleLabelProps,
    getIconWrapperProps,
    getIconProps,
    getDetailCardProps,
    getClearButtonProps,
    getClearButtonIconProps,
    getFileIconWrapperProps,
    getFileIconProps,
    getFileTypeBadgeProps,
    getFileInfoProps,
    getFileNameProps,
    getFileMetaProps,
    getTitleProps,
    getHelperTextProps,
  };
}

export type UseDropZoneReturn = ReturnType<typeof useDropZone>;
