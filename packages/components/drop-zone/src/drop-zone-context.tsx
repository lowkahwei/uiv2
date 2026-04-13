import type {PropGetter} from "@heroui/system";
import type {ReactNode} from "react";
import type {DropZoneProps, DropZoneState} from "./types";

import {createContext, useContext} from "react";

export interface DropZoneContextValue {
  clearUploadedFiles: () => void;
  hideIcon: boolean;
  icon: DropZoneProps["icon"];
  state: DropZoneState;
  title: DropZoneProps["title"];
  disableAnimation: boolean;
  uploadedFileSize?: string | null;
  uploadedFileType: string;
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

const DropZoneContext = createContext<DropZoneContextValue | null>(null);

export function DropZoneProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: DropZoneContextValue;
}) {
  return <DropZoneContext.Provider value={value}>{children}</DropZoneContext.Provider>;
}

export function useDropZoneContext() {
  const context = useContext(DropZoneContext);

  if (!context) {
    throw new Error("useDropZoneContext must be used within a DropZoneProvider.");
  }

  return context;
}
