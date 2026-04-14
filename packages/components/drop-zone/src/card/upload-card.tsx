import type {DropZoneCardRenderProps} from "./types";

import {AnimatePresence, m} from "framer-motion";

import {
  CARD_CONTENT_TRANSITION,
  IDLE_CONTENT_MOTION,
  UPLOADED_CONTENT_MOTION,
  UPLOAD_CARD_DIMENSIONS,
  UPLOAD_CARD_SPRING_TRANSITION,
} from "./constants";
import {DetailCard} from "./detail-card";
import {IdleCard} from "./idle-card";

interface UploadCardProps {
  cardProps: DropZoneCardRenderProps;
  isInteractive?: boolean;
  onContentAnimationComplete?: () => void;
}

export function UploadCard({
  cardProps,
  isInteractive = false,
  onContentAnimationComplete,
}: UploadCardProps) {
  const {disableAnimation, slotProps, state, uploadedFile} = cardProps;
  const uploadCardWrapperProps = slotProps.getUploadCardWrapperProps(
    isInteractive ? slotProps.getUploadTriggerProps() : undefined,
  );
  const uploadCardProps = slotProps.getUploadCardProps();
  const uploadCardOverlayProps = slotProps.getUploadCardOverlayProps();
  const uploadedContentProps = slotProps.getUploadedContentProps();
  const idleContentProps = slotProps.getIdleContentProps();
  const uploadedContent = <DetailCard {...cardProps} />;
  const idleContent = <IdleCard {...cardProps} />;

  const cardWidth = uploadedFile
    ? UPLOAD_CARD_DIMENSIONS.uploadedWidth
    : state.isDropTarget
      ? UPLOAD_CARD_DIMENSIONS.dropTargetSize
      : UPLOAD_CARD_DIMENSIONS.idleSize;
  const cardHeight = uploadedFile
    ? UPLOAD_CARD_DIMENSIONS.uploadedHeight
    : state.isDropTarget
      ? UPLOAD_CARD_DIMENSIONS.dropTargetSize
      : UPLOAD_CARD_DIMENSIONS.idleSize;

  if (disableAnimation) {
    return (
      <div {...uploadCardWrapperProps}>
        <div
          className={uploadCardProps.className}
          data-slot={uploadCardProps["data-slot"]}
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: UPLOAD_CARD_DIMENSIONS.borderRadius,
            maxWidth: "100%",
          }}
        >
          <div {...uploadCardOverlayProps} />
          {uploadedFile ? uploadedContent : idleContent}
        </div>
      </div>
    );
  }

  return (
    <div {...uploadCardWrapperProps}>
      <m.div
        animate={{
          width: cardWidth,
          height: cardHeight,
          borderRadius: UPLOAD_CARD_DIMENSIONS.borderRadius,
          scale: !uploadedFile && state.isDropTarget ? UPLOAD_CARD_DIMENSIONS.dropTargetScale : 1,
        }}
        className={uploadCardProps.className}
        data-slot={uploadCardProps["data-slot"]}
        initial={false}
        transition={UPLOAD_CARD_SPRING_TRANSITION}
      >
        <div {...uploadCardOverlayProps} />
        <AnimatePresence initial={false} mode="wait">
          {uploadedFile ? (
            <m.div
              key={UPLOADED_CONTENT_MOTION.key}
              animate={UPLOADED_CONTENT_MOTION.animate}
              className={uploadedContentProps.className}
              data-slot={uploadedContentProps["data-slot"]}
              exit={UPLOADED_CONTENT_MOTION.exit}
              initial={UPLOADED_CONTENT_MOTION.initial}
              transition={CARD_CONTENT_TRANSITION}
              onAnimationComplete={onContentAnimationComplete}
            >
              {uploadedContent}
            </m.div>
          ) : (
            <m.div
              key={IDLE_CONTENT_MOTION.key}
              animate={IDLE_CONTENT_MOTION.animate}
              className={idleContentProps.className}
              data-slot={idleContentProps["data-slot"]}
              exit={IDLE_CONTENT_MOTION.exit}
              initial={IDLE_CONTENT_MOTION.initial}
              transition={CARD_CONTENT_TRANSITION}
              onAnimationComplete={onContentAnimationComplete}
            >
              {idleContent}
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
