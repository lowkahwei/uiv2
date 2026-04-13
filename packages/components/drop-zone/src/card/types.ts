import type {PropGetter} from "@heroui/system";
import type {DropZoneProps, DropZoneState, UploadedFileInfo} from "../types";

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
