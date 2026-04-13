import type {DropEvent} from "@react-aria/dnd";
import type {ChangeEvent, ReactNode} from "react";
import type {DropZoneCardState, UploadedFileInfo, UseDropZoneProps} from "../types";

import {useCallback, useRef, useState} from "react";

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
  const nextCardIdRef = useRef(0);
  const createUploadCard = useCallback(
    (uploadedFile: UploadedFileInfo | null): DropZoneCardState => {
      return {
        id: `drop-zone-card-${nextCardIdRef.current++}`,
        uploadedFile,
      };
    },
    [],
  );
  const normalizeUploadCards = useCallback(
    (cards: DropZoneCardState[]) => {
      const limitedMaxFiles = Math.max(maxFiles, 0);
      const nextUploadCards: DropZoneCardState[] = [];
      let uploadedCardsCount = 0;
      let hasEmptyCard = false;

      cards.forEach((card) => {
        if (card.uploadedFile) {
          if (uploadedCardsCount < limitedMaxFiles) {
            nextUploadCards.push(card);
            uploadedCardsCount += 1;
          }

          return;
        }

        if (!hasEmptyCard && uploadedCardsCount < limitedMaxFiles) {
          nextUploadCards.push(card);
          hasEmptyCard = true;
        }
      });

      if (!hasEmptyCard && uploadedCardsCount < limitedMaxFiles) {
        nextUploadCards.push(createUploadCard(null));
      }

      return nextUploadCards;
    },
    [createUploadCard, maxFiles],
  );
  const [uploadCards, setUploadCards] = useState<DropZoneCardState[]>(() => {
    return normalizeUploadCards([]);
  });
  const [validationMessage, setValidationMessage] = useState<ReactNode>(null);
  const uploadCardsRef = useRef<DropZoneCardState[]>(uploadCards);
  const updateUploadCards = useCallback((nextUploadCards: DropZoneCardState[]) => {
    uploadCardsRef.current = nextUploadCards;
    setUploadCards(nextUploadCards);
  }, []);
  const uploadedFiles = uploadCards.flatMap((card) => {
    return card.uploadedFile ? [card.uploadedFile] : [];
  });

  const commitFiles = useCallback(
    (files: File[]) => {
      // Keep explicit card slots instead of only uploaded files so the same UploadCard
      // instance can transition from idle -> uploaded and preserve AnimatePresence.
      const currentUploadCards = uploadCardsRef.current;
      const currentUploadedFiles = currentUploadCards.flatMap((card) => {
        return card.uploadedFile ? [card.uploadedFile] : [];
      });
      const resolution = resolveAcceptedFiles(
        files,
        acceptedFileTypes,
        maxFileSize,
        maxFiles,
        currentUploadedFiles.length,
      );
      const nextUploadCards = [...currentUploadCards];
      const emptyCardIndexes = nextUploadCards.reduce<number[]>((indexes, card, index) => {
        if (card.uploadedFile === null) {
          indexes.push(index);
        }

        return indexes;
      }, []);

      resolution.acceptedFiles.forEach((file) => {
        const uploadedFile = toUploadedFileInfo(file);
        const emptyCardIndex = emptyCardIndexes.shift();

        // Fill an existing empty card first so its local motion state can animate
        // from idle content into the uploaded detail card.
        if (typeof emptyCardIndex === "number") {
          nextUploadCards[emptyCardIndex] = {
            ...nextUploadCards[emptyCardIndex],
            uploadedFile,
          };

          return;
        }

        nextUploadCards.push(createUploadCard(uploadedFile));
      });

      updateUploadCards(normalizeUploadCards(nextUploadCards));
      setValidationMessage(resolution.validationMessage);

      return resolution;
    },
    [
      acceptedFileTypes,
      createUploadCard,
      maxFileSize,
      maxFiles,
      normalizeUploadCards,
      updateUploadCards,
    ],
  );

  const handleDrop = useCallback(
    async (event: DropEvent) => {
      const droppedItems = getFileDropItems(event.items);
      const droppedFiles = await getFilesFromDropItems(droppedItems);
      const {acceptedIndexes} = commitFiles(droppedFiles);
      const acceptedDropItems = acceptedIndexes.map((index) => droppedItems[index]).filter(Boolean);

      onDrop?.({
        ...event,
        items: acceptedDropItems,
      });
    },
    [commitFiles, onDrop],
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files?.length) return;

      const {acceptedFiles} = commitFiles(Array.from(files));

      onDrop?.({
        type: "drop",
        items: createDropItemsFromFiles(acceptedFiles),
        x: 0,
        y: 0,
        dropOperation: "copy",
      } satisfies DropEvent);
      event.target.value = "";
    },
    [commitFiles, onDrop],
  );

  const removeUploadedFile = useCallback(
    (cardId: string) => {
      // Reset the same card back to idle instead of removing it outright so
      // UploadCard can animate uploaded -> idle before normalization trims
      // the extra empty placeholder.
      const nextUploadCards = normalizeUploadCards(
        uploadCardsRef.current.map((card) => {
          if (card.id !== cardId) {
            return card;
          }

          return {
            ...card,
            uploadedFile: null,
          };
        }),
      );

      updateUploadCards(nextUploadCards);
      setValidationMessage(null);
    },
    [normalizeUploadCards, updateUploadCards],
  );

  const clearUploadedFiles = useCallback(() => {
    updateUploadCards(normalizeUploadCards([]));
    setValidationMessage(null);
  }, [normalizeUploadCards, updateUploadCards]);

  return {
    uploadCards,
    uploadedFiles,
    validationMessage,
    clearUploadedFiles,
    removeUploadedFile,
    handleDrop,
    handleFileChange,
  };
}
