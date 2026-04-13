import type {DropEvent} from "@react-aria/dnd";
import type {ChangeEvent, ReactNode} from "react";
import type {DropZoneCardState, UploadedFileInfo, UseDropZoneProps} from "../types";

import {useCallback, useEffect, useRef, useState} from "react";

import {UPLOAD_CARD_APPEND_DELAY_MS} from "../card/constants";
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
  const appendEmptyCardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeUploadedFileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    (cards: DropZoneCardState[], includeEmptyCard = true) => {
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

      if (includeEmptyCard && !hasEmptyCard && uploadedCardsCount < limitedMaxFiles) {
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
  const clearAppendEmptyCardTimeout = useCallback(() => {
    if (appendEmptyCardTimeoutRef.current !== null) {
      clearTimeout(appendEmptyCardTimeoutRef.current);
      appendEmptyCardTimeoutRef.current = null;
    }
  }, []);
  const clearRemoveUploadedFileTimeout = useCallback(() => {
    if (removeUploadedFileTimeoutRef.current !== null) {
      clearTimeout(removeUploadedFileTimeoutRef.current);
      removeUploadedFileTimeoutRef.current = null;
    }
  }, []);
  const scheduleEmptyCardAfterAnimation = useCallback(
    (cards: DropZoneCardState[]) => {
      clearAppendEmptyCardTimeout();

      if (cards.some((card) => card.uploadedFile === null)) {
        return;
      }

      if (cards.filter((card) => card.uploadedFile !== null).length >= Math.max(maxFiles, 0)) {
        return;
      }

      // Delay the next empty slot until the current card finishes its upload animation.
      appendEmptyCardTimeoutRef.current = setTimeout(() => {
        // Prepend the next idle card so the visual insertion direction stays consistent:
        // the idle slot appears from the top, and the next uploaded file occupies that top slot.
        updateUploadCards(
          normalizeUploadCards([createUploadCard(null), ...uploadCardsRef.current], true),
        );
        appendEmptyCardTimeoutRef.current = null;
      }, UPLOAD_CARD_APPEND_DELAY_MS);
    },
    [
      clearAppendEmptyCardTimeout,
      createUploadCard,
      maxFiles,
      normalizeUploadCards,
      updateUploadCards,
    ],
  );
  const finalizeUploadCardsOrder = useCallback(
    (cards: DropZoneCardState[]) => {
      const hasIdleCardAtTop = cards[0]?.uploadedFile === null;

      if (hasIdleCardAtTop) {
        return normalizeUploadCards(cards, true);
      }

      return normalizeUploadCards([createUploadCard(null), ...cards], true);
    },
    [createUploadCard, normalizeUploadCards],
  );
  const uploadedFiles = uploadCards.flatMap((card) => {
    return card.uploadedFile ? [card.uploadedFile] : [];
  });

  useEffect(() => {
    return () => {
      clearAppendEmptyCardTimeout();
      clearRemoveUploadedFileTimeout();
    };
  }, [clearAppendEmptyCardTimeout, clearRemoveUploadedFileTimeout]);

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

      const normalizedUploadCards = normalizeUploadCards(nextUploadCards, false);

      updateUploadCards(normalizedUploadCards);
      scheduleEmptyCardAfterAnimation(normalizedUploadCards);
      setValidationMessage(resolution.validationMessage);

      return resolution;
    },
    [
      acceptedFileTypes,
      clearAppendEmptyCardTimeout,
      createUploadCard,
      maxFileSize,
      maxFiles,
      normalizeUploadCards,
      scheduleEmptyCardAfterAnimation,
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
      // UploadCard can animate uploaded -> idle in-place on the card that was clicked.
      clearAppendEmptyCardTimeout();
      clearRemoveUploadedFileTimeout();
      const nextUploadCards = uploadCardsRef.current.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        return {
          ...card,
          uploadedFile: null,
        };
      });

      updateUploadCards(nextUploadCards);
      removeUploadedFileTimeoutRef.current = setTimeout(() => {
        // Rebuild the final list after the card-level exit finishes so the clicked
        // card owns the disappearance animation before the idle slot moves back to the top.
        updateUploadCards(finalizeUploadCardsOrder(uploadCardsRef.current));
        removeUploadedFileTimeoutRef.current = null;
      }, UPLOAD_CARD_APPEND_DELAY_MS);
      setValidationMessage(null);
    },
    [
      clearAppendEmptyCardTimeout,
      clearRemoveUploadedFileTimeout,
      finalizeUploadCardsOrder,
      updateUploadCards,
    ],
  );

  const clearUploadedFiles = useCallback(() => {
    clearAppendEmptyCardTimeout();
    clearRemoveUploadedFileTimeout();
    updateUploadCards(normalizeUploadCards([]));
    setValidationMessage(null);
  }, [
    clearAppendEmptyCardTimeout,
    clearRemoveUploadedFileTimeout,
    normalizeUploadCards,
    updateUploadCards,
  ]);

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
