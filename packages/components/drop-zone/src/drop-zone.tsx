import type {DropZoneProps} from "./types";

import {forwardRef} from "@heroui/system";
import {LazyMotion, domAnimation} from "framer-motion";

import {UploadCard} from "./card/upload-card";
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

  const content =
    typeof children === "function" ? (
      children(state)
    ) : children ? (
      children
    ) : (
      <div {...getContentProps()}>
        {disableAnimation ? (
          <UploadCard
            clearUploadedFiles={clearUploadedFiles}
            disableAnimation={disableAnimation}
            getClearButtonIconProps={getClearButtonIconProps}
            getClearButtonProps={getClearButtonProps}
            getDetailCardProps={getDetailCardProps}
            getFileIconProps={getFileIconProps}
            getFileIconWrapperProps={getFileIconWrapperProps}
            getFileInfoProps={getFileInfoProps}
            getFileMetaProps={getFileMetaProps}
            getFileNameProps={getFileNameProps}
            getFileTypeBadgeProps={getFileTypeBadgeProps}
            getIconProps={getIconProps}
            getIconWrapperProps={getIconWrapperProps}
            getIdleCardProps={getIdleCardProps}
            getIdleContentProps={getIdleContentProps}
            getIdleLabelProps={getIdleLabelProps}
            getUploadCardOverlayProps={getUploadCardOverlayProps}
            getUploadCardProps={getUploadCardProps}
            getUploadCardWrapperProps={getUploadCardWrapperProps}
            getUploadedContentProps={getUploadedContentProps}
            hideIcon={hideIcon}
            icon={icon}
            state={state}
            title={title}
            uploadedFileSize={uploadedFileSize}
            uploadedFileType={uploadedFileType}
          />
        ) : (
          <LazyMotion features={domAnimation}>
            <UploadCard
              clearUploadedFiles={clearUploadedFiles}
              disableAnimation={disableAnimation}
              getClearButtonIconProps={getClearButtonIconProps}
              getClearButtonProps={getClearButtonProps}
              getDetailCardProps={getDetailCardProps}
              getFileIconProps={getFileIconProps}
              getFileIconWrapperProps={getFileIconWrapperProps}
              getFileInfoProps={getFileInfoProps}
              getFileMetaProps={getFileMetaProps}
              getFileNameProps={getFileNameProps}
              getFileTypeBadgeProps={getFileTypeBadgeProps}
              getIconProps={getIconProps}
              getIconWrapperProps={getIconWrapperProps}
              getIdleCardProps={getIdleCardProps}
              getIdleContentProps={getIdleContentProps}
              getIdleLabelProps={getIdleLabelProps}
              getUploadCardOverlayProps={getUploadCardOverlayProps}
              getUploadCardProps={getUploadCardProps}
              getUploadCardWrapperProps={getUploadCardWrapperProps}
              getUploadedContentProps={getUploadedContentProps}
              hideIcon={hideIcon}
              icon={icon}
              state={state}
              title={title}
              uploadedFileSize={uploadedFileSize}
              uploadedFileType={uploadedFileType}
            />
          </LazyMotion>
        )}
        {title ? <div {...getTitleProps()}>{title}</div> : null}
        {state.validationMessage ? (
          <div {...getHelperTextProps()}>{state.validationMessage}</div>
        ) : null}
      </div>
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
