import type {DropZoneProps} from "./types";

import {forwardRef} from "@heroui/system";
import {LazyMotion, domAnimation} from "framer-motion";
import {useMemo} from "react";

import {UploadCard} from "./card/upload-card";
import {DropZoneProvider} from "./drop-zone-context";
import {formatFileSize, formatUploadedFileType} from "./drop-zone-utils";
import {useDropZone} from "./use-drop-zone";

export type {DropZoneProps} from "./types";

const DropZone = forwardRef<"div", DropZoneProps>((props, ref) => {
  const {
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
  } = useDropZone({...props, ref});

  const uploadedFileType = formatUploadedFileType(
    state.uploadedFile?.type,
    state.uploadedFile?.name,
  );
  const uploadedFileSize = state.uploadedFile && formatFileSize(state.uploadedFile.size);
  const contextValue = useMemo(
    () => ({
      clearUploadedFiles,
      disableAnimation,
      getClearButtonIconProps,
      getClearButtonProps,
      getDetailCardProps,
      getFileIconProps,
      getFileIconWrapperProps,
      getFileInfoProps,
      getFileMetaProps,
      getFileNameProps,
      getFileTypeBadgeProps,
      getIconProps,
      getIconWrapperProps,
      getIdleCardProps,
      getIdleContentProps,
      getIdleLabelProps,
      getUploadCardOverlayProps,
      getUploadCardProps,
      getUploadCardWrapperProps,
      getUploadedContentProps,
      hideIcon,
      icon,
      state,
      title,
      uploadedFileSize,
      uploadedFileType,
    }),
    [
      clearUploadedFiles,
      disableAnimation,
      getClearButtonIconProps,
      getClearButtonProps,
      getDetailCardProps,
      getFileIconProps,
      getFileIconWrapperProps,
      getFileInfoProps,
      getFileMetaProps,
      getFileNameProps,
      getFileTypeBadgeProps,
      getIconProps,
      getIconWrapperProps,
      getIdleCardProps,
      getIdleContentProps,
      getIdleLabelProps,
      getUploadCardOverlayProps,
      getUploadCardProps,
      getUploadCardWrapperProps,
      getUploadedContentProps,
      hideIcon,
      icon,
      state,
      title,
      uploadedFileSize,
      uploadedFileType,
    ],
  );

  const content =
    typeof children === "function" ? (
      children(state)
    ) : children ? (
      children
    ) : (
      <DropZoneProvider value={contextValue}>
        <div {...getContentProps()}>
          {disableAnimation ? (
            <UploadCard />
          ) : (
            <LazyMotion features={domAnimation}>
              <UploadCard />
            </LazyMotion>
          )}
          {title ? <div {...getTitleProps()}>{title}</div> : null}
          {state.validationMessage ? (
            <div {...getHelperTextProps()}>{state.validationMessage}</div>
          ) : null}
        </div>
      </DropZoneProvider>
    );

  return (
    <Component {...getBaseProps()}>
      <input {...getInputProps()} />
      {content}
    </Component>
  );
});

DropZone.displayName = "HeroUI.DropZone";

export default DropZone;
