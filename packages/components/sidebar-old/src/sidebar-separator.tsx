import type {DividerProps} from "@sytechui/divider";

import {Divider} from "@sytechui/divider";
import {cn} from "@sytechui/theme";

export type SidebarSeparatorProps = DividerProps;

const SidebarSeparator = ({className, ...props}: SidebarSeparatorProps) => (
  <Divider className={cn("my-2", className)} data-slot="separator" {...props} />
);

export {SidebarSeparator};
