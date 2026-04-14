export function extractMimeSubtype(type: string) {
  return type.split("/").at(-1)?.split("+").at(0)?.trim();
}

export function getUploadedFileKey(
  file: {name: string; size: number; type: string} | null | undefined,
) {
  if (!file) return "";

  return `${file.name}::${file.size}::${file.type}`;
}

export function getLocalFilePreviewKey(file: File | null | undefined) {
  if (!file) return "";

  return `${file.name}::${file.size}::${file.type}::${file.lastModified}`;
}

export function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

export function formatUploadedFileType(type?: string, name?: string) {
  if (type) {
    const mimeLabel = extractMimeSubtype(type);

    if (mimeLabel) {
      return mimeLabel.toUpperCase();
    }
  }

  const extension = name?.split(".").at(-1)?.trim();

  return extension ? extension.toUpperCase() : "FILE";
}

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "svg",
  "bmp",
  "ico",
  "tiff",
  "tif",
]);

export function isLikelyImageFile(file: {type: string; name: string}): boolean {
  if (file.type.startsWith("image/")) return true;
  const ext = file.name.split(".").at(-1)?.toLowerCase().trim();

  return ext ? IMAGE_EXTENSIONS.has(ext) : false;
}
