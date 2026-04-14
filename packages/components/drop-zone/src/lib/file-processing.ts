import type {DropItem} from "@react-aria/dnd";
import type {AcceptedFileType, DropZoneValidationErrorContext, UploadedFileInfo} from "../types";

import accept from "attr-accept";

type FileDropItem = Extract<DropItem, {kind: "file"}>;

export interface ResolvedAcceptedFiles {
  acceptedFiles: File[];
  acceptedIndexes: number[];
  validationError: DropZoneValidationErrorContext | null;
}

export function toUploadedFileInfo(file: File): UploadedFileInfo {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export function normalizeAccept(accept?: AcceptedFileType) {
  if (!accept) return [];

  const values = Array.isArray(accept) ? accept : accept.split(",");

  return values.map((value) => value.trim()).filter(Boolean);
}

function matchesAcceptedFileType(file: File, acceptedFileTypes: string[]) {
  if (acceptedFileTypes.length === 0) return true;

  return accept(file, acceptedFileTypes);
}

export function resolveAcceptedFiles(
  files: File[],
  acceptedFileTypes: string[],
  maxFileSize?: number,
  maxFiles = 1,
  currentFileCount = 0,
): ResolvedAcceptedFiles {
  const acceptedFiles: File[] = [];
  const acceptedIndexes: number[] = [];
  const limitedMaxFiles = Math.max(maxFiles - currentFileCount, 0);
  let hasInvalidType = false;
  let hasOversizedFile = false;

  files.forEach((file, index) => {
    const isAcceptedType = matchesAcceptedFileType(file, acceptedFileTypes);

    if (!isAcceptedType) {
      hasInvalidType = true;

      return;
    }

    const isAcceptedSize = typeof maxFileSize === "number" ? file.size <= maxFileSize : true;

    if (!isAcceptedSize) {
      hasOversizedFile = true;

      return;
    }

    if (acceptedFiles.length < limitedMaxFiles) {
      acceptedFiles.push(file);
      acceptedIndexes.push(index);
    }
  });

  let validationError: DropZoneValidationErrorContext | null = null;

  if (files.length + currentFileCount > maxFiles) {
    validationError = {
      kind: "validation",
      code: "tooManyFiles",
      acceptedFileTypes,
      currentFileCount,
      files,
      maxFileSize,
      maxFiles,
    };
  } else if (hasInvalidType) {
    validationError = {
      kind: "validation",
      code: "invalidFileType",
      acceptedFileTypes,
      currentFileCount,
      files,
      maxFileSize,
      maxFiles,
    };
  } else if (hasOversizedFile && typeof maxFileSize === "number") {
    validationError = {
      kind: "validation",
      code: "fileTooLarge",
      acceptedFileTypes,
      currentFileCount,
      files,
      maxFileSize,
      maxFiles,
    };
  }

  return {
    acceptedFiles,
    acceptedIndexes,
    validationError,
  };
}

export function getFileDropItems(items: DropItem[]): FileDropItem[] {
  return items.filter((item): item is FileDropItem => item.kind === "file");
}

export async function getFilesFromDropItems(items: FileDropItem[]) {
  return Promise.all(items.map((item) => item.getFile()));
}

export function createDropItemsFromFiles(files: FileList | File[]): DropItem[] {
  return Array.from(files).map((file) => ({
    kind: "file" as const,
    type: file.type,
    name: file.name,
    getFile: async () => file,
    getText: async () => file.text(),
  }));
}
