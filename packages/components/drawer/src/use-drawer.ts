import type {ModalProps} from "@sytechui/modal";
import type {ReactRef} from "@sytechui/react-utils";
import type {PropGetter} from "@sytechui/system";
import type {CSSProperties} from "react";

import {drawer, cn} from "@sytechui/theme";
import {useDOMRef} from "@sytechui/react-utils";
import {useCallback, useMemo} from "react";
import {isEmpty} from "@sytechui/shared-utils";

export interface DrawerMotionDuration {
  /** Enter duration in seconds. @default 0.25 */
  enter?: number;
  /** Exit duration in seconds. @default 0.28 */
  exit?: number;
}

interface DrawerStyle extends CSSProperties {
  "--drawer-enter-duration"?: string;
  "--drawer-exit-duration"?: string;
}

const getDuration = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;

interface Props extends Omit<ModalProps, "placement" | "scrollBehavior" | "children"> {
  /**
   * Ref to the DOM node.
   */
  ref?: ReactRef<HTMLElement | null>;
  /**
   * The placement of the drawer.
   */
  placement?: "top" | "right" | "bottom" | "left";
  /**
   * The scroll behavior of the drawer.
   */
  scrollBehavior?: "inside" | "outside";
  /**
   * Whether to show a swipe handle and enable swipe-to-close behavior.
   * @default false
   */
  showSwipeHandle?: boolean;
  /**
   * The native drawer enter and exit durations in seconds.
   */
  motionDuration?: DrawerMotionDuration;
}

export type UseDrawerProps = Props;
export type DrawerPlacement = NonNullable<Props["placement"]>;

export function useDrawer(originalProps: UseDrawerProps) {
  const {
    ref,
    className,
    classNames,
    placement = "right",
    scrollBehavior = "inside",
    showSwipeHandle = false,
    motionDuration,
    size = "md",
    motionProps: drawerMotionProps,
    style,
    ...otherProps
  } = originalProps;

  const domRef = useDOMRef(ref);
  const nativeMotion = isEmpty(drawerMotionProps);
  const isSwipeEnabled = showSwipeHandle && otherProps.isDismissable !== false;
  const enterDuration = getDuration(motionDuration?.enter, 0.25);
  const exitDuration = getDuration(motionDuration?.exit, 0.28);

  const motionProps = useMemo(() => {
    if (!nativeMotion) return drawerMotionProps;

    return {
      variants: {
        enter: {
          opacity: 1,
          transition: {duration: 0},
        },
        exit: {
          opacity: 0.999,
          transition: {duration: exitDuration},
        },
      },
    };
  }, [drawerMotionProps, exitDuration, nativeMotion]);

  const drawerStyle = useMemo<DrawerStyle>(
    () => ({
      ...style,
      "--drawer-enter-duration": `${enterDuration}s`,
      "--drawer-exit-duration": `${exitDuration}s`,
    }),
    [enterDuration, exitDuration, style],
  );

  const baseStyles = cn(classNames?.base, className);

  const slots = useMemo(
    () =>
      drawer({
        nativeMotion,
        size,
        placement,
      }),
    [nativeMotion, size, placement],
  );

  const getModalProps = useCallback<PropGetter>(() => {
    return {
      classNames: {
        ...classNames,
        base: slots.base({class: baseStyles}),
        wrapper: cn("overflow-hidden", classNames?.wrapper),
      },
      motionProps,
      scrollBehavior,
      size,
      ...otherProps,
      style: drawerStyle,
    };
  }, [baseStyles, classNames, drawerStyle, motionProps, scrollBehavior, size, otherProps]);

  return {
    domRef,
    getModalProps,
    drawerContext: {
      placement,
      showSwipeHandle: isSwipeEnabled,
      slots,
    },
  };
}

export type UseDrawerReturn = ReturnType<typeof useDrawer>;
