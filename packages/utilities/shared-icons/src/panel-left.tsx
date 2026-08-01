import type {IconSvgProps} from "./types";

export const PanelLeftIcon = ({strokeWidth = 1.8, ...props}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <rect height="16" rx="2" width="18" x="3" y="4" />
    <path d="M9 4v16" />
  </svg>
);
