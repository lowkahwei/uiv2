import {UploadIcon} from "../drop-zone-icons";
import {useDropZoneContext} from "../drop-zone-context";

import {DROP_ZONE_CARD_LABELS} from "./constants";

export function IdleCard() {
  const {
    hideIcon,
    icon,
    title,
    state,
    getIdleCardProps,
    getIdleLabelProps,
    getIconProps,
    getIconWrapperProps,
  } = useDropZoneContext();

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
