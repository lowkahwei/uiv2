import type {DetailCardProps} from "../types";

import {FileCardIcon, RemoveIcon} from "../drop-zone-icons";

export function DetailCard({
  fileName,
  fileSize,
  fileType,
  hideIcon,
  icon,
  uploadedFilesCount,
  onClear,
  getDetailCardProps,
  getClearButtonProps,
  getClearButtonIconProps,
  getFileIconWrapperProps,
  getFileIconProps,
  getFileTypeBadgeProps,
  getFileInfoProps,
  getFileNameProps,
  getFileMetaProps,
}: DetailCardProps) {
  return (
    <div {...getDetailCardProps()}>
      <button
        {...getClearButtonProps({
          "aria-label": "Remove uploaded file",
          type: "button",
          onClick: (event) => {
            event.stopPropagation();
            onClear();
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
          <span {...getFileTypeBadgeProps()}>{fileType}</span>
        </div>
      )}
      <div {...getFileInfoProps()}>
        <div {...getFileNameProps()}>{fileName}</div>
        <div {...getFileMetaProps()}>
          {fileSize ? <span>{fileSize}</span> : null}
          {uploadedFilesCount > 1 ? <span>+{uploadedFilesCount - 1} more</span> : null}
        </div>
      </div>
    </div>
  );
}
