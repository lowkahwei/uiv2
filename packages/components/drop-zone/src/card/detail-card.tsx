import {FileCardIcon, RemoveIcon} from "../drop-zone-icons";
import {useDropZoneContext} from "../drop-zone-context";

import {DROP_ZONE_CARD_LABELS} from "./constants";

export function DetailCard() {
  const {
    clearUploadedFiles,
    hideIcon,
    icon,
    state,
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
  } = useDropZoneContext();

  return (
    <div {...getDetailCardProps()}>
      <button
        {...getClearButtonProps({
          "aria-label": DROP_ZONE_CARD_LABELS.removeUploadedFile,
          type: "button",
          onClick: (event) => {
            event.stopPropagation();
            clearUploadedFiles();
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
        <div {...getFileNameProps()}>{state.uploadedFile?.name}</div>
        <div {...getFileMetaProps()}>
          {uploadedFileSize ? <span>{uploadedFileSize}</span> : null}
          {state.uploadedFilesCount > 1 ? <span>+{state.uploadedFilesCount - 1} more</span> : null}
        </div>
      </div>
    </div>
  );
}
