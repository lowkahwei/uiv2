import type {DropEvent} from "@react-aria/dnd";
import type {ChangeEvent, ReactNode, SetStateAction} from "react";
import type {DropZoneCardState, UploadedFileInfo, UseDropZoneProps} from "../types";

import {useControlledState} from "@react-stately/utils";
import {useCallback, useEffect, useRef, useState} from "react";

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
  disableAnimation?: boolean;
  onChange?: UseDropZoneProps["onChange"];
  onDrop?: UseDropZoneProps["onDrop"];
  onRemove?: UseDropZoneProps["onRemove"];
}

type PendingAnimationAction =
  | {type: "append-idle-card"}
  | {type: "finalize-remove"; cardId: string};

interface UploadCardsState {
  cards: DropZoneCardState[];
  pendingAnimationAction: PendingAnimationAction | null;
}

function isSameUploadedFile(
  left: UploadedFileInfo | null | undefined,
  right: UploadedFileInfo | null | undefined,
) {
  return left?.name === right?.name && left?.size === right?.size && left?.type === right?.type;
}

function getUploadedFiles(cards: DropZoneCardState[]) {
  return cards.flatMap((card) => {
    return card.uploadedFile ? [card.uploadedFile] : [];
  });
}

function getUploadedFileKey(uploadedFile: UploadedFileInfo | null | undefined) {
  if (!uploadedFile) {
    return null;
  }

  return `${uploadedFile.name}::${uploadedFile.size}::${uploadedFile.type}`;
}

function getEmptyCardIndexes(cards: DropZoneCardState[]) {
  return cards.flatMap((card, index) => {
    return card.uploadedFile === null ? [index] : [];
  });
}

function getUploadedCards(cards: DropZoneCardState[]) {
  return cards.filter((card) => card.uploadedFile !== null);
}

function hasIdleUploadCard(cards: DropZoneCardState[]) {
  return cards.some((card) => card.uploadedFile === null);
}

function partitionUploadCards(cards: DropZoneCardState[]) {
  const uploadedCardsByFileKey = new Map<string, DropZoneCardState[]>();
  let idleCard: DropZoneCardState | undefined;

  cards.forEach((card) => {
    const uploadedFileKey = getUploadedFileKey(card.uploadedFile);

    if (!uploadedFileKey) {
      idleCard ??= card;

      return;
    }

    const matchedCards = uploadedCardsByFileKey.get(uploadedFileKey);

    if (matchedCards) {
      matchedCards.push(card);
    } else {
      uploadedCardsByFileKey.set(uploadedFileKey, [card]);
    }
  });

  return {
    idleCard,
    uploadedCardsByFileKey,
  };
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

function areUploadedFilesEqual(left: UploadedFileInfo[], right: UploadedFileInfo[]) {
  return (
    left.length === right.length &&
    left.every((file, index) => isSameUploadedFile(file, right[index]))
  );
}

export function useDropZoneState({
  acceptedFileTypes,
  fileList,
  defaultFileList,
  maxFileSize,
  maxFiles = 1,
  disableAnimation = false,
  onChange,
  onDrop,
  onRemove,
}: UseDropZoneStateOptions) {
  const nextCardIdRef = useRef(0);
  const skipNextUploadedFilesChangeRef = useRef(false);
  const isControlled = fileList !== undefined;
  const maxFilesLimit = Math.max(maxFiles, 0);
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
      const nextUploadedCards = getUploadedCards(cards).slice(0, maxFilesLimit);
      const existingIdleCard = cards.find((card) => card.uploadedFile === null);

      if (!includeEmptyCard || nextUploadedCards.length >= maxFilesLimit) {
        return nextUploadedCards;
      }

      return [...nextUploadedCards, existingIdleCard ?? createUploadCard(null)];
    },
    [createUploadCard, maxFilesLimit],
  );
  const normalizeUploadedFiles = useCallback(
    (files?: UploadedFileInfo[]) => {
      return (files ?? []).slice(0, maxFilesLimit);
    },
    [maxFilesLimit],
  );
  const handleUploadedFilesChange = useCallback(
    (nextUploadedFiles: UploadedFileInfo[]) => {
      if (skipNextUploadedFilesChangeRef.current) {
        skipNextUploadedFilesChangeRef.current = false;

        return;
      }

      onChange?.(nextUploadedFiles);
    },
    [onChange],
  );
  const [uploadedFilesState, setUploadedFilesState] = useControlledState<UploadedFileInfo[]>(
    fileList,
    normalizeUploadedFiles(defaultFileList),
    handleUploadedFilesChange,
  );
  const setUploadedFiles = useCallback(
    (nextUploadedFiles: UploadedFileInfo[], options?: {silent?: boolean}) => {
      if (options?.silent) {
        skipNextUploadedFilesChangeRef.current = true;
      }
      setUploadedFilesState(normalizeUploadedFiles(nextUploadedFiles));
    },
    [normalizeUploadedFiles, setUploadedFilesState],
  );
  const normalizedUploadedFilesState = normalizeUploadedFiles(uploadedFilesState);
  const initialUploadedFiles = normalizedUploadedFilesState;
  const [uploadCardsState, setUploadCardsState] = useState<UploadCardsState>(() => {
    const initialCards = initialUploadedFiles.map((uploadedFile) => createUploadCard(uploadedFile));

    return {
      cards: normalizeUploadCards(initialCards),
      pendingAnimationAction: null,
    };
  });
  const [validationMessage, setValidationMessage] = useState<ReactNode>(null);
  const uploadCardsStateRef = useRef(uploadCardsState);
  const setUploadCards = useCallback((nextState: SetStateAction<UploadCardsState>) => {
    setUploadCardsState((previousState) => {
      const resolvedState =
        typeof nextState === "function"
          ? (nextState as (state: UploadCardsState) => UploadCardsState)(previousState)
          : nextState;

      uploadCardsStateRef.current = resolvedState;

      return resolvedState;
    });
  }, []);
  const finalizeAppendIdleCard = useCallback(
    (cards: DropZoneCardState[]) => {
      if (hasIdleUploadCard(cards)) {
        return;
      }

      if (getUploadedCards(cards).length >= maxFilesLimit) {
        return;
      }

      // Prepend the next idle card so the visual insertion direction stays consistent:
      // the idle slot appears from the top, and the next uploaded file occupies that top slot.
      return normalizeUploadCards([createUploadCard(null), ...cards], true);
    },
    [createUploadCard, maxFilesLimit, normalizeUploadCards],
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
    (
      files: UploadedFileInfo[],
      currentCards: DropZoneCardState[] = uploadCardsStateRef.current.cards,
    ) => {
      const {idleCard, uploadedCardsByFileKey} = partitionUploadCards(currentCards);
      const uploadedCards = files.map((uploadedFile) => {
        const uploadedFileKey = getUploadedFileKey(uploadedFile);
        const matchedCard = uploadedFileKey
          ? uploadedCardsByFileKey.get(uploadedFileKey)?.shift()
          : undefined;

        if (!matchedCard) {
          return createUploadCard(uploadedFile);
        }

        return {
          ...matchedCard,
          uploadedFile,
        };
      });
      const orderedCards = idleCard ? [idleCard, ...uploadedCards] : uploadedCards;

      return finalizeUploadCardsOrder(orderedCards);
    },
    [createUploadCard, finalizeUploadCardsOrder],
  );

  useEffect(() => {
    if (!isControlled) {
      return;
    }

    const currentUploadCards = uploadCardsStateRef.current.cards;
    const nextUploadCards = reconcileUploadCards(normalizedUploadedFilesState, currentUploadCards);

    if (!areUploadCardsEqual(currentUploadCards, nextUploadCards)) {
      setUploadCards({
        cards: nextUploadCards,
        pendingAnimationAction: null,
      });
      setValidationMessage(null);
    }
  }, [isControlled, normalizedUploadedFilesState, reconcileUploadCards, setUploadCards]);

  useEffect(() => {
    if (isControlled) {
      return;
    }

    const currentUploadCards = uploadCardsStateRef.current.cards;
    const nextUploadCards = normalizeUploadCards(currentUploadCards);
    const nextUploadedFiles = getUploadedFiles(nextUploadCards);

    if (!areUploadCardsEqual(currentUploadCards, nextUploadCards)) {
      setUploadCards({
        cards: nextUploadCards,
        pendingAnimationAction: null,
      });
      setValidationMessage(null);
    }

    if (!areUploadedFilesEqual(normalizedUploadedFilesState, nextUploadedFiles)) {
      setUploadedFiles(nextUploadedFiles, {silent: true});
    }
  }, [
    isControlled,
    normalizeUploadCards,
    normalizedUploadedFilesState,
    setUploadCards,
    setUploadedFiles,
  ]);

  const commitFiles = useCallback(
    (files: File[]) => {
      // Keep explicit card slots instead of only uploaded files so the same UploadCard
      // instance can transition from idle -> uploaded and preserve AnimatePresence.
      const currentUploadCards = uploadCardsStateRef.current.cards;
      const currentUploadedFiles = getUploadedFiles(currentUploadCards);
      const resolution = resolveAcceptedFiles(
        files,
        acceptedFileTypes,
        maxFileSize,
        maxFiles,
        currentUploadedFiles.length,
      );
      const nextUploadCards = [...currentUploadCards];
      const emptyCardIndexes = getEmptyCardIndexes(nextUploadCards);

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
      const nextUploadedFiles = getUploadedFiles(normalizedUploadCards);
      const shouldAppendIdleCard =
        !hasIdleUploadCard(normalizedUploadCards) && nextUploadedFiles.length < maxFilesLimit;

      setUploadCards({
        cards:
          disableAnimation && shouldAppendIdleCard
            ? (finalizeAppendIdleCard(normalizedUploadCards) ?? normalizedUploadCards)
            : normalizedUploadCards,
        pendingAnimationAction:
          !disableAnimation && shouldAppendIdleCard ? {type: "append-idle-card"} : null,
      });
      setValidationMessage(resolution.validationMessage);
      setUploadedFiles(nextUploadedFiles);

      return {
        ...resolution,
        nextUploadedFiles,
      };
    },
    [
      acceptedFileTypes,
      createUploadCard,
      disableAnimation,
      finalizeAppendIdleCard,
      maxFileSize,
      maxFiles,
      maxFilesLimit,
      normalizeUploadCards,
      setUploadedFiles,
      setUploadCards,
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
      let removedUploadedFile: UploadedFileInfo | null = null;
      const nextUploadCards = uploadCardsStateRef.current.cards.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        removedUploadedFile = card.uploadedFile;

        return {
          ...card,
          uploadedFile: null,
        };
      });
      const nextUploadedFiles = getUploadedFiles(nextUploadCards);

      setUploadCards({
        cards: disableAnimation ? finalizeUploadCardsOrder(nextUploadCards) : nextUploadCards,
        pendingAnimationAction: disableAnimation ? null : {type: "finalize-remove", cardId},
      });
      setValidationMessage(null);
      setUploadedFiles(nextUploadedFiles);

      if (removedUploadedFile) {
        onRemove?.(removedUploadedFile, nextUploadedFiles);
      }
    },
    [disableAnimation, finalizeUploadCardsOrder, onRemove, setUploadedFiles, setUploadCards],
  );

  const clearUploadedFiles = useCallback(() => {
    setUploadCards({
      cards: normalizeUploadCards([]),
      pendingAnimationAction: null,
    });
    setValidationMessage(null);
    setUploadedFiles([]);
  }, [normalizeUploadCards, setUploadCards, setUploadedFiles]);

  const handleUploadCardContentAnimationComplete = useCallback(
    (cardId: string, uploadedFile: UploadedFileInfo | null) => {
      const {cards, pendingAnimationAction} = uploadCardsStateRef.current;

      if (!pendingAnimationAction) {
        return;
      }

      if (pendingAnimationAction.type === "append-idle-card") {
        if (!uploadedFile) {
          return;
        }

        setUploadCards({
          cards: finalizeAppendIdleCard(cards) ?? cards,
          pendingAnimationAction: null,
        });

        return;
      }

      if (pendingAnimationAction.cardId !== cardId || uploadedFile !== null) {
        return;
      }

      setUploadCards({
        cards: finalizeUploadCardsOrder(cards),
        pendingAnimationAction: null,
      });
    },
    [finalizeAppendIdleCard, finalizeUploadCardsOrder, setUploadCards],
  );

  return {
    uploadCards: uploadCardsState.cards,
    uploadedFiles: normalizedUploadedFilesState,
    validationMessage,
    clearUploadedFiles,
    removeUploadedFile,
    handleDrop,
    handleFileChange,
    handleUploadCardContentAnimationComplete,
  };
}
