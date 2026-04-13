import type {DropItem} from "@react-aria/dnd";
import type {AcceptedFileType, UploadedFileInfo} from "../types";

import accept from "attr-accept";

import {extractMimeSubtype} from "../drop-zone-utils";

type FileDropItem = Extract<DropItem, {kind: "file"}>;

export interface ResolvedAcceptedFiles {
  acceptedFiles: File[];
  acceptedIndexes: number[];
  validationMessage: string | null;
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

  let validationMessage: string | null = null;

  if (files.length + currentFileCount > maxFiles) {
    validationMessage = `You can upload up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`;
  } else if (hasInvalidType) {
    validationMessage = `Only ${formatAcceptedFileTypesLabel(acceptedFileTypes)} are allowed.`;
  } else if (hasOversizedFile && typeof maxFileSize === "number") {
    validationMessage = `Each file must be ${Math.round(maxFileSize / (1024 * 1024))} MB or smaller.`;
  }

  return {
    acceptedFiles,
    acceptedIndexes,
    validationMessage,
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
