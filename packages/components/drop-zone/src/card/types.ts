import type {PropGetter} from "@heroui/system";
import type {ReactNode} from "react";
import type {DropZoneProps, DropZoneState, UploadCardUploadState, UploadedFileInfo} from "../types";

export interface DropZoneCardSlotProps {
  getUploadTriggerProps: PropGetter;
  getUploadCardWrapperProps: PropGetter;
  getUploadCardProps: PropGetter;
  getUploadCardOverlayProps: PropGetter;
  getUploadedContentProps: PropGetter;
  getIdleContentProps: PropGetter;
  getIdleCardProps: PropGetter;
  getIdleLabelProps: PropGetter;
  getDetailCardProps: PropGetter;
  getClearButtonProps: PropGetter;
  getClearButtonIconProps: PropGetter;
  getFileIconWrapperProps: PropGetter;
  getFileIconProps: PropGetter;
  getFileTypeBadgeProps: PropGetter;
  getFileInfoProps: PropGetter;
  getFileNameProps: PropGetter;
  getFileMetaProps: PropGetter;
  getIconProps: PropGetter;
  getIconWrapperProps: PropGetter;
}

export interface DropZoneCardRenderProps {
  hideIcon: boolean;
  icon: DropZoneProps["icon"];
  state: DropZoneState;
  title: DropZoneProps["title"];
  disableAnimation: boolean;
  uploadedFile: UploadedFileInfo | null;
  uploadedFileSize?: string | null;
  uploadedFileType: string;
  removeUploadedFile?: () => void;
  retryUpload?: () => void;
  uploadState?: UploadCardUploadState;
  /** Error from previewResolver — causes the card to show an inline error state. */
  previewError?: unknown;
  /** Custom error message to show when previewError is set. Falls back to the error's own message. */
  previewErrorMessage?: ReactNode;
  slotProps: DropZoneCardSlotProps;
}
