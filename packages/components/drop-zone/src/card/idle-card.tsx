import type {DropZoneCardRenderProps} from "./types";

import {UploadIcon} from "../drop-zone-icons";

import {DROP_ZONE_CARD_LABELS} from "./constants";

export function IdleCard({
  hideIcon,
  icon,
  slotProps,
  title,
  state,
}: Pick<DropZoneCardRenderProps, "hideIcon" | "icon" | "slotProps" | "title" | "state">) {
  return (
    <div {...slotProps.getIdleCardProps()}>
      {!hideIcon && (
        <div {...slotProps.getIconWrapperProps()}>
          {icon ?? <UploadIcon {...slotProps.getIconProps()} />}
        </div>
      )}
      {hideIcon ? (
        <span {...slotProps.getIdleLabelProps()}>
          {state.isDropTarget ? DROP_ZONE_CARD_LABELS.releaseToUpload : title}
        </span>
      ) : null}
    </div>
  );
}
