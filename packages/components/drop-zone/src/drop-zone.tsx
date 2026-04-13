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
    removeUploadedFile,
    getBaseProps,
    getInputProps,
    getUploadTriggerProps,
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

  const sharedContextValue = useMemo(
    () => ({
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
      getUploadTriggerProps,
      getUploadCardOverlayProps,
      getUploadCardProps,
      getUploadCardWrapperProps,
      getUploadedContentProps,
      hideIcon,
      icon,
      state,
      title,
    }),
    [
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
      getUploadTriggerProps,
      getUploadCardOverlayProps,
      getUploadCardProps,
      getUploadCardWrapperProps,
      getUploadedContentProps,
      hideIcon,
      icon,
      state,
      title,
    ],
  );

  const cards = (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Keep card ids stable so each UploadCard instance can animate its own idle -> uploaded transition. */}
      {state.uploadCards.map((card) => (
        <DropZoneProvider
          key={card.id}
          value={{
            ...sharedContextValue,
            uploadedFile: card.uploadedFile,
            uploadedFileSize: card.uploadedFile ? formatFileSize(card.uploadedFile.size) : null,
            uploadedFileType: card.uploadedFile
              ? formatUploadedFileType(card.uploadedFile.type, card.uploadedFile.name)
              : "",
            removeUploadedFile: card.uploadedFile ? () => removeUploadedFile(card.id) : undefined,
          }}
        >
          <UploadCard isInteractive={card.uploadedFile === null} />
        </DropZoneProvider>
      ))}
    </div>
  );

  const content =
    typeof children === "function" ? (
      children(state)
    ) : children ? (
      children
    ) : (
      <div {...getContentProps()}>
        {disableAnimation ? cards : <LazyMotion features={domAnimation}>{cards}</LazyMotion>}
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
