import ScrollArea from "./scroll-area";
import ScrollBar from "./scroll-bar";

export type {ScrollAreaProps} from "./scroll-area";
export type {ScrollBarProps} from "./scroll-bar";
export type {UseScrollAreaProps} from "./use-scroll-area";
export type {
  ScrollOverflowCheck as ScrollAreaOrientation,
  ScrollOverflowVisibility as ScrollAreaVisibility,
} from "@heroui/use-data-scroll-overflow";

export {useScrollArea} from "./use-scroll-area";
export {ScrollArea, ScrollBar};
