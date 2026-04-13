import type {UseDropZoneProps} from "./use-drop-zone";

import {forwardRef} from "@heroui/system";
import {AnimatePresence, LazyMotion, domAnimation, m} from "framer-motion";

import {UploadIcon} from "./drop-zone-icons";
import {formatFileSize, formatUploadedFileType} from "./drop-zone-utils";
import {UploadedFileCard} from "./uploaded-file-card";
import {useDropZone} from "./use-drop-zone";

export interface DropZoneProps extends UseDropZoneProps {}

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
    getIconWrapperProps,
    getIconProps,
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
          <AnimatedUploadCard
            clearUploadedFiles={clearUploadedFiles}
            disableAnimation={disableAnimation}
            getIconProps={getIconProps}
            getIconWrapperProps={getIconWrapperProps}
            hideIcon={hideIcon}
            icon={icon}
            state={state}
            title={title}
            uploadedFileSize={uploadedFileSize}
            uploadedFileType={uploadedFileType}
          />
        ) : (
          <LazyMotion features={domAnimation}>
            <AnimatedUploadCard
              clearUploadedFiles={clearUploadedFiles}
              disableAnimation={disableAnimation}
              getIconProps={getIconProps}
              getIconWrapperProps={getIconWrapperProps}
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

type AnimatedUploadCardProps = {
  clearUploadedFiles: ReturnType<typeof useDropZone>["clearUploadedFiles"];
  hideIcon: boolean;
  icon: DropZoneProps["icon"];
  state: ReturnType<typeof useDropZone>["state"];
  title: DropZoneProps["title"];
  disableAnimation: boolean;
  uploadedFileSize?: string | null;
  uploadedFileType: string;
  getIconProps: ReturnType<typeof useDropZone>["getIconProps"];
  getIconWrapperProps: ReturnType<typeof useDropZone>["getIconWrapperProps"];
};

function AnimatedUploadCard({
  disableAnimation,
  hideIcon,
  icon,
  state,
  title,
  clearUploadedFiles,
  uploadedFileSize,
  uploadedFileType,
  getIconProps,
  getIconWrapperProps,
}: AnimatedUploadCardProps) {
  const uploadedWidth = 512;
  const dropTargetSize = 90;
  const idleSize = 80;
  const containerClassName =
    "relative flex max-w-full items-center justify-center overflow-hidden border border-default-200/80 bg-content1/95 px-4 py-2 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.45)] backdrop-blur-md";
  const uploadedContent = (
    <UploadedFileCard
      fileName={state.uploadedFile?.name}
      fileSize={uploadedFileSize}
      fileType={uploadedFileType}
      hideIcon={hideIcon}
      icon={icon}
      uploadedFilesCount={state.uploadedFilesCount}
      onClear={clearUploadedFiles}
    />
  );
  const idleContent = (
    <div className="relative flex items-center justify-center">
      {!hideIcon && (
        <div
          {...getIconWrapperProps({
            className: "size-16",
          })}
        >
          {icon ?? <UploadIcon {...getIconProps({className: "size-7"})} />}
        </div>
      )}
      {hideIcon ? (
        <span className="px-4 text-small font-medium text-default-500">
          {state.isDropTarget ? "Release to upload" : title}
        </span>
      ) : null}
    </div>
  );

  if (disableAnimation) {
    return (
      <div className="flex w-full justify-center">
        <div
          className={containerClassName}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-default-100/80 via-transparent to-default-200/40 opacity-80" />
          {state.uploadedFile ? uploadedContent : idleContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
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
        className={containerClassName}
        initial={false}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 24,
          mass: 0.9,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-default-100/80 via-transparent to-default-200/40 opacity-80" />
        <AnimatePresence initial={false} mode="wait">
          {state.uploadedFile ? (
            <m.div
              key="uploaded-file"
              animate={{opacity: 1, x: 0, filter: "blur(0px)"}}
              className="w-full"
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
              className="flex w-full items-center justify-center"
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

DropZone.displayName = "HeroUI.DropZone";

export default DropZone;
