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

// Upload status machine states
export type UploadStatus = "idle" | "uploading" | "success" | "error";

// Data returned by the server after a successful upload
export interface UploadResult {
  name?: string;
  url?: string;
  [key: string]: unknown;
}

export type PreviewSource = string | Blob | File | null | undefined;

// Per-card upload state (internal, not exposed via onChange)
export interface UploadCardUploadState {
  status: UploadStatus;
  progress: number; // 0 ~ 1
  result?: UploadResult;
  error?: unknown;
  file?: File; // kept for retry
}

// Context passed into onUpload
export interface UploadContext {
  onProgress: (progress: number) => void;
  signal: AbortSignal;
}

export interface PreviewResolverContext {
  uploadedFile: UploadedFileInfo;
  uploadState?: UploadCardUploadState;
  signal: AbortSignal;
}

export type OnUploadHandler = (file: File, context: UploadContext) => Promise<UploadResult>;
export type PreviewResolver = (
  context: PreviewResolverContext,
) => Promise<PreviewSource> | PreviewSource;

export type OnUploadSuccessHandler = (file: UploadedFileInfo, result: UploadResult) => void;

export type OnUploadErrorHandler = (file: UploadedFileInfo, error: unknown) => void;

export type OnPreviewErrorHandler = (file: UploadedFileInfo, error: unknown) => void;

export type DropZoneValidationErrorCode = "tooManyFiles" | "invalidFileType" | "fileTooLarge";

export interface DropZoneValidationErrorContext {
  kind: "validation";
  code: DropZoneValidationErrorCode;
  acceptedFileTypes: string[];
  currentFileCount: number;
  files: File[];
  maxFileSize?: number;
  maxFiles: number;
}

export interface DropZoneUploadErrorContext {
  kind: "upload";
  error: unknown;
  file: UploadedFileInfo;
  uploadState?: UploadCardUploadState;
}

export interface DropZonePreviewErrorContext {
  kind: "preview";
  error: unknown;
  file: UploadedFileInfo;
  uploadState?: UploadCardUploadState;
}

export interface DropZoneInvalidErrorContext {
  kind: "invalid";
}

export type DropZoneErrorContext =
  | DropZoneValidationErrorContext
  | DropZoneUploadErrorContext
  | DropZonePreviewErrorContext
  | DropZoneInvalidErrorContext;

export interface DropZoneErrorMessages {
  invalid?: ReactNode;
  invalidType?: ReactNode;
  previewFailed?: ReactNode;
  tooLarge?: ReactNode;
  tooMany?: ReactNode;
  uploadFailed?: ReactNode;
}

export interface DropZoneCardState {
  id: string;
  uploadedFile: UploadedFileInfo | null;
  uploadState?: UploadCardUploadState;
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
   * Whether to render image previews below uploaded cards in the default layout.
   * Only files with an image MIME type and an available local File object or upload result URL
   * can be previewed. For private remote assets, use `previewResolver` to resolve an
   * authenticated preview source.
   * @default false
   */
  isPreview?: boolean;
  /**
   * Optionally resolves image previews for uploaded files that are not directly public.
   * Return a string URL, Blob, or File. Blob/File values are converted to object URLs internally.
   */
  previewResolver?: PreviewResolver;
  /**
   * Called when `previewResolver` throws or returns null/undefined for a file.
   * Use this to report the error externally or to derive a custom error message.
   */
  onPreviewError?: OnPreviewErrorHandler;
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
   * Called when a file is accepted. Return a Promise that resolves with server response data.
   * Provides `onProgress(0~1)` and an `AbortSignal` for cancellation.
   * When omitted the component behaves as a pure file-picker (existing behaviour).
   */
  onUpload?: OnUploadHandler;
  /**
   * Called when a file upload succeeds.
   */
  onUploadSuccess?: OnUploadSuccessHandler;
  /**
   * Called when a file upload fails.
   */
  onUploadError?: OnUploadErrorHandler;
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
   * Override built-in error copy by error type. Any missing key falls back to the default message.
   */
  errorMessage?: DropZoneErrorMessages;
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
