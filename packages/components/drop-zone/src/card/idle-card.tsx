import type {IdleCardProps} from "../types";

import {UploadIcon} from "../drop-zone-icons";

export function IdleCard({
  hideIcon,
  icon,
  title,
  isDropTarget,
  getIdleCardProps,
  getIdleLabelProps,
  getIconProps,
  getIconWrapperProps,
}: IdleCardProps) {
  return (
    <div {...getIdleCardProps()}>
      {!hideIcon && (
        <div {...getIconWrapperProps()}>{icon ?? <UploadIcon {...getIconProps()} />}</div>
      )}
      {hideIcon ? (
        <span {...getIdleLabelProps()}>{isDropTarget ? "Release to upload" : title}</span>
      ) : null}
    </div>
  );
}
