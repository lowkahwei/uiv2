import type {SVGProps} from "react";

export function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M7 18.25h10c2.347 0 4.25-1.79 4.25-4 0-2.12-1.748-3.856-3.954-3.992A5.752 5.752 0 0 0 6.195 8.89 3.751 3.751 0 0 0 7 18.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m12 14.25-.01-7.5M9.25 9.5 12 6.75 14.75 9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function FileCardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 40 40" {...props}>
      <path
        d="M7.5 4.75A2.75 2.75 0 0 1 10.25 2h13.478c.364 0 .713.145.97.402l8.9 8.9c.257.257.402.606.402.97V32.5a2.75 2.75 0 0 1-2.75 2.75h-21A2.75 2.75 0 0 1 7.5 32.5V4.75Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M24 2v7a2.75 2.75 0 0 0 2.75 2.75h7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 4.75A2.75 2.75 0 0 1 10.25 2h13.478c.364 0 .713.145.97.402l8.9 8.9c.257.257.402.606.402.97V32.5a2.75 2.75 0 0 1-2.75 2.75h-21A2.75 2.75 0 0 1 7.5 32.5V4.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M9.75 4.75h4.5a1 1 0 0 1 1 1v1h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 6.75h15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m6.75 6.75.72 10.08A2 2 0 0 0 9.46 18.7h5.08a2 2 0 0 0 1.99-1.87l.72-10.08"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
