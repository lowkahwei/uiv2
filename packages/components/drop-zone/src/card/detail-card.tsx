import type {DropZoneCardRenderProps} from "./types";

import {FileCardIcon, RemoveIcon} from "../drop-zone-icons";

import {DROP_ZONE_CARD_LABELS} from "./constants";

export function DetailCard({
  hideIcon,
  icon,
  uploadedFile,
  removeUploadedFile,
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
  | "removeUploadedFile"
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
  return (
    <div {...getDetailCardProps()}>
      <button
        {...getClearButtonProps({
          "aria-label": DROP_ZONE_CARD_LABELS.removeUploadedFile,
          type: "button",
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
        <div {...getFileNameProps()}>{uploadedFile?.name}</div>
        <div {...getFileMetaProps()}>
          {uploadedFileSize ? <span>{uploadedFileSize}</span> : null}
        </div>
      </div>
    </div>
  );
}
