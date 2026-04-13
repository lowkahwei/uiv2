import type {ReactNode} from "react";

import {FileCardIcon, RemoveIcon} from "./drop-zone-icons";

type UploadedFileCardProps = {
  hideIcon: boolean;
  icon: ReactNode;
  fileName?: string;
  fileSize?: string | null;
  fileType: string;
  uploadedFilesCount: number;
  onClear: () => void;
};

export function UploadedFileCard({
  hideIcon,
  icon,
  fileName,
  fileSize,
  fileType,
  uploadedFilesCount,
  onClear,
}: UploadedFileCardProps) {
  return (
    <div className="relative flex w-full items-center gap-3 text-left">
      <button
        aria-label="Remove uploaded file"
        className="absolute right-0 top-0 z-10 flex size-7 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-danger-100 hover:text-danger"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
      >
        <RemoveIcon className="size-4" />
      </button>
      {!hideIcon && (
        <div className="relative flex size-12 shrink-0 items-center justify-center text-default-500">
          {icon ?? <FileCardIcon className="size-12 text-default-400" />}
          <span className="absolute bottom-3 left-0 rounded-full bg-foreground px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-[0.08em] text-background">
            {fileType}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-small font-semibold text-foreground">{fileName}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-tiny text-default-500">
          {fileSize ? <span>{fileSize}</span> : null}
          {uploadedFilesCount > 1 ? <span>+{uploadedFilesCount - 1} more</span> : null}
        </div>
      </div>
    </div>
  );
}
