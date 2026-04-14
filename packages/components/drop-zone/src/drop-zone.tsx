import type {DropZoneProps} from "./types";
import type {DropZoneCardRenderProps, DropZoneCardSlotProps} from "./card/types";

import {forwardRef} from "@heroui/system";
import {AnimatePresence, LazyMotion, domAnimation, m} from "framer-motion";
import {useMemo} from "react";

import {CARD_CONTENT_TRANSITION, UPLOAD_CARD_LIST_ITEM_MOTION} from "./card/constants";
import {UploadCard} from "./card/upload-card";
import {formatFileSize, formatUploadedFileType, isLikelyImageFile} from "./drop-zone-utils";
import {useDropZonePreviews} from "./hooks/use-drop-zone-previews";
import {useDropZone} from "./use-drop-zone";

export type {DropZoneProps} from "./types";

const DropZone = forwardRef<"div", DropZoneProps>((props, ref) => {
  const {isPreview = false, previewResolver, onPreviewError, errorMessage} = props;

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
  const previewStateByCardId = useDropZonePreviews({
    uploadCards: state.uploadCards,
    previewResolver,
    onPreviewError,
  });
  const slotProps = useMemo<DropZoneCardSlotProps>(
    () => ({
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
    }),
    [
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
    ],
  );
  const previewImageProps = getPreviewImageProps();

  const renderCard = (card: (typeof state.uploadCards)[number]) => {
    const previewState = previewStateByCardId[card.id];
    const resolvedSize = previewState?.resolvedSize;
    const effectiveSize =
      card.uploadedFile && resolvedSize !== undefined
        ? resolvedSize
        : (card.uploadedFile?.size ?? 0);
    const cardProps: DropZoneCardRenderProps = {
      disableAnimation,
      hideIcon,
      icon,
      slotProps,
      state,
      title,
      uploadedFile: card.uploadedFile,
      uploadedFileSize: card.uploadedFile ? formatFileSize(effectiveSize) : null,
      uploadedFileType: card.uploadedFile
        ? formatUploadedFileType(card.uploadedFile.type, card.uploadedFile.name)
        : "",
      removeUploadedFile: card.uploadedFile ? () => removeUploadedFile(card.id) : undefined,
      retryUpload: card.uploadedFile ? () => retryUpload(card.id) : undefined,
      uploadState: card.uploadState,
      previewError: previewState?.error,
      errorMessage,
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
  const {loadingPreviewCards, previewCards} = useMemo(() => {
    return state.uploadCards.reduce<{
      loadingPreviewCards: (typeof state.uploadCards)[number][];
      previewCards: Array<{
        card: (typeof state.uploadCards)[number];
        url: string;
      }>;
    }>(
      (acc, card) => {
        if (!card.uploadedFile || !isLikelyImageFile(card.uploadedFile)) {
          return acc;
        }

        const previewState = previewStateByCardId[card.id];

        if (previewState?.url) {
          acc.previewCards.push({card, url: previewState.url});

          return acc;
        }

        if (previewState?.isLoading) {
          acc.loadingPreviewCards.push(card);
        }

        return acc;
      },
      {
        loadingPreviewCards: [],
        previewCards: [],
      },
    );
  }, [previewStateByCardId, state.uploadCards]);

  const content =
    typeof children === "function" ? (
      children(state)
    ) : children ? (
      children
    ) : (
      <div {...getContentProps()}>
        {cards}
        {isPreview && (previewCards.length > 0 || loadingPreviewCards.length > 0) ? (
          <div {...getPreviewWrapperProps()}>
            {previewCards.map(({card, url}) => (
              <img
                key={`${card.id}-preview`}
                alt={card.uploadedFile?.name ?? "Uploaded image preview"}
                src={url}
                {...previewImageProps}
              />
            ))}
            {loadingPreviewCards.map((card) => (
              <div
                key={`${card.id}-preview-loading`}
                aria-busy="true"
                aria-label={`Loading preview for ${card.uploadedFile?.name ?? "image"}`}
                className={`${previewImageProps.className ?? ""} animate-pulse bg-default-100`}
                role="img"
                style={{minHeight: "6rem"}}
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
