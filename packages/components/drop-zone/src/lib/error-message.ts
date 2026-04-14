import type {
  DropZoneErrorContext,
  DropZoneErrorMessages,
  DropZoneValidationErrorContext,
} from "../types";
import type {ReactNode} from "react";

import {extractMimeSubtype} from "../drop-zone-utils";

function formatAcceptedFileTypesLabel(acceptedFileTypes: string[]) {
  if (acceptedFileTypes.length === 0) return "allowed file types";

  return acceptedFileTypes
    .map((type) => {
      const normalizedType = type.trim();

      if (normalizedType.startsWith(".")) {
        return normalizedType.slice(1).toUpperCase();
      }

      if (normalizedType.endsWith("/*")) {
        return `${normalizedType.slice(0, -2).toUpperCase()} files`;
      }

      return extractMimeSubtype(normalizedType)?.toUpperCase() || normalizedType;
    })
    .join(", ");
}

export function getDefaultValidationErrorMessage(context: DropZoneValidationErrorContext) {
  if (context.code === "tooManyFiles") {
    return `You can upload up to ${context.maxFiles} file${context.maxFiles === 1 ? "" : "s"}.`;
  }

  if (context.code === "invalidFileType") {
    return `Only ${formatAcceptedFileTypesLabel(context.acceptedFileTypes)} are allowed.`;
  }

  const maxFileSizeInMb = Math.round((context.maxFileSize ?? 0) / (1024 * 1024));

  return `Each file must be ${maxFileSizeInMb} MB or smaller.`;
}

function getErrorMessageKey(context: DropZoneErrorContext): keyof DropZoneErrorMessages {
  if (context.kind === "validation") {
    if (context.code === "tooManyFiles") {
      return "tooMany";
    }

    if (context.code === "invalidFileType") {
      return "invalidType";
    }

    return "tooLarge";
  }

  if (context.kind === "upload") {
    return "uploadFailed";
  }

  if (context.kind === "preview") {
    return "previewFailed";
  }

  return "invalid";
}

export function resolveDropZoneErrorMessage(
  errorMessage: DropZoneErrorMessages | undefined,
  context: DropZoneErrorContext,
  fallback: ReactNode,
) {
  const key = getErrorMessageKey(context);

  return errorMessage?.[key] ?? fallback;
}
