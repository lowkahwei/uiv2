import type {DropOptions} from "@react-aria/dnd";
import type {DropZoneSlots, DropZoneVariantProps, SlotsToClasses} from "@heroui/theme";
import type {HTMLHeroUIProps} from "@heroui/system";
import type {ReactRef} from "@heroui/react-utils";
import type {ReactNode} from "react";

export interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
}

export type DropZoneChangeHandler = (uploadedFiles: UploadedFileInfo[]) => void;

export type DropZoneRemoveHandler = (
  uploadedFile: UploadedFileInfo,
  uploadedFiles: UploadedFileInfo[],
) => void;

export type AcceptedFileType = string | string[];

export interface DropZoneCardState {
  id: string;
  uploadedFile: UploadedFileInfo | null;
}

export interface DropZoneState {
  isDropTarget: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  validationMessage: ReactNode;
  uploadCards: DropZoneCardState[];
  uploadedFiles: UploadedFileInfo[];
  uploadedFile: UploadedFileInfo | null;
  uploadedFilesCount: number;
}

export interface DropZoneBaseProps
  extends Omit<
    HTMLHeroUIProps<"div">,
    keyof DropZoneVariantProps | keyof DropOptions | "children" | "title" | "onChange"
  > {
  /**
   * Ref to the DOM node.
   */
  ref?: ReactRef<HTMLDivElement | null>;
  /**
   * The main heading content shown in the default HeroUI drop-zone layout.
   * @default "Drop files here"
   */
  title?: ReactNode;
  /**
   * Custom icon rendered in the default HeroUI drop-zone layout.
   */
  icon?: ReactNode;
  /**
   * Whether to hide the default icon.
   * @default false
   */
  hideIcon?: boolean;
  /**
   * Controlled uploaded files.
   */
  fileList?: UploadedFileInfo[];
  /**
   * Initial uploaded files for uncontrolled usage.
   * @default []
   */
  defaultFileList?: UploadedFileInfo[];
  /**
   * Called when the accepted uploaded files change.
   */
  onChange?: DropZoneChangeHandler;
  /**
   * Called after an uploaded file is removed.
   */
  onRemove?: DropZoneRemoveHandler;
  /**
   * Allowed file types. Supports the same values as the native input `accept` attribute.
   * Examples: `"image/*"`, `".pdf,.docx"`, or `["image/png", ".pdf"]`.
   * @default undefined
   */
  accept?: AcceptedFileType;
  /**
   * Maximum allowed file size in bytes.
   * @default undefined
   */
  maxFileSize?: number;
  /**
   * Maximum number of accepted files.
   * @default 1
   */
  maxFiles?: number;
  /**
   * Error message shown when the drop zone is invalid. Internal validation messages
   * from file type, size, or count limits take precedence.
   */
  errorMessage?: ReactNode;
  /**
   * Whether the drop zone should be marked invalid.
   * @default false
   */
  isInvalid?: boolean;
  /**
   * Classname or list of classes to change the classNames of the element.
   * if `className` is passed, it will be added to the base slot.
   */
  classNames?: SlotsToClasses<DropZoneSlots>;
  /**
   * Custom children or render function. If omitted, the default HeroUI layout is rendered.
   */
  children?: ReactNode | ((state: DropZoneState) => ReactNode);
}

export type UseDropZoneProps = DropZoneBaseProps &
  DropZoneVariantProps &
  Omit<DropOptions, "ref" | "hasDropButton">;

export interface DropZoneProps extends UseDropZoneProps {}
