import type {DropZoneProps} from "./types";
import type {DropZoneCardRenderProps} from "./card/types";

import {forwardRef} from "@heroui/system";
import {AnimatePresence, LazyMotion, domAnimation, m} from "framer-motion";
import {useEffect, useMemo, useRef, useState} from "react";

import {CARD_CONTENT_TRANSITION, UPLOAD_CARD_LIST_ITEM_MOTION} from "./card/constants";
import {UploadCard} from "./card/upload-card";
import {formatFileSize, formatUploadedFileType} from "./drop-zone-utils";
import {useDropZone} from "./use-drop-zone";

export type {DropZoneProps} from "./types";

interface PreviewEntry {
  file?: File;
  source: "object-url" | "remote-url";
  value: string;
}

const DropZone = forwardRef<"div", DropZoneProps>((props, ref) => {
  const {isPreview = false} = props;

  const {
    Component,
    children,
    title,
    icon,
    hideIcon,
    state,
    disableAnimation,
    removeUploadedFile,
    retryUpload,
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
    getPreviewWrapperProps,
    getPreviewImageProps,
    getTitleProps,
    getHelperTextProps,
  } = useDropZone({...props, ref});
  const previewEntriesRef = useRef<Record<string, PreviewEntry>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const sharedCardProps = useMemo<
    Omit<
      DropZoneCardRenderProps,
      "uploadedFile" | "uploadedFileSize" | "uploadedFileType" | "removeUploadedFile"
    >
  >(
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

  const renderCard = (card: (typeof state.uploadCards)[number]) => {
    const cardProps: DropZoneCardRenderProps = {
      ...sharedCardProps,
      uploadedFile: card.uploadedFile,
      uploadedFileSize: card.uploadedFile ? formatFileSize(card.uploadedFile.size) : null,
      uploadedFileType: card.uploadedFile
        ? formatUploadedFileType(card.uploadedFile.type, card.uploadedFile.name)
        : "",
      removeUploadedFile: card.uploadedFile ? () => removeUploadedFile(card.id) : undefined,
      retryUpload: card.uploadedFile ? () => retryUpload(card.id) : undefined,
      uploadState: card.uploadState,
    };

    return (
      <UploadCard
        key={card.id}
        cardProps={cardProps}
        isInteractive={card.uploadedFile === null}
        onContentAnimationComplete={() =>
          handleUploadCardContentAnimationComplete(card.id, card.uploadedFile)
        }
      />
    );
  };

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

  const hasDetailCard = state.uploadCards.some((card) => card.uploadedFile !== null);
  const previewCards = state.uploadCards.filter((card) => {
    return card.uploadedFile?.type.startsWith("image/") && previewUrls[card.id];
  });

  useEffect(() => {
    const nextPreviewEntries: Record<string, PreviewEntry> = {};

    state.uploadCards.forEach((card) => {
      if (!card.uploadedFile?.type.startsWith("image/")) {
        return;
      }

      const resultUrl =
        typeof card.uploadState?.result?.url === "string" ? card.uploadState.result.url : null;

      if (resultUrl) {
        nextPreviewEntries[card.id] = {
          source: "remote-url",
          value: resultUrl,
        };

        return;
      }

      const file = card.uploadState?.file;

      if (!file?.type.startsWith("image/")) {
        return;
      }

      const previousEntry = previewEntriesRef.current[card.id];

      if (
        previousEntry?.source === "object-url" &&
        previousEntry.file === file &&
        previousEntry.value
      ) {
        nextPreviewEntries[card.id] = previousEntry;

        return;
      }

      nextPreviewEntries[card.id] = {
        file,
        source: "object-url",
        value: URL.createObjectURL(file),
      };
    });

    Object.entries(previewEntriesRef.current).forEach(([cardId, entry]) => {
      if (entry.source === "object-url" && nextPreviewEntries[cardId] !== entry) {
        URL.revokeObjectURL(entry.value);
      }
    });

    previewEntriesRef.current = nextPreviewEntries;
    setPreviewUrls(
      Object.fromEntries(
        Object.entries(nextPreviewEntries).map(([cardId, entry]) => [cardId, entry.value]),
      ),
    );
  }, [state.uploadCards]);

  useEffect(() => {
    return () => {
      Object.values(previewEntriesRef.current).forEach((entry) => {
        if (entry.source === "object-url") {
          URL.revokeObjectURL(entry.value);
        }
      });
    };
  }, []);

  const content =
    typeof children === "function" ? (
      children(state)
    ) : children ? (
      children
    ) : (
      <div {...getContentProps()}>
        {cards}
        {isPreview && previewCards.length > 0 ? (
          <div {...getPreviewWrapperProps()}>
            {previewCards.map((card) => (
              <img
                key={`${card.id}-preview`}
                alt={card.uploadedFile?.name ?? "Uploaded image preview"}
                src={previewUrls[card.id]}
                {...getPreviewImageProps()}
              />
            ))}
          </div>
        ) : null}
        {title && !hasDetailCard ? <div {...getTitleProps()}>{title}</div> : null}
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
