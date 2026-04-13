export function extractMimeSubtype(type: string) {
  return type.split("/").at(-1)?.split("+").at(0)?.trim();
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
