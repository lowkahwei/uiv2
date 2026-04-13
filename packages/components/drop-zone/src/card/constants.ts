export const UPLOAD_CARD_DIMENSIONS = {
  uploadedWidth: 512,
  dropTargetSize: 90,
  idleSize: 80,
  uploadedHeight: 70,
  borderRadius: 24,
  dropTargetScale: 1.03,
} as const;

export const UPLOAD_CARD_SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 24,
  mass: 0.9,
} as const;

export const CARD_CONTENT_TRANSITION = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
} as const;

export const UPLOAD_CARD_APPEND_DELAY_MS = CARD_CONTENT_TRANSITION.duration * 1000;

export const UPLOAD_CARD_LIST_ITEM_MOTION = {
  initial: {opacity: 0, height: 0, y: -12},
  animate: {opacity: 1, height: "auto", y: 0},
  exit: {opacity: 0, height: 0, y: -12},
} as const;

export const UPLOADED_CONTENT_MOTION = {
  key: "uploaded-file",
  animate: {opacity: 1, x: 0, filter: "blur(0px)"},
  exit: {opacity: 0, x: -10, filter: "blur(6px)"},
  initial: {opacity: 0, x: 10, filter: "blur(8px)"},
} as const;

export const IDLE_CONTENT_MOTION = {
  key: "idle-upload",
  animate: {opacity: 1, y: 0, scale: 1},
  exit: {opacity: 0, y: -10, scale: 0.9},
  initial: {opacity: 0, y: 10, scale: 0.9},
} as const;

export const DROP_ZONE_CARD_LABELS = {
  releaseToUpload: "Release to upload",
  removeUploadedFile: "Remove uploaded file",
} as const;
