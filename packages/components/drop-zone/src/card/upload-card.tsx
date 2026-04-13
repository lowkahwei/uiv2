import {AnimatePresence, m} from "framer-motion";

import {useDropZoneContext} from "../drop-zone-context";

import {
  CARD_CONTENT_TRANSITION,
  IDLE_CONTENT_MOTION,
  UPLOADED_CONTENT_MOTION,
  UPLOAD_CARD_DIMENSIONS,
  UPLOAD_CARD_SPRING_TRANSITION,
} from "./constants";
import {DetailCard} from "./detail-card";
import {IdleCard} from "./idle-card";

export function UploadCard() {
  const {
    disableAnimation,
    state,
    getUploadCardWrapperProps,
    getUploadCardProps,
    getUploadCardOverlayProps,
    getUploadedContentProps,
    getIdleContentProps,
  } = useDropZoneContext();
  const uploadCardWrapperProps = getUploadCardWrapperProps();
  const uploadCardProps = getUploadCardProps();
  const uploadCardOverlayProps = getUploadCardOverlayProps();
  const uploadedContentProps = getUploadedContentProps();
  const idleContentProps = getIdleContentProps();
  const uploadedContent = <DetailCard />;
  const idleContent = <IdleCard />;

  if (disableAnimation) {
    return (
      <div {...uploadCardWrapperProps}>
        <div
          className={uploadCardProps.className}
          data-slot={uploadCardProps["data-slot"]}
          style={{
            width: state.uploadedFile
              ? UPLOAD_CARD_DIMENSIONS.uploadedWidth
              : state.isDropTarget
                ? UPLOAD_CARD_DIMENSIONS.dropTargetSize
                : UPLOAD_CARD_DIMENSIONS.idleSize,
            height: state.uploadedFile
              ? UPLOAD_CARD_DIMENSIONS.uploadedHeight
              : state.isDropTarget
                ? UPLOAD_CARD_DIMENSIONS.dropTargetSize
                : UPLOAD_CARD_DIMENSIONS.idleSize,
            borderRadius: UPLOAD_CARD_DIMENSIONS.borderRadius,
            maxWidth: "100%",
          }}
        >
          <div {...uploadCardOverlayProps} />
          {state.uploadedFile ? uploadedContent : idleContent}
        </div>
      </div>
    );
  }

  return (
    <div {...uploadCardWrapperProps}>
      <m.div
        animate={{
          width: state.uploadedFile
            ? UPLOAD_CARD_DIMENSIONS.uploadedWidth
            : state.isDropTarget
              ? UPLOAD_CARD_DIMENSIONS.dropTargetSize
              : UPLOAD_CARD_DIMENSIONS.idleSize,
          height: state.uploadedFile
            ? UPLOAD_CARD_DIMENSIONS.uploadedHeight
            : state.isDropTarget
              ? UPLOAD_CARD_DIMENSIONS.dropTargetSize
              : UPLOAD_CARD_DIMENSIONS.idleSize,
          borderRadius: UPLOAD_CARD_DIMENSIONS.borderRadius,
          scale: state.isDropTarget ? UPLOAD_CARD_DIMENSIONS.dropTargetScale : 1,
        }}
        className={uploadCardProps.className}
        data-slot={uploadCardProps["data-slot"]}
        initial={false}
        transition={UPLOAD_CARD_SPRING_TRANSITION}
      >
        <div {...uploadCardOverlayProps} />
        <AnimatePresence initial={false} mode="wait">
          {state.uploadedFile ? (
            <m.div
              key={UPLOADED_CONTENT_MOTION.key}
              animate={UPLOADED_CONTENT_MOTION.animate}
              className={uploadedContentProps.className}
              data-slot={uploadedContentProps["data-slot"]}
              exit={UPLOADED_CONTENT_MOTION.exit}
              initial={UPLOADED_CONTENT_MOTION.initial}
              transition={CARD_CONTENT_TRANSITION}
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
            >
              {idleContent}
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
