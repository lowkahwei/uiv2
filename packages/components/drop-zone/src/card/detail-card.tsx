import type {DropZoneCardRenderProps} from "./types";

import {FileCardIcon, TrashIcon} from "../drop-zone-icons";

import {DROP_ZONE_CARD_LABELS} from "./constants";

function UploadProgressBar({progress}: {progress: number}) {
  const pct = Math.round(progress * 100);

  return (
    <div
      aria-label={`${pct}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={pct}
      role="progressbar"
      style={{
        width: "100%",
        height: 4,
        borderRadius: 2,
        background: "rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: "currentColor",
          opacity: 0.6,
          transition: "width 0.15s ease",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

function getUploadErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return DROP_ZONE_CARD_LABELS.uploadFailed;
}

export function DetailCard({
  hideIcon,
  icon,
  uploadedFile,
  uploadState,
  removeUploadedFile,
  retryUpload,
  uploadedFileSize,
  uploadedFileType,
  previewError,
  previewErrorMessage,
  getDetailCardProps,
  getClearButtonProps,
  getClearButtonIconProps,
  getFileIconWrapperProps,
  getFileIconProps,
  getFileTypeBadgeProps,
  getFileInfoProps,
  getFileNameProps,
  getFileMetaProps,
}: Pick<
  DropZoneCardRenderProps,
  | "hideIcon"
  | "icon"
  | "uploadedFile"
  | "uploadState"
  | "removeUploadedFile"
  | "retryUpload"
  | "uploadedFileSize"
  | "uploadedFileType"
  | "previewError"
  | "previewErrorMessage"
  | "getDetailCardProps"
  | "getClearButtonProps"
  | "getClearButtonIconProps"
  | "getFileIconWrapperProps"
  | "getFileIconProps"
  | "getFileTypeBadgeProps"
  | "getFileInfoProps"
  | "getFileNameProps"
  | "getFileMetaProps"
>) {
  const isUploading = uploadState?.status === "uploading";
  const isUploadError = uploadState?.status === "error";
  const isError = isUploadError || previewError !== undefined;
  const isSuccess = uploadState?.status === "success";
  const displayName = (isSuccess && uploadState.result?.name) || uploadedFile?.name;
  const errorMessage = isError
    ? previewError !== undefined
      ? (previewErrorMessage ?? getUploadErrorMessage(previewError))
      : getUploadErrorMessage(uploadState?.error)
    : null;
  const clearButton = (
    <button
      {...getClearButtonProps({
        "aria-label": DROP_ZONE_CARD_LABELS.removeUploadedFile,
        className: isError ? "!static shrink-0 !translate-y-0" : undefined,
        type: "button",
        disabled: isUploading,
        onClick: (event) => {
          event.stopPropagation();
          removeUploadedFile?.();
        },
      })}
    >
      <TrashIcon {...getClearButtonIconProps()} />
    </button>
  );

  return (
    <div {...getDetailCardProps()}>
      {!isError ? clearButton : null}
      {!hideIcon && (
        <div {...getFileIconWrapperProps()}>
          {icon ? (
            <span {...getFileIconProps()}>{icon}</span>
          ) : (
            <FileCardIcon {...getFileIconProps()} />
          )}
          <span {...getFileTypeBadgeProps()}>{uploadedFileType}</span>
        </div>
      )}
      <div {...getFileInfoProps({className: isError ? "pr-28" : "pr-10"})}>
        <div {...getFileNameProps()}>{displayName}</div>
        <div
          {...getFileMetaProps({
            className: isError ? "max-w-full" : undefined,
          })}
        >
          {isUploading ? (
            <UploadProgressBar progress={uploadState.progress} />
          ) : isSuccess ? (
            <>
              <span className="font-medium text-success-600">
                {DROP_ZONE_CARD_LABELS.uploadCompleted}
              </span>
              {uploadedFileSize ? <span>{uploadedFileSize}</span> : null}
            </>
          ) : isError ? (
            <span className="max-w-full break-words text-danger-600">{errorMessage}</span>
          ) : uploadedFileSize ? (
            <span>{uploadedFileSize}</span>
          ) : null}
        </div>
      </div>
      {isError ? (
        <div className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2">
          {isUploadError ? (
            <button
              className="shrink-0 cursor-pointer text-[0.8em] opacity-70 underline underline-offset-2"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                retryUpload?.();
              }}
            >
              {DROP_ZONE_CARD_LABELS.retryUpload}
            </button>
          ) : null}
          {clearButton}
        </div>
      ) : null}
    </div>
  );
}
