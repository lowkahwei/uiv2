import type {DropZoneCardRenderProps} from "./types";

import {UploadIcon} from "../drop-zone-icons";

import {DROP_ZONE_CARD_LABELS} from "./constants";

export function IdleCard({
  hideIcon,
  icon,
  title,
  state,
  getIdleCardProps,
  getIdleLabelProps,
  getIconProps,
  getIconWrapperProps,
}: Pick<
  DropZoneCardRenderProps,
  | "hideIcon"
  | "icon"
  | "title"
  | "state"
  | "getIdleCardProps"
  | "getIdleLabelProps"
  | "getIconProps"
  | "getIconWrapperProps"
>) {
  return (
    <div {...getIdleCardProps()}>
      {!hideIcon && (
        <div {...getIconWrapperProps()}>{icon ?? <UploadIcon {...getIconProps()} />}</div>
      )}
      {hideIcon ? (
        <span {...getIdleLabelProps()}>
          {state.isDropTarget ? DROP_ZONE_CARD_LABELS.releaseToUpload : title}
        </span>
      ) : null}
    </div>
  );
}
