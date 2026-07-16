import type {PointerEvent} from "react";
import type {DrawerPlacement} from "./use-drawer";

import {useCallback, useRef} from "react";

const DRAG_THRESHOLD = 8;
const DISMISS_FRACTION = 0.3;
const VELOCITY_THRESHOLD = 0.5;
const SNAP_BACK_TRANSITION = "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)";

interface UseDrawerSwipeProps {
  onClose: () => void;
  placement: DrawerPlacement;
}

export function useDrawerSwipe({onClose, placement}: UseDrawerSwipeProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const isDragging = useRef(false);
  const isActive = useRef(false);
  const startPosition = useRef(0);
  const currentOffset = useRef(0);
  const velocity = useRef(0);
  const lastPosition = useRef(0);
  const lastTime = useRef(0);
  const initialTransform = useRef("");
  const initialTransition = useRef("");

  const isVertical = placement === "top" || placement === "bottom";
  const dismissDirection = placement === "bottom" || placement === "right" ? 1 : -1;

  const getPosition = useCallback(
    (event: PointerEvent<HTMLDivElement>) => (isVertical ? event.clientY : event.clientX),
    [isVertical],
  );

  const resetPanel = useCallback((animate: boolean) => {
    const panel = panelRef.current;

    if (!panel) return;

    if (!animate) {
      panel.style.transform = initialTransform.current;
      panel.style.transition = initialTransition.current;

      return;
    }

    panel.style.transition = SNAP_BACK_TRANSITION;
    panel.style.transform = initialTransform.current;

    panel.addEventListener(
      "transitionend",
      () => {
        panel.style.transition = initialTransition.current;
      },
      {once: true},
    );
  }, []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button > 0) return;

      const panel = event.currentTarget.closest<HTMLElement>("[role='dialog']");

      if (!panel) return;

      const position = getPosition(event);

      panelRef.current = panel;
      isDragging.current = true;
      isActive.current = false;
      startPosition.current = position;
      currentOffset.current = 0;
      velocity.current = 0;
      lastPosition.current = position;
      lastTime.current = performance.now();
      initialTransform.current = panel.style.transform;
      initialTransition.current = panel.style.transition;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [getPosition],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const panel = panelRef.current;

      if (!isDragging.current || !panel) return;

      const position = getPosition(event);
      const rawOffset = position - startPosition.current;
      const offset = dismissDirection > 0 ? Math.max(0, rawOffset) : Math.min(0, rawOffset);

      if (!isActive.current) {
        if (Math.abs(offset) < DRAG_THRESHOLD) return;

        isActive.current = true;
        panel.style.transition = "none";
      }

      currentOffset.current = offset;

      const now = performance.now();
      const elapsed = now - lastTime.current;

      if (elapsed > 0) {
        velocity.current = (position - lastPosition.current) / elapsed;
        lastPosition.current = position;
        lastTime.current = now;
      }

      const x = isVertical ? 0 : offset;
      const y = isVertical ? offset : 0;
      const baseTransform = initialTransform.current;

      panel.style.transform = `${baseTransform ? `${baseTransform} ` : ""}translate3d(${x}px, ${y}px, 0)`;
    },
    [dismissDirection, getPosition, isVertical],
  );

  const finishDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>, allowDismiss: boolean) => {
      if (!isDragging.current) return;

      isDragging.current = false;

      const panel = panelRef.current;

      try {
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      } catch {
        // Pointer capture may already be released after a cancelled gesture.
      }

      if (!panel || !isActive.current) {
        isActive.current = false;

        return;
      }

      isActive.current = false;

      const dimension = isVertical ? panel.offsetHeight : panel.offsetWidth;
      const distanceReached = Math.abs(currentOffset.current) > dimension * DISMISS_FRACTION;
      const velocityReached = velocity.current * dismissDirection > VELOCITY_THRESHOLD;

      if (allowDismiss && (distanceReached || velocityReached)) {
        onClose();
      } else {
        resetPanel(true);
      }

      currentOffset.current = 0;
      velocity.current = 0;
    },
    [dismissDirection, isVertical, onClose, resetPanel],
  );

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => finishDrag(event, true),
    [finishDrag],
  );

  const onPointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => finishDrag(event, false),
    [finishDrag],
  );

  return {onPointerCancel, onPointerDown, onPointerMove, onPointerUp};
}
