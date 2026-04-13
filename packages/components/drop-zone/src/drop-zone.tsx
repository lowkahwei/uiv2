import type {DropZoneProps} from "./types";

import {forwardRef} from "@heroui/system";
import {AnimatePresence, LazyMotion, domAnimation, m} from "framer-motion";
import {useMemo} from "react";

import {CARD_CONTENT_TRANSITION, UPLOAD_CARD_LIST_ITEM_MOTION} from "./card/constants";
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
    handleUploadCardContentAnimationComplete,
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

  const renderCard = (card: (typeof state.uploadCards)[number]) => (
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
      <UploadCard
        isInteractive={card.uploadedFile === null}
        onContentAnimationComplete={() =>
          handleUploadCardContentAnimationComplete(card.id, card.uploadedFile)
        }
      />
    </DropZoneProvider>
  );

  const cards = disableAnimation ? (
    <div className="flex w-full flex-col items-center gap-3">
      {state.uploadCards.map(renderCard)}
    </div>
  ) : (
    <LazyMotion features={domAnimation}>
      <m.div layout className="flex w-full flex-col items-center gap-3">
        <AnimatePresence initial={false}>
          {state.uploadCards.map((card) => (
            <m.div
              key={card.id}
              layout
              animate={UPLOAD_CARD_LIST_ITEM_MOTION.animate}
              className="w-full"
              exit={UPLOAD_CARD_LIST_ITEM_MOTION.exit}
              initial={UPLOAD_CARD_LIST_ITEM_MOTION.initial}
              transition={CARD_CONTENT_TRANSITION}
            >
              {renderCard(card)}
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>
    </LazyMotion>
  );

  const content =
    typeof children === "function" ? (
      children(state)
    ) : children ? (
      children
    ) : (
      <div {...getContentProps()}>
        {cards}
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
