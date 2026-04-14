import type {DropZoneProps, UploadCardUploadState, UploadedFileInfo} from "./types";
import type {DropZoneCardRenderProps} from "./card/types";

import {forwardRef} from "@heroui/system";
import {AnimatePresence, LazyMotion, domAnimation, m} from "framer-motion";
import {useEffect, useMemo, useRef, useState} from "react";

import {CARD_CONTENT_TRANSITION, UPLOAD_CARD_LIST_ITEM_MOTION} from "./card/constants";
import {UploadCard} from "./card/upload-card";
import {formatFileSize, formatUploadedFileType, isLikelyImageFile} from "./drop-zone-utils";
import {useDropZone} from "./use-drop-zone";

export type {DropZoneProps} from "./types";

interface PreviewEntry {
  file?: File;
  key: string;
  source: "object-url" | "remote-url";
  value: string;
}

function getUploadedFilePreviewKey(uploadedFile: UploadedFileInfo | null | undefined) {
  if (!uploadedFile) {
    return "";
  }

  return `${uploadedFile.name}::${uploadedFile.size}::${uploadedFile.type}`;
}

function getUploadStatePreviewKey(uploadState: UploadCardUploadState | undefined) {
  const file = uploadState?.file;
  const result = uploadState?.result;
  const resultKey =
    result && typeof result === "object"
      ? JSON.stringify(
          Object.keys(result)
            .sort()
            .reduce<Record<string, unknown>>((acc, key) => {
              acc[key] = result[key];

              return acc;
            }, {}),
        )
      : "";

  return `${file?.name ?? ""}::${file?.size ?? ""}::${file?.type ?? ""}::${file?.lastModified ?? ""}::${resultKey}`;
}

const DropZone = forwardRef<"div", DropZoneProps>((props, ref) => {
  const {isPreview = false, previewResolver, onPreviewError, previewErrorMessage} = props;

  const {
    Component,
    children,
    title,
    icon,
    hideIcon,
    state,
    disableAnimation,
    removeUploadedFile,
    retryUpload,
    handleUploadCardContentAnimationComplete,
    getBaseProps,
    getInputProps,
    getUploadTriggerProps,
    getContentProps,
    getUploadCardWrapperProps,
    getUploadCardProps,
    getUploadCardOverlayProps,
    getUploadedContentProps,
    getIdleContentProps,
    getIdleCardProps,
    getIdleLabelProps,
    getIconWrapperProps,
    getIconProps,
    getDetailCardProps,
    getClearButtonProps,
    getClearButtonIconProps,
    getFileIconWrapperProps,
    getFileIconProps,
    getFileTypeBadgeProps,
    getFileInfoProps,
    getFileNameProps,
    getFileMetaProps,
    getPreviewWrapperProps,
    getPreviewImageProps,
    getTitleProps,
    getHelperTextProps,
  } = useDropZone({...props, ref});
  const previewEntriesRef = useRef<Record<string, PreviewEntry>>({});
  const resolvedPreviewEntriesRef = useRef<Record<string, PreviewEntry>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [resolvedPreviewUrls, setResolvedPreviewUrls] = useState<Record<string, string>>({});
  const [pendingPreviewCardIds, setPendingPreviewCardIds] = useState<Set<string>>(new Set());
  // blob size resolved by previewResolver (overrides the potentially 0-sized fileList entry)
  const [resolvedPreviewSizes, setResolvedPreviewSizes] = useState<Record<string, number>>({});
  // per-card preview load errors from previewResolver
  const [previewErrors, setPreviewErrors] = useState<Record<string, unknown>>({});

  const sharedCardProps = useMemo<
    Omit<
      DropZoneCardRenderProps,
      "uploadedFile" | "uploadedFileSize" | "uploadedFileType" | "removeUploadedFile"
    >
  >(
    () => ({
      disableAnimation,
      getClearButtonIconProps,
      getClearButtonProps,
      getDetailCardProps,
      getFileIconProps,
      getFileIconWrapperProps,
      getFileInfoProps,
      getFileMetaProps,
      getFileNameProps,
      getFileTypeBadgeProps,
      getIconProps,
      getIconWrapperProps,
      getIdleCardProps,
      getIdleContentProps,
      getIdleLabelProps,
      getUploadTriggerProps,
      getUploadCardOverlayProps,
      getUploadCardProps,
      getUploadCardWrapperProps,
      getUploadedContentProps,
      hideIcon,
      icon,
      state,
      title,
    }),
    [
      disableAnimation,
      getClearButtonIconProps,
      getClearButtonProps,
      getDetailCardProps,
      getFileIconProps,
      getFileIconWrapperProps,
      getFileInfoProps,
      getFileMetaProps,
      getFileNameProps,
      getFileTypeBadgeProps,
      getIconProps,
      getIconWrapperProps,
      getIdleCardProps,
      getIdleContentProps,
      getIdleLabelProps,
      getUploadTriggerProps,
      getUploadCardOverlayProps,
      getUploadCardProps,
      getUploadCardWrapperProps,
      getUploadedContentProps,
      hideIcon,
      icon,
      state,
      title,
    ],
  );

  const renderCard = (card: (typeof state.uploadCards)[number]) => {
    const resolvedSize = resolvedPreviewSizes[card.id];
    const effectiveSize =
      card.uploadedFile && resolvedSize !== undefined
        ? resolvedSize
        : (card.uploadedFile?.size ?? 0);
    const cardProps: DropZoneCardRenderProps = {
      ...sharedCardProps,
      uploadedFile: card.uploadedFile,
      uploadedFileSize: card.uploadedFile ? formatFileSize(effectiveSize) : null,
      uploadedFileType: card.uploadedFile
        ? formatUploadedFileType(card.uploadedFile.type, card.uploadedFile.name)
        : "",
      removeUploadedFile: card.uploadedFile ? () => removeUploadedFile(card.id) : undefined,
      retryUpload: card.uploadedFile ? () => retryUpload(card.id) : undefined,
      uploadState: card.uploadState,
      previewError: previewErrors[card.id],
      previewErrorMessage,
    };

    return (
      <UploadCard
        key={card.id}
        cardProps={cardProps}
        isInteractive={card.uploadedFile === null}
        onContentAnimationComplete={() =>
          handleUploadCardContentAnimationComplete(card.id, card.uploadedFile)
        }
      />
    );
  };

  const cards = disableAnimation ? (
    <div className="flex w-full flex-col items-center gap-3">
      {state.uploadCards.map(renderCard)}
    </div>
  ) : (
    <LazyMotion features={domAnimation}>
      <m.div layout className="flex w-full flex-col items-center gap-3">
        <AnimatePresence initial={false}>
          {state.uploadCards.map((card) => (
            <m.div
              key={card.id}
              layout
              animate={UPLOAD_CARD_LIST_ITEM_MOTION.animate}
              className="w-full"
              exit={UPLOAD_CARD_LIST_ITEM_MOTION.exit}
              initial={UPLOAD_CARD_LIST_ITEM_MOTION.initial}
              transition={CARD_CONTENT_TRANSITION}
            >
              {renderCard(card)}
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>
    </LazyMotion>
  );

  const hasDetailCard = state.uploadCards.some((card) => card.uploadedFile !== null);
  const mergedPreviewUrls = useMemo(
    () => ({
      ...previewUrls,
      ...resolvedPreviewUrls,
    }),
    [previewUrls, resolvedPreviewUrls],
  );

  const previewCards = state.uploadCards.filter((card) => {
    return (
      card.uploadedFile != null &&
      isLikelyImageFile(card.uploadedFile) &&
      mergedPreviewUrls[card.id]
    );
  });

  const loadingPreviewCards = state.uploadCards.filter((card) => {
    return (
      card.uploadedFile != null &&
      isLikelyImageFile(card.uploadedFile) &&
      pendingPreviewCardIds.has(card.id) &&
      !mergedPreviewUrls[card.id]
    );
  });

  useEffect(() => {
    const nextPreviewEntries: Record<string, PreviewEntry> = {};

    state.uploadCards.forEach((card) => {
      if (!card.uploadedFile || !isLikelyImageFile(card.uploadedFile)) {
        return;
      }

      const resultUrl =
        typeof card.uploadState?.result?.url === "string" ? card.uploadState.result.url : null;

      if (resultUrl) {
        nextPreviewEntries[card.id] = {
          key: `${getUploadedFilePreviewKey(card.uploadedFile)}::${resultUrl}`,
          source: "remote-url",
          value: resultUrl,
        };

        return;
      }

      const file = card.uploadState?.file;

      if (!file || !isLikelyImageFile(file)) {
        return;
      }

      const previousEntry = previewEntriesRef.current[card.id];

      if (
        previousEntry?.source === "object-url" &&
        previousEntry.file === file &&
        previousEntry.value
      ) {
        nextPreviewEntries[card.id] = previousEntry;

        return;
      }

      nextPreviewEntries[card.id] = {
        file,
        key: `${getUploadedFilePreviewKey(card.uploadedFile)}::${getUploadStatePreviewKey(card.uploadState)}`,
        source: "object-url",
        value: URL.createObjectURL(file),
      };
    });

    Object.entries(previewEntriesRef.current).forEach(([cardId, entry]) => {
      if (entry.source === "object-url" && nextPreviewEntries[cardId] !== entry) {
        URL.revokeObjectURL(entry.value);
      }
    });

    previewEntriesRef.current = nextPreviewEntries;
    setPreviewUrls(
      Object.fromEntries(
        Object.entries(nextPreviewEntries).map(([cardId, entry]) => [cardId, entry.value]),
      ),
    );
  }, [state.uploadCards]);

  useEffect(() => {
    if (!previewResolver) {
      Object.values(resolvedPreviewEntriesRef.current).forEach((entry) => {
        if (entry.source === "object-url") {
          URL.revokeObjectURL(entry.value);
        }
      });
      resolvedPreviewEntriesRef.current = {};
      setResolvedPreviewUrls({});
      setPendingPreviewCardIds(new Set());
      setResolvedPreviewSizes({});
      setPreviewErrors({});

      return;
    }

    const previewableCards = state.uploadCards.filter((card) => {
      return (
        card.uploadedFile != null &&
        (card.uploadState?.status === "success" || !card.uploadState?.file)
      );
    });
    const previewableCardIds = new Set(previewableCards.map((card) => card.id));

    Object.entries(resolvedPreviewEntriesRef.current).forEach(([cardId, entry]) => {
      if (!previewableCardIds.has(cardId)) {
        if (entry.source === "object-url") {
          URL.revokeObjectURL(entry.value);
        }
        delete resolvedPreviewEntriesRef.current[cardId];
      }
    });

    setPendingPreviewCardIds((prev) => {
      let changed = false;
      const next = new Set(prev);

      for (const id of next) {
        if (!previewableCardIds.has(id)) {
          next.delete(id);
          changed = true;
        }
      }

      return changed ? next : prev;
    });

    setPreviewErrors((prev) => {
      const keysToRemove = Object.keys(prev).filter((id) => !previewableCardIds.has(id));

      if (keysToRemove.length === 0) return prev;
      const next = {...prev};

      keysToRemove.forEach((id) => delete next[id]);

      return next;
    });

    setResolvedPreviewSizes((prev) => {
      const keysToRemove = Object.keys(prev).filter((id) => !previewableCardIds.has(id));

      if (keysToRemove.length === 0) return prev;
      const next = {...prev};

      keysToRemove.forEach((id) => delete next[id]);

      return next;
    });

    setResolvedPreviewUrls(
      Object.fromEntries(
        Object.entries(resolvedPreviewEntriesRef.current).map(([cardId, entry]) => [
          cardId,
          entry.value,
        ]),
      ),
    );

    const abortControllers = previewableCards.flatMap((card) => {
      if (!card.uploadedFile) {
        return [];
      }

      const key = `${getUploadedFilePreviewKey(card.uploadedFile)}::${getUploadStatePreviewKey(card.uploadState)}`;
      const existingEntry = resolvedPreviewEntriesRef.current[card.id];

      if (existingEntry?.key === key) {
        return [];
      }

      if (existingEntry?.source === "object-url") {
        URL.revokeObjectURL(existingEntry.value);
      }

      delete resolvedPreviewEntriesRef.current[card.id];
      setResolvedPreviewUrls((currentUrls) => {
        if (!(card.id in currentUrls)) {
          return currentUrls;
        }

        const nextUrls = {...currentUrls};

        delete nextUrls[card.id];

        return nextUrls;
      });

      const controller = new AbortController();

      setPendingPreviewCardIds((prev) => {
        if (prev.has(card.id)) return prev;
        const next = new Set(prev);

        next.add(card.id);

        return next;
      });

      void Promise.resolve(
        previewResolver({
          uploadedFile: card.uploadedFile,
          uploadState: card.uploadState,
          signal: controller.signal,
        }),
      )
        .then((previewSource) => {
          if (controller.signal.aborted) {
            return;
          }

          setPendingPreviewCardIds((prev) => {
            if (!prev.has(card.id)) return prev;
            const next = new Set(prev);

            next.delete(card.id);

            return next;
          });

          if (!previewSource) {
            // null/undefined return is treated as a load failure
            const noSourceError = new Error("Preview resolver returned no source.");

            setPreviewErrors((prev) => ({...prev, [card.id]: noSourceError}));
            onPreviewError?.(card.uploadedFile!, noSourceError);

            return;
          }

          const nextEntry: PreviewEntry =
            typeof previewSource === "string"
              ? {
                  key,
                  source: "remote-url",
                  value: previewSource,
                }
              : {
                  key,
                  source: "object-url",
                  value: URL.createObjectURL(previewSource),
                };

          // Extract resolved size from Blob/File so the card can display the real file size
          const resolvedSize =
            previewSource instanceof Blob && previewSource.size > 0
              ? previewSource.size
              : undefined;

          if (resolvedSize !== undefined) {
            setResolvedPreviewSizes((prev) => ({...prev, [card.id]: resolvedSize}));
          }

          const previousEntry = resolvedPreviewEntriesRef.current[card.id];

          if (previousEntry?.source === "object-url" && previousEntry.value !== nextEntry.value) {
            URL.revokeObjectURL(previousEntry.value);
          }

          resolvedPreviewEntriesRef.current[card.id] = nextEntry;
          setResolvedPreviewUrls((currentUrls) => ({
            ...currentUrls,
            [card.id]: nextEntry.value,
          }));
        })
        .catch((error) => {
          if (
            controller.signal.aborted ||
            (error instanceof DOMException && error.name === "AbortError")
          ) {
            return;
          }

          setPendingPreviewCardIds((prev) => {
            if (!prev.has(card.id)) return prev;
            const next = new Set(prev);

            next.delete(card.id);

            return next;
          });

          setPreviewErrors((prev) => ({...prev, [card.id]: error}));
          onPreviewError?.(card.uploadedFile!, error);
        });

      return [controller];
    });

    return () => {
      abortControllers.forEach((controller) => controller.abort());
    };
  }, [previewResolver, state.uploadCards]);

  useEffect(() => {
    return () => {
      Object.values(previewEntriesRef.current).forEach((entry) => {
        if (entry.source === "object-url") {
          URL.revokeObjectURL(entry.value);
        }
      });
      Object.values(resolvedPreviewEntriesRef.current).forEach((entry) => {
        if (entry.source === "object-url") {
          URL.revokeObjectURL(entry.value);
        }
      });
    };
  }, []);

  const content =
    typeof children === "function" ? (
      children(state)
    ) : children ? (
      children
    ) : (
      <div {...getContentProps()}>
        {cards}
        {isPreview && (previewCards.length > 0 || loadingPreviewCards.length > 0) ? (
          <div {...getPreviewWrapperProps()}>
            {previewCards.map((card) => (
              <img
                key={`${card.id}-preview`}
                alt={card.uploadedFile?.name ?? "Uploaded image preview"}
                src={mergedPreviewUrls[card.id]}
                {...getPreviewImageProps()}
              />
            ))}
            {loadingPreviewCards.map((card) => (
              <div
                key={`${card.id}-preview-loading`}
                aria-busy="true"
                aria-label={`Loading preview for ${card.uploadedFile?.name ?? "image"}`}
                className={`${getPreviewImageProps().className ?? ""} animate-pulse bg-default-100`}
                role="img"
                style={{minHeight: "6rem"}}
              />
            ))}
          </div>
        ) : null}
        {title && !hasDetailCard ? <div {...getTitleProps()}>{title}</div> : null}
        {state.validationMessage ? (
          <div {...getHelperTextProps()}>{state.validationMessage}</div>
        ) : null}
      </div>
    );

  return (
    <Component {...getBaseProps()}>
      <input {...getInputProps()} />
      {content}
    </Component>
  );
});

DropZone.displayName = "HeroUI.DropZone";

export default DropZone;
