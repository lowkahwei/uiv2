import type {
  DropZoneCardState,
  OnPreviewErrorHandler,
  PreviewResolver,
  UploadCardUploadState,
} from "../types";

import {useCallback, useEffect, useRef, useState} from "react";

import {getLocalFilePreviewKey, getUploadedFileKey, isLikelyImageFile} from "../drop-zone-utils";

interface PreviewEntry {
  file?: File;
  key: string;
  source: "object-url" | "remote-url";
  value: string;
}

interface ManagedPreviewState {
  abortController?: AbortController;
  base?: PreviewEntry;
  error?: unknown;
  isLoading: boolean;
  resolveKey?: string;
  resolved?: PreviewEntry;
  resolvedSize?: number;
}

export interface DropZoneCardPreviewState {
  error?: unknown;
  isLoading: boolean;
  resolvedSize?: number;
  url?: string;
}

function getUploadStatePreviewKey(uploadState: UploadCardUploadState | undefined) {
  return [
    getLocalFilePreviewKey(uploadState?.file),
    typeof uploadState?.result?.url === "string" ? uploadState.result.url : "",
    typeof uploadState?.result?.path === "string" ? uploadState.result.path : "",
    typeof uploadState?.result?.fullPath === "string" ? uploadState.result.fullPath : "",
  ].join("::");
}

function revokePreviewEntry(entry: PreviewEntry | undefined) {
  if (entry?.source === "object-url") {
    URL.revokeObjectURL(entry.value);
  }
}

function getBasePreviewEntry(
  card: DropZoneCardState,
  previousEntry: PreviewEntry | undefined,
): PreviewEntry | undefined {
  if (!card.uploadedFile || !isLikelyImageFile(card.uploadedFile)) {
    return undefined;
  }

  const resultUrl =
    typeof card.uploadState?.result?.url === "string" ? card.uploadState.result.url : null;

  if (resultUrl) {
    if (previousEntry?.source === "remote-url" && previousEntry.value === resultUrl) {
      return previousEntry;
    }

    return {
      key: `${getUploadedFileKey(card.uploadedFile)}::${resultUrl}`,
      source: "remote-url",
      value: resultUrl,
    };
  }

  const file = card.uploadState?.file;

  if (!file || !isLikelyImageFile(file)) {
    return undefined;
  }

  if (
    previousEntry?.source === "object-url" &&
    previousEntry.file === file &&
    previousEntry.value
  ) {
    return previousEntry;
  }

  return {
    file,
    key: `${getUploadedFileKey(card.uploadedFile)}::${getLocalFilePreviewKey(file)}`,
    source: "object-url",
    value: URL.createObjectURL(file),
  };
}

export function useDropZonePreviews({
  uploadCards,
  previewResolver,
  onPreviewError,
}: {
  uploadCards: DropZoneCardState[];
  previewResolver?: PreviewResolver;
  onPreviewError?: OnPreviewErrorHandler;
}) {
  const previewStateRef = useRef<Record<string, ManagedPreviewState>>({});
  const [previewStateByCardId, setPreviewStateByCardId] = useState<
    Record<string, DropZoneCardPreviewState>
  >({});
  const publishPreviewState = useCallback(() => {
    const nextPreviewState = Object.fromEntries(
      Object.entries(previewStateRef.current)
        .map(([cardId, state]) => {
          const url = state.resolved?.value ?? state.base?.value;

          if (
            !url &&
            !state.isLoading &&
            state.error === undefined &&
            state.resolvedSize === undefined
          ) {
            return null;
          }

          return [
            cardId,
            {
              error: state.error,
              isLoading: state.isLoading,
              resolvedSize: state.resolvedSize,
              url,
            },
          ] as const;
        })
        .filter(Boolean) as [string, DropZoneCardPreviewState][],
    );

    setPreviewStateByCardId(nextPreviewState);
  }, []);

  useEffect(() => {
    const activePreviewCardIds = new Set<string>();

    uploadCards.forEach((card) => {
      if (!card.uploadedFile || !isLikelyImageFile(card.uploadedFile)) {
        return;
      }

      const uploadedFile = card.uploadedFile;

      activePreviewCardIds.add(card.id);
      const previewState = previewStateRef.current[card.id] ?? {isLoading: false};
      const nextBaseEntry = getBasePreviewEntry(card, previewState.base);

      if (previewState.base !== nextBaseEntry) {
        revokePreviewEntry(previewState.base);
      }

      previewState.base = nextBaseEntry;
      previewStateRef.current[card.id] = previewState;

      const shouldResolvePreview = !!previewResolver && !nextBaseEntry;

      if (!shouldResolvePreview) {
        previewState.abortController?.abort();
        previewState.abortController = undefined;
        previewState.resolveKey = undefined;
        revokePreviewEntry(previewState.resolved);
        previewState.resolved = undefined;
        previewState.isLoading = false;
        previewState.error = undefined;
        previewState.resolvedSize = undefined;

        return;
      }

      const resolveKey = `${getUploadedFileKey(uploadedFile)}::${getUploadStatePreviewKey(card.uploadState)}`;

      if (previewState.resolveKey === resolveKey) {
        return;
      }

      previewState.abortController?.abort();
      previewState.abortController = undefined;
      previewState.resolveKey = resolveKey;
      revokePreviewEntry(previewState.resolved);
      previewState.resolved = undefined;
      previewState.isLoading = true;
      previewState.error = undefined;
      previewState.resolvedSize = undefined;

      const controller = new AbortController();

      previewState.abortController = controller;

      void Promise.resolve()
        .then(() =>
          previewResolver({
            uploadedFile,
            uploadState: card.uploadState,
            signal: controller.signal,
          }),
        )
        .then((previewSource) => {
          if (controller.signal.aborted) {
            return;
          }

          const currentPreviewState = previewStateRef.current[card.id];

          if (
            !currentPreviewState ||
            currentPreviewState.abortController !== controller ||
            currentPreviewState.resolveKey !== resolveKey
          ) {
            return;
          }

          currentPreviewState.abortController = undefined;
          currentPreviewState.isLoading = false;

          if (!previewSource) {
            const noSourceError = new Error("Preview resolver returned no source.");

            currentPreviewState.error = noSourceError;
            onPreviewError?.(uploadedFile, noSourceError);
            publishPreviewState();

            return;
          }

          currentPreviewState.error = undefined;
          currentPreviewState.resolved =
            typeof previewSource === "string"
              ? {
                  key: resolveKey,
                  source: "remote-url",
                  value: previewSource,
                }
              : {
                  key: resolveKey,
                  source: "object-url",
                  value: URL.createObjectURL(previewSource),
                };
          currentPreviewState.resolvedSize =
            previewSource instanceof Blob && previewSource.size > 0
              ? previewSource.size
              : undefined;
          publishPreviewState();
        })
        .catch((error) => {
          if (
            controller.signal.aborted ||
            (error instanceof DOMException && error.name === "AbortError")
          ) {
            return;
          }

          const currentPreviewState = previewStateRef.current[card.id];

          if (!currentPreviewState || currentPreviewState.abortController !== controller) {
            return;
          }

          currentPreviewState.abortController = undefined;
          currentPreviewState.isLoading = false;
          currentPreviewState.error = error;
          onPreviewError?.(uploadedFile, error);
          publishPreviewState();
        });
    });

    Object.entries(previewStateRef.current).forEach(([cardId, state]) => {
      if (activePreviewCardIds.has(cardId)) {
        return;
      }

      state.abortController?.abort();
      revokePreviewEntry(state.base);
      revokePreviewEntry(state.resolved);
      delete previewStateRef.current[cardId];
    });

    publishPreviewState();
  }, [onPreviewError, previewResolver, publishPreviewState, uploadCards]);

  useEffect(() => {
    return () => {
      Object.values(previewStateRef.current).forEach((state) => {
        state.abortController?.abort();
        revokePreviewEntry(state.base);
        revokePreviewEntry(state.resolved);
      });
      previewStateRef.current = {};
    };
  }, []);

  return previewStateByCardId;
}
