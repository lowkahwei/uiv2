import type {DropEvent} from "@react-aria/dnd";
import type {ChangeEvent, ReactNode, SetStateAction} from "react";
import type {
  DropZoneCardState,
  UploadCardUploadState,
  UploadedFileInfo,
  UseDropZoneProps,
} from "../types";

import {useCallback, useEffect, useRef, useState} from "react";

import {getUploadedFileKey} from "../drop-zone-utils";
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
  onUpload?: UseDropZoneProps["onUpload"];
  onUploadSuccess?: UseDropZoneProps["onUploadSuccess"];
  onUploadError?: UseDropZoneProps["onUploadError"];
}

type PendingAnimationAction =
  | {type: "append-idle-card"}
  | {type: "finalize-remove"; cardId: string};

interface UploadCardsState {
  cards: DropZoneCardState[];
  pendingAnimationAction: PendingAnimationAction | null;
}

interface PendingUploadTarget {
  cardId: string;
  file: File;
  uploadedFile: UploadedFileInfo;
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
  onUpload,
  onUploadSuccess,
  onUploadError,
}: UseDropZoneStateOptions) {
  const nextCardIdRef = useRef(0);
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
  const initialUploadedFiles = normalizeUploadedFiles(fileList ?? defaultFileList);
  const [uploadCardsState, setUploadCardsState] = useState<UploadCardsState>(() => {
    const initialCards = initialUploadedFiles.map((uploadedFile) => createUploadCard(uploadedFile));

    return {
      cards: normalizeUploadCards(initialCards),
      pendingAnimationAction: null,
    };
  });
  const [validationMessage, setValidationMessage] = useState<ReactNode>(null);
  const uploadCardsStateRef = useRef(uploadCardsState);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
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
  const notifyUploadedFilesChange = useCallback(
    (previousUploadedFiles: UploadedFileInfo[], nextUploadedFiles: UploadedFileInfo[]) => {
      if (!onChange || areUploadedFilesEqual(previousUploadedFiles, nextUploadedFiles)) {
        return;
      }

      onChange(nextUploadedFiles);
    },
    [onChange],
  );
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
    const currentUploadCards = uploadCardsStateRef.current.cards;
    const nextUploadCards = isControlled
      ? reconcileUploadCards(normalizeUploadedFiles(fileList), currentUploadCards)
      : normalizeUploadCards(currentUploadCards);

    if (!areUploadCardsEqual(currentUploadCards, nextUploadCards)) {
      setUploadCards({
        cards: nextUploadCards,
        pendingAnimationAction: null,
      });
      setValidationMessage(null);
    }
  }, [
    fileList,
    isControlled,
    normalizeUploadCards,
    normalizeUploadedFiles,
    reconcileUploadCards,
    setUploadCards,
  ]);

  const updateCardUploadState = useCallback(
    (cardId: string, patch: Partial<UploadCardUploadState>) => {
      setUploadCards((prev) => ({
        ...prev,
        cards: prev.cards.map((card) => {
          if (card.id !== cardId) return card;

          return {
            ...card,
            uploadState: {
              status: "idle",
              progress: 0,
              ...card.uploadState,
              ...patch,
            },
          };
        }),
      }));
    },
    [setUploadCards],
  );

  const triggerUpload = useCallback(
    (cardId: string, file: File, uploadedFile: UploadedFileInfo) => {
      if (!onUpload) return;

      abortControllersRef.current.get(cardId)?.abort();
      const controller = new AbortController();

      abortControllersRef.current.set(cardId, controller);
      updateCardUploadState(cardId, {status: "uploading", progress: 0, file, error: undefined});

      onUpload(file, {
        onProgress: (progress) => {
          updateCardUploadState(cardId, {progress: Math.min(Math.max(progress, 0), 1)});
        },
        signal: controller.signal,
      })
        .then((result) => {
          abortControllersRef.current.delete(cardId);
          updateCardUploadState(cardId, {status: "success", progress: 1, result});
          onUploadSuccess?.(uploadedFile, result);
        })
        .catch((error) => {
          if (controller.signal.aborted) return;

          abortControllersRef.current.delete(cardId);
          updateCardUploadState(cardId, {status: "error", error});
          onUploadError?.(uploadedFile, error);
        });
    },
    [onUpload, onUploadError, onUploadSuccess, updateCardUploadState],
  );

  const commitFiles = useCallback(
    (files: File[]) => {
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
      const pendingUploads: PendingUploadTarget[] = [];

      resolution.acceptedFiles.forEach((file) => {
        const uploadedFile = toUploadedFileInfo(file);
        const emptyCardIndex = emptyCardIndexes.shift();

        if (typeof emptyCardIndex === "number") {
          const reusedCard = nextUploadCards[emptyCardIndex];
          const nextCard = {
            ...reusedCard,
            uploadedFile,
            uploadState: {
              ...reusedCard.uploadState,
              status: "idle" as const,
              progress: 0,
              file,
              error: undefined,
            },
          };

          nextUploadCards[emptyCardIndex] = nextCard;
          pendingUploads.push({cardId: nextCard.id, file, uploadedFile});

          return;
        }

        const nextCard = {
          ...createUploadCard(uploadedFile),
          uploadState: {
            status: "idle" as const,
            progress: 0,
            file,
          },
        };

        nextUploadCards.push(nextCard);
        pendingUploads.push({cardId: nextCard.id, file, uploadedFile});
      });

      const normalizedUploadCards = normalizeUploadCards(nextUploadCards, false);
      const nextUploadedFiles = getUploadedFiles(normalizedUploadCards);
      const shouldAppendIdleCard =
        !hasIdleUploadCard(normalizedUploadCards) && nextUploadedFiles.length < maxFilesLimit;
      const finalCards =
        disableAnimation && shouldAppendIdleCard
          ? (finalizeAppendIdleCard(normalizedUploadCards) ?? normalizedUploadCards)
          : normalizedUploadCards;

      setUploadCards({
        cards: finalCards,
        pendingAnimationAction:
          !disableAnimation && shouldAppendIdleCard ? {type: "append-idle-card"} : null,
      });
      setValidationMessage(resolution.validationMessage);
      notifyUploadedFilesChange(currentUploadedFiles, nextUploadedFiles);

      return {
        ...resolution,
        finalCards,
        nextUploadedFiles,
        pendingUploads,
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
      notifyUploadedFilesChange,
      setUploadCards,
    ],
  );

  const handleDrop = useCallback(
    async (event: DropEvent) => {
      const droppedItems = getFileDropItems(event.items);
      const droppedFiles = await getFilesFromDropItems(droppedItems);
      const {acceptedIndexes, pendingUploads} = commitFiles(droppedFiles);
      const acceptedDropItems = acceptedIndexes.map((index) => droppedItems[index]).filter(Boolean);

      pendingUploads.forEach(({cardId, file, uploadedFile}) => {
        triggerUpload(cardId, file, uploadedFile);
      });
      onDrop?.({
        ...event,
        items: acceptedDropItems,
      });
    },
    [commitFiles, onDrop, triggerUpload],
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files?.length) return;

      const {acceptedFiles, pendingUploads} = commitFiles(Array.from(files));

      pendingUploads.forEach(({cardId, file, uploadedFile}) => {
        triggerUpload(cardId, file, uploadedFile);
      });
      onDrop?.({
        type: "drop",
        items: createDropItemsFromFiles(acceptedFiles),
        x: 0,
        y: 0,
        dropOperation: "copy",
      } satisfies DropEvent);
      event.target.value = "";
    },
    [commitFiles, onDrop, triggerUpload],
  );

  const removeUploadedFile = useCallback(
    (cardId: string) => {
      const currentUploadCards = uploadCardsStateRef.current.cards;
      const previousUploadedFiles = getUploadedFiles(currentUploadCards);
      let removedUploadedFile: UploadedFileInfo | null = null;
      const nextUploadCards = currentUploadCards.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        removedUploadedFile = card.uploadedFile;

        return {
          ...card,
          uploadedFile: null,
          uploadState: undefined,
        };
      });
      const nextUploadedFiles = getUploadedFiles(nextUploadCards);

      abortControllersRef.current.get(cardId)?.abort();
      abortControllersRef.current.delete(cardId);

      setUploadCards({
        cards: disableAnimation ? finalizeUploadCardsOrder(nextUploadCards) : nextUploadCards,
        pendingAnimationAction: disableAnimation ? null : {type: "finalize-remove", cardId},
      });
      setValidationMessage(null);
      notifyUploadedFilesChange(previousUploadedFiles, nextUploadedFiles);

      if (removedUploadedFile) {
        onRemove?.(removedUploadedFile, nextUploadedFiles);
      }
    },
    [
      disableAnimation,
      finalizeUploadCardsOrder,
      notifyUploadedFilesChange,
      onRemove,
      setUploadCards,
    ],
  );

  const retryUpload = useCallback(
    (cardId: string) => {
      const card = uploadCardsStateRef.current.cards.find(
        (currentCard) => currentCard.id === cardId,
      );

      if (!card?.uploadedFile || !card.uploadState?.file) return;

      triggerUpload(cardId, card.uploadState.file, card.uploadedFile);
    },
    [triggerUpload],
  );

  const clearUploadedFiles = useCallback(() => {
    const previousUploadedFiles = getUploadedFiles(uploadCardsStateRef.current.cards);

    abortControllersRef.current.forEach((controller) => controller.abort());
    abortControllersRef.current.clear();

    setUploadCards({
      cards: normalizeUploadCards([]),
      pendingAnimationAction: null,
    });
    setValidationMessage(null);
    notifyUploadedFilesChange(previousUploadedFiles, []);
  }, [normalizeUploadCards, notifyUploadedFilesChange, setUploadCards]);

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
    uploadedFiles: getUploadedFiles(uploadCardsState.cards),
    validationMessage,
    clearUploadedFiles,
    removeUploadedFile,
    retryUpload,
    handleDrop,
    handleFileChange,
    handleUploadCardContentAnimationComplete,
  };
}
