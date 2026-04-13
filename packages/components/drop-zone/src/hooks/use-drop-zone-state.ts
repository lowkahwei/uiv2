import type {DropEvent} from "@react-aria/dnd";
import type {ChangeEvent, ReactNode} from "react";
import type {DropZoneCardState, UploadedFileInfo, UseDropZoneProps} from "../types";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";

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
  fileList?: UploadedFileInfo[];
  defaultFileList?: UploadedFileInfo[];
  maxFileSize?: number;
  maxFiles?: number;
  onChange?: UseDropZoneProps["onChange"];
  onDrop?: UseDropZoneProps["onDrop"];
  onRemove?: UseDropZoneProps["onRemove"];
}

function isSameUploadedFile(
  left: UploadedFileInfo | null | undefined,
  right: UploadedFileInfo | null | undefined,
) {
  return left?.name === right?.name && left?.size === right?.size && left?.type === right?.type;
}

function getUploadedFilesFromCards(cards: DropZoneCardState[]) {
  return cards.flatMap((card) => {
    return card.uploadedFile ? [card.uploadedFile] : [];
  });
}

function areUploadCardsEqual(left: DropZoneCardState[], right: DropZoneCardState[]) {
  return (
    left.length === right.length &&
    left.every((card, index) => {
      const nextCard = right[index];

      return (
        card.id === nextCard?.id && isSameUploadedFile(card.uploadedFile, nextCard?.uploadedFile)
      );
    })
  );
}

export function useDropZoneState({
  acceptedFileTypes,
  fileList,
  defaultFileList,
  maxFileSize,
  maxFiles = 1,
  onChange,
  onDrop,
  onRemove,
}: UseDropZoneStateOptions) {
  const nextCardIdRef = useRef(0);
  const pendingUploadCardsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isControlled = fileList !== undefined;
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
  const normalizeUploadedFiles = useCallback(
    (files?: UploadedFileInfo[]) => {
      return (files ?? []).slice(0, Math.max(maxFiles, 0));
    },
    [maxFiles],
  );
  const initialUploadedFiles = normalizeUploadedFiles(isControlled ? fileList : defaultFileList);
  const [uploadCards, setUploadCards] = useState<DropZoneCardState[]>(() => {
    const initialCards = initialUploadedFiles.map((uploadedFile) => createUploadCard(uploadedFile));

    return normalizeUploadCards(initialCards);
  });
  const [validationMessage, setValidationMessage] = useState<ReactNode>(null);
  const uploadCardsRef = useRef<DropZoneCardState[]>(uploadCards);
  const updateUploadCards = useCallback((nextUploadCards: DropZoneCardState[]) => {
    uploadCardsRef.current = nextUploadCards;
    setUploadCards(nextUploadCards);
  }, []);
  const emitUploadedFilesChange = useCallback(
    (nextUploadedFiles: UploadedFileInfo[]) => {
      onChange?.(nextUploadedFiles);
    },
    [onChange],
  );
  const clearPendingUploadCardsTimeout = useCallback(() => {
    if (pendingUploadCardsTimeoutRef.current !== null) {
      clearTimeout(pendingUploadCardsTimeoutRef.current);
      pendingUploadCardsTimeoutRef.current = null;
    }
  }, []);
  const scheduleUploadCardsUpdate = useCallback(
    (callback: () => void) => {
      clearPendingUploadCardsTimeout();
      pendingUploadCardsTimeoutRef.current = setTimeout(() => {
        callback();
        pendingUploadCardsTimeoutRef.current = null;
      }, UPLOAD_CARD_APPEND_DELAY_MS);
    },
    [clearPendingUploadCardsTimeout],
  );
  const scheduleEmptyCardAfterAnimation = useCallback(
    (cards: DropZoneCardState[]) => {
      clearPendingUploadCardsTimeout();

      if (cards.some((card) => card.uploadedFile === null)) {
        return;
      }

      if (cards.filter((card) => card.uploadedFile !== null).length >= Math.max(maxFiles, 0)) {
        return;
      }

      // Delay the next empty slot until the current card finishes its upload animation.
      scheduleUploadCardsUpdate(() => {
        // Prepend the next idle card so the visual insertion direction stays consistent:
        // the idle slot appears from the top, and the next uploaded file occupies that top slot.
        updateUploadCards(
          normalizeUploadCards([createUploadCard(null), ...uploadCardsRef.current], true),
        );
      });
    },
    [
      clearPendingUploadCardsTimeout,
      createUploadCard,
      maxFiles,
      normalizeUploadCards,
      scheduleUploadCardsUpdate,
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
  const reconcileUploadCards = useCallback(
    (files: UploadedFileInfo[], currentCards: DropZoneCardState[] = uploadCardsRef.current) => {
      const remainingCards = [...currentCards];
      const uploadedCards = files.map((uploadedFile) => {
        const matchedCardIndex = remainingCards.findIndex((card) =>
          isSameUploadedFile(card.uploadedFile, uploadedFile),
        );

        if (matchedCardIndex === -1) {
          return createUploadCard(uploadedFile);
        }

        const matchedCard = remainingCards.splice(matchedCardIndex, 1)[0];

        return {
          ...matchedCard,
          uploadedFile,
        };
      });
      const existingIdleCard = remainingCards.find((card) => card.uploadedFile === null);
      const orderedCards = existingIdleCard ? [existingIdleCard, ...uploadedCards] : uploadedCards;

      return finalizeUploadCardsOrder(orderedCards);
    },
    [createUploadCard, finalizeUploadCardsOrder],
  );
  const uploadedFiles = useMemo(() => getUploadedFilesFromCards(uploadCards), [uploadCards]);

  useEffect(() => {
    return () => {
      clearPendingUploadCardsTimeout();
    };
  }, [clearPendingUploadCardsTimeout]);

  useEffect(() => {
    const currentUploadCards = uploadCardsRef.current;
    const currentUploadedFiles = getUploadedFilesFromCards(currentUploadCards);
    const nextUploadedFiles = isControlled
      ? normalizeUploadedFiles(fileList)
      : normalizeUploadedFiles(currentUploadedFiles);
    const nextUploadCards = isControlled
      ? reconcileUploadCards(nextUploadedFiles, currentUploadCards)
      : normalizeUploadCards(currentUploadCards);

    if (!areUploadCardsEqual(currentUploadCards, nextUploadCards)) {
      clearPendingUploadCardsTimeout();
      updateUploadCards(nextUploadCards);
      setValidationMessage(null);
    }
  }, [
    clearPendingUploadCardsTimeout,
    isControlled,
    normalizeUploadedFiles,
    normalizeUploadCards,
    reconcileUploadCards,
    updateUploadCards,
    fileList,
  ]);

  const commitFiles = useCallback(
    (files: File[]) => {
      // Keep explicit card slots instead of only uploaded files so the same UploadCard
      // instance can transition from idle -> uploaded and preserve AnimatePresence.
      const currentUploadCards = uploadCardsRef.current;
      const currentUploadedFiles = getUploadedFilesFromCards(currentUploadCards);
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
      const nextUploadedFiles = getUploadedFilesFromCards(normalizedUploadCards);

      updateUploadCards(normalizedUploadCards);
      scheduleEmptyCardAfterAnimation(normalizedUploadCards);
      setValidationMessage(resolution.validationMessage);
      emitUploadedFilesChange(nextUploadedFiles);

      return {
        ...resolution,
        nextUploadedFiles,
      };
    },
    [
      acceptedFileTypes,
      createUploadCard,
      emitUploadedFilesChange,
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
      clearPendingUploadCardsTimeout();
      let removedUploadedFile: UploadedFileInfo | null = null;
      const nextUploadCards = uploadCardsRef.current.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        removedUploadedFile = card.uploadedFile;

        return {
          ...card,
          uploadedFile: null,
        };
      });
      const nextUploadedFiles = getUploadedFilesFromCards(nextUploadCards);

      updateUploadCards(nextUploadCards);
      scheduleUploadCardsUpdate(() => {
        // Rebuild the final list after the card-level exit finishes so the clicked
        // card owns the disappearance animation before the idle slot moves back to the top.
        updateUploadCards(finalizeUploadCardsOrder(uploadCardsRef.current));
      });
      setValidationMessage(null);
      emitUploadedFilesChange(nextUploadedFiles);

      if (removedUploadedFile) {
        onRemove?.(removedUploadedFile, nextUploadedFiles);
      }
    },
    [
      clearPendingUploadCardsTimeout,
      emitUploadedFilesChange,
      finalizeUploadCardsOrder,
      onRemove,
      scheduleUploadCardsUpdate,
      updateUploadCards,
    ],
  );

  const clearUploadedFiles = useCallback(() => {
    clearPendingUploadCardsTimeout();
    updateUploadCards(normalizeUploadCards([]));
    setValidationMessage(null);
    emitUploadedFilesChange([]);
  }, [
    clearPendingUploadCardsTimeout,
    emitUploadedFilesChange,
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
