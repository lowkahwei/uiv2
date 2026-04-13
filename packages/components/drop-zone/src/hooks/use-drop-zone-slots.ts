import type {PropGetter} from "@heroui/system";
import type {UseDropZoneProps} from "../types";
import type {dropZone} from "@heroui/theme";

import {cn} from "@heroui/theme";
import {useMemo} from "react";

type DropZoneSlotFns = ReturnType<typeof dropZone>;
type DropZoneSlotName = keyof DropZoneSlotFns;

function toDataSlotName(slotName: string) {
  return slotName.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}

export function useDropZoneSlots({
  slots,
  classNames,
}: {
  slots: DropZoneSlotFns;
  classNames: UseDropZoneProps["classNames"];
}) {
  return useMemo(() => {
    const createSlotPropGetter = (
      slotName: DropZoneSlotName,
      staticProps: Record<string, unknown> = {},
    ): PropGetter => {
      return (props = {}) => ({
        ...props,
        "data-slot": toDataSlotName(slotName),
        ...staticProps,
        className: slots[slotName]({
          class: cn(classNames?.[slotName], props.className),
        }),
      });
    };

    return {
      getContentProps: createSlotPropGetter("content"),
      getUploadCardWrapperProps: createSlotPropGetter("uploadCardWrapper"),
      getUploadCardProps: createSlotPropGetter("uploadCard"),
      getUploadCardOverlayProps: createSlotPropGetter("uploadCardOverlay"),
      getUploadedContentProps: createSlotPropGetter("uploadedContent"),
      getIdleContentProps: createSlotPropGetter("idleContent"),
      getIdleCardProps: createSlotPropGetter("idleCard"),
      getIdleLabelProps: createSlotPropGetter("idleLabel"),
      getIconWrapperProps: createSlotPropGetter("iconWrapper"),
      getIconProps: createSlotPropGetter("icon", {
        "aria-hidden": true,
        focusable: false,
      }),
      getDetailCardProps: createSlotPropGetter("detailCard"),
      getClearButtonProps: createSlotPropGetter("clearButton"),
      getClearButtonIconProps: createSlotPropGetter("clearButtonIcon", {
        "aria-hidden": true,
        focusable: false,
      }),
      getFileIconWrapperProps: createSlotPropGetter("fileIconWrapper"),
      getFileIconProps: createSlotPropGetter("fileIcon"),
      getFileTypeBadgeProps: createSlotPropGetter("fileTypeBadge"),
      getFileInfoProps: createSlotPropGetter("fileInfo"),
      getFileNameProps: createSlotPropGetter("fileName"),
      getFileMetaProps: createSlotPropGetter("fileMeta"),
      getTitleProps: createSlotPropGetter("title"),
      getHelperTextProps: createSlotPropGetter("helperText"),
    };
  }, [slots, classNames]);
}
