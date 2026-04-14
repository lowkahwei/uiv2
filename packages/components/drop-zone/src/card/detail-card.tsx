import type {DropZoneCardRenderProps} from "./types";

import {FileCardIcon, RemoveIcon} from "../drop-zone-icons";

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

export function DetailCard({
  hideIcon,
  icon,
  uploadedFile,
  uploadState,
  removeUploadedFile,
  retryUpload,
  uploadedFileSize,
  uploadedFileType,
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
  const isError = uploadState?.status === "error";
  const isSuccess = uploadState?.status === "success";
  const displayName = (isSuccess && uploadState.result?.name) || uploadedFile?.name;

  return (
    <div {...getDetailCardProps()}>
      <button
        {...getClearButtonProps({
          "aria-label": DROP_ZONE_CARD_LABELS.removeUploadedFile,
          type: "button",
          disabled: isUploading,
          onClick: (event) => {
            event.stopPropagation();
            removeUploadedFile?.();
          },
        })}
      >
        <RemoveIcon {...getClearButtonIconProps()} />
      </button>
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
      <div {...getFileInfoProps()}>
        <div {...getFileNameProps()}>{displayName}</div>
        <div {...getFileMetaProps()}>
          {isUploading ? (
            <UploadProgressBar progress={uploadState.progress} />
          ) : isError ? (
            <button
              style={{
                all: "unset",
                cursor: "pointer",
                fontSize: "0.75em",
                opacity: 0.7,
                textDecoration: "underline",
              }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                retryUpload?.();
              }}
            >
              {DROP_ZONE_CARD_LABELS.retryUpload}
            </button>
          ) : uploadedFileSize ? (
            <span>{uploadedFileSize}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
