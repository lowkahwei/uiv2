import type {UploadCardProps} from "../types";

import {AnimatePresence, m} from "framer-motion";

import {DetailCard} from "./detail-card";
import {IdleCard} from "./idle-card";

export function UploadCard({
  disableAnimation,
  hideIcon,
  icon,
  state,
  title,
  clearUploadedFiles,
  uploadedFileSize,
  uploadedFileType,
  getUploadCardWrapperProps,
  getUploadCardProps,
  getUploadCardOverlayProps,
  getUploadedContentProps,
  getIdleContentProps,
  getIdleCardProps,
  getIdleLabelProps,
  getDetailCardProps,
  getClearButtonProps,
  getClearButtonIconProps,
  getFileIconWrapperProps,
  getFileIconProps,
  getFileTypeBadgeProps,
  getFileInfoProps,
  getFileNameProps,
  getFileMetaProps,
  getIconProps,
  getIconWrapperProps,
}: UploadCardProps) {
  const uploadedWidth = 512;
  const dropTargetSize = 90;
  const idleSize = 80;
  const uploadCardWrapperProps = getUploadCardWrapperProps();
  const uploadCardProps = getUploadCardProps();
  const uploadCardOverlayProps = getUploadCardOverlayProps();
  const uploadedContentProps = getUploadedContentProps();
  const idleContentProps = getIdleContentProps();
  const uploadedContent = (
    <DetailCard
      fileName={state.uploadedFile?.name}
      fileSize={uploadedFileSize}
      fileType={uploadedFileType}
      getClearButtonIconProps={getClearButtonIconProps}
      getClearButtonProps={getClearButtonProps}
      getDetailCardProps={getDetailCardProps}
      getFileIconProps={getFileIconProps}
      getFileIconWrapperProps={getFileIconWrapperProps}
      getFileInfoProps={getFileInfoProps}
      getFileMetaProps={getFileMetaProps}
      getFileNameProps={getFileNameProps}
      getFileTypeBadgeProps={getFileTypeBadgeProps}
      hideIcon={hideIcon}
      icon={icon}
      uploadedFilesCount={state.uploadedFilesCount}
      onClear={clearUploadedFiles}
    />
  );
  const idleContent = (
    <IdleCard
      getIconProps={getIconProps}
      getIconWrapperProps={getIconWrapperProps}
      getIdleCardProps={getIdleCardProps}
      getIdleLabelProps={getIdleLabelProps}
      hideIcon={hideIcon}
      icon={icon}
      isDropTarget={state.isDropTarget}
      title={title}
    />
  );

  if (disableAnimation) {
    return (
      <div {...uploadCardWrapperProps}>
        <div
          className={uploadCardProps.className}
          data-slot={uploadCardProps["data-slot"]}
          style={{
            width: state.uploadedFile
              ? uploadedWidth
              : state.isDropTarget
                ? dropTargetSize
                : idleSize,
            height: state.uploadedFile ? 70 : state.isDropTarget ? dropTargetSize : idleSize,
            borderRadius: state.uploadedFile ? 24 : 24,
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
            ? uploadedWidth
            : state.isDropTarget
              ? dropTargetSize
              : idleSize,
          height: state.uploadedFile ? 70 : state.isDropTarget ? dropTargetSize : idleSize,
          borderRadius: state.uploadedFile ? 24 : 24,
          scale: state.isDropTarget ? 1.03 : 1,
        }}
        className={uploadCardProps.className}
        data-slot={uploadCardProps["data-slot"]}
        initial={false}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 24,
          mass: 0.9,
        }}
      >
        <div {...uploadCardOverlayProps} />
        <AnimatePresence initial={false} mode="wait">
          {state.uploadedFile ? (
            <m.div
              key="uploaded-file"
              animate={{opacity: 1, x: 0, filter: "blur(0px)"}}
              className={uploadedContentProps.className}
              data-slot={uploadedContentProps["data-slot"]}
              exit={{opacity: 0, x: -10, filter: "blur(6px)"}}
              initial={{opacity: 0, x: 10, filter: "blur(8px)"}}
              transition={{duration: 0.2, ease: [0.22, 1, 0.36, 1]}}
            >
              {uploadedContent}
            </m.div>
          ) : (
            <m.div
              key="idle-upload"
              animate={{opacity: 1, y: 0, scale: 1}}
              className={idleContentProps.className}
              data-slot={idleContentProps["data-slot"]}
              exit={{opacity: 0, y: -10, scale: 0.9}}
              initial={{opacity: 0, y: 10, scale: 0.9}}
              transition={{duration: 0.2, ease: [0.22, 1, 0.36, 1]}}
            >
              {idleContent}
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
