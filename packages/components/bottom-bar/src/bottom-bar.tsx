import type {UseBottomBarProps} from "./use-bottom-bar";
import type {BottomBarItemProps} from "./bottom-bar-item";

import {Children, isValidElement, useCallback, useEffect, useRef} from "react";
import {forwardRef} from "@sytechui/system";

import {BottomBarItemKeyProvider, BottomBarProvider} from "./bottom-bar-context";
import {useBottomBar} from "./use-bottom-bar";

export interface BottomBarProps extends UseBottomBarProps {}

const BottomBar = forwardRef<"nav", BottomBarProps>((props, ref) => {
  const context = useBottomBar({...props, ref});
  const Component = context.Component;
  const listRef = useRef<HTMLUListElement>(null);
  const selectionIndicatorRef = useRef<HTMLLIElement>(null);

  const items = Children.map(context.children, (child, index) => {
    if (!isValidElement<BottomBarItemProps>(child)) {
      return child;
    }

    const itemKey = child.key ?? index;

    return (
      <BottomBarItemKeyProvider key={itemKey} value={itemKey}>
        {child}
      </BottomBarItemKeyProvider>
    );
  });

  const updateSelectionIndicator = useCallback(() => {
    const list = listRef.current;
    const indicator = selectionIndicatorRef.current;
    const selectedLink = list?.querySelector<HTMLElement>(
      '[data-slot="link"][data-selected="true"]',
    );

    if (!list || !indicator || !selectedLink) return;

    const listRect = list.getBoundingClientRect();
    const linkRect = selectedLink.getBoundingClientRect();

    if (linkRect.width === 0 && linkRect.height === 0) return;

    const isProminent = selectedLink.dataset.prominent === "true";
    const insetX = isProminent ? 2 : 4;
    const insetY = isProminent ? 2 : 3;

    indicator.style.left = `${linkRect.left - listRect.left - list.clientLeft + insetX}px`;
    indicator.style.top = `${linkRect.top - listRect.top - list.clientTop + insetY}px`;
    indicator.style.width = `${Math.max(0, linkRect.width - insetX * 2)}px`;
    indicator.style.height = `${Math.max(0, linkRect.height - insetY * 2)}px`;
    indicator.setAttribute("data-initialized", "true");
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const indicator = selectionIndicatorRef.current;
    const selectedLink = list?.querySelector<HTMLElement>(
      '[data-slot="link"][data-selected="true"]',
    );

    if (!list || !indicator || !selectedLink) return;

    updateSelectionIndicator();

    const observer = new ResizeObserver(updateSelectionIndicator);

    observer.observe(list);
    observer.observe(selectedLink);

    const animationFrame = requestAnimationFrame(() => {
      indicator.setAttribute("data-animated", "true");
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [context.children, context.selectedKey, updateSelectionIndicator]);

  return (
    <BottomBarProvider value={context}>
      <Component {...context.getBaseProps()}>
        <ul {...context.getListProps({ref: listRef})}>
          <li
            {...context.getSelectionIndicatorProps()}
            ref={selectionIndicatorRef}
            role="presentation"
          />
          {items}
        </ul>
      </Component>
    </BottomBarProvider>
  );
});

BottomBar.displayName = "HeroUI.BottomBar";

export default BottomBar;
