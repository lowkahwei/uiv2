import type {DropEvent} from "@react-aria/dnd";
import type {ChangeEvent, ReactNode} from "react";
import type {UploadedFileInfo, UseDropZoneProps} from "../types";

import {useCallback, useState} from "react";

import {
  createDropItemsFromFiles,
  getFileDropItems,
  getFilesFromDropItems,
  resolveAcceptedFiles,
  toUploadedFileInfo,
} from "../lib/file-processing";

interface UseDropZoneStateOptions {
  acceptedFileTypes: string[];
  maxFileSize?: number;
  maxFiles?: number;
  onDrop?: UseDropZoneProps["onDrop"];
}

export function useDropZoneState({
  acceptedFileTypes,
  maxFileSize,
  maxFiles = 1,
  onDrop,
}: UseDropZoneStateOptions) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [validationMessage, setValidationMessage] = useState<ReactNode>(null);

  const resolveAndCommitFiles = useCallback(
    (files: File[]) => {
      const resolution = resolveAcceptedFiles(files, acceptedFileTypes, maxFileSize, maxFiles);

      setUploadedFiles(resolution.acceptedFiles.map(toUploadedFileInfo));
      setValidationMessage(resolution.validationMessage);

      return resolution;
    },
    [acceptedFileTypes, maxFileSize, maxFiles],
  );

  const handleDrop = useCallback(
    async (event: DropEvent) => {
      const droppedItems = getFileDropItems(event.items);
      const droppedFiles = await getFilesFromDropItems(droppedItems);
      const {acceptedIndexes} = resolveAndCommitFiles(droppedFiles);
      const acceptedDropItems = acceptedIndexes.map((index) => droppedItems[index]).filter(Boolean);

      onDrop?.({
        ...event,
        items: acceptedDropItems,
      });
    },
    [onDrop, resolveAndCommitFiles],
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files?.length) return;

      const {acceptedFiles} = resolveAndCommitFiles(Array.from(files));

      onDrop?.({
        type: "drop",
        items: createDropItemsFromFiles(acceptedFiles),
        x: 0,
        y: 0,
        dropOperation: "copy",
      } satisfies DropEvent);
      event.target.value = "";
    },
    [onDrop, resolveAndCommitFiles],
  );

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
    setValidationMessage(null);
  }, []);

  return {
    uploadedFiles,
    validationMessage,
    clearUploadedFiles,
    handleDrop,
    handleFileChange,
  };
}
