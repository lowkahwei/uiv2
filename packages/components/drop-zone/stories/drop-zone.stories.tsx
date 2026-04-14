import type {Meta} from "@storybook/react";
import type {DropItem, DropZoneProps, FileDropItem, TextDropItem} from "../src";
import type {DropZoneCardRenderProps} from "../src/card/types";

import React from "react";
import {dropZone} from "@heroui/theme";

import {DropZone} from "../src";
import {UploadCard} from "../src/card/upload-card";
import {useDropZone} from "../src/use-drop-zone";

export default {
  title: "Components/DropZone",
  component: DropZone,
  argTypes: {
    color: {
      control: {type: "select"},
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    variant: {
      control: {type: "select"},
      options: ["bordered", "flat", "faded"],
    },
    size: {
      control: {type: "select"},
      options: ["sm", "md", "lg"],
    },
    radius: {
      control: {type: "select"},
      options: ["none", "sm", "md", "lg", "full"],
    },
    isInvalid: {
      control: {type: "boolean"},
    },
    isDisabled: {
      control: {type: "boolean"},
    },
  },
} as Meta<typeof DropZone>;

const defaultProps = {
  ...dropZone.defaultVariants,
  className: "max-w-2xl",
  title: "Drop project assets",
};

const previewFile = {
  name: "hero-banner.png",
  size: 2.4 * 1024 * 1024,
  type: "image/png",
} as const;

const previewProgressItems = [
  {label: "25%", progress: 0.25},
  {label: "50%", progress: 0.5},
  {label: "100%", progress: 1},
] as const;

const readDroppedItems = async (items: DropItem[]) => {
  const values = await Promise.all(
    items.map(async (item) => {
      if (item.kind === "file") {
        const file = await (item as FileDropItem).getFile();

        return `File: ${file.name}`;
      }

      if (item.kind === "text" && (item as TextDropItem).types.has("text/plain")) {
        return `Text: ${await (item as TextDropItem).getText("text/plain")}`;
      }

      if (item.kind === "directory") {
        return `Directory: ${item.name}`;
      }

      return item.kind;
    }),
  );

  return values;
};

const PlaygroundTemplate = (args: DropZoneProps) => {
  const [items, setItems] = React.useState<string[]>([]);

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <DropZone
        aria-label="Project assets drop zone"
        {...args}
        onDrop={async (event) => {
          setItems(await readDroppedItems(event.items));
          args.onDrop?.(event);
        }}
      />
      <div className="rounded-large border border-default-200 bg-content1 p-4">
        <p className="mb-3 text-small font-medium text-foreground">Dropped items</p>
        {items.length > 0 ? (
          <ul className="space-y-2 text-small text-default-600">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="rounded-medium bg-default-50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-small text-default-500">
            Drop files or the sample text payload above to preview the parsed result here.
          </p>
        )}
      </div>
    </div>
  );
};

const ConstraintTemplate = (args: DropZoneProps) => {
  const [items, setItems] = React.useState<string[]>([]);
  const acceptedTypes = Array.isArray(args.accept) ? args.accept.join(", ") : args.accept || "Any";
  const maxFileSize =
    typeof args.maxFileSize === "number"
      ? `${(args.maxFileSize / (1024 * 1024)).toFixed(0)} MB`
      : "Unlimited";
  const maxFiles = args.maxFiles ?? 1;

  return (
    <div className="flex max-w-md flex-col gap-4">
      <div className="rounded-large border border-default-200 bg-default-50 p-4 text-small text-default-600">
        <p className="font-medium text-foreground">Current constraints</p>
        <p className="mt-2">Accepted types: {acceptedTypes}</p>
        <p>Max file size: {maxFileSize}</p>
        <p>Max files: {maxFiles}</p>
      </div>
      <DropZone
        aria-label="Constrained drop zone"
        {...args}
        onDrop={async (event) => {
          setItems(await readDroppedItems(event.items));
          args.onDrop?.(event);
        }}
      />
      <div className="rounded-large border border-default-200 bg-content1 p-4">
        <p className="mb-3 text-small font-medium text-foreground">
          Accepted items after filtering
        </p>
        {items.length > 0 ? (
          <ul className="space-y-2 text-small text-default-600">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="rounded-medium bg-default-50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-small text-default-500">
            Try dropping or selecting files that both match and violate the configured limits.
          </p>
        )}
      </div>
    </div>
  );
};

const CustomContentTemplate = (args: DropZoneProps) => {
  const [hasDrop, setHasDrop] = React.useState(false);

  return (
    <div className="max-w-3xl">
      <DropZone
        aria-label="Custom drop zone"
        {...args}
        className="min-h-72"
        onDrop={async (event) => {
          setHasDrop(event.items.length > 0);
          args.onDrop?.(event);
        }}
      >
        {({isDropTarget}) => (
          <div className="flex w-full flex-col items-start gap-4 text-left">
            <span className="rounded-full bg-default-100 px-3 py-1 text-tiny font-semibold uppercase tracking-[0.2em] text-default-500">
              HeroUI Layout
            </span>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-foreground">
                {isDropTarget ? "Release to import assets" : "Collect design handoff files"}
              </h3>
              <p className="max-w-lg text-default-500">
                This example uses render props so the UI changes immediately when the zone becomes
                the active drop target.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Figma", "PNG", "PDF", "Clipboard"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-default-200 bg-content1 px-3 py-1 text-small text-default-600"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="text-small text-default-400">
              {hasDrop ? "Items received successfully." : "No items dropped yet."}
            </div>
          </div>
        )}
      </DropZone>
    </div>
  );
};

const ControlledTemplate = (args: DropZoneProps) => {
  const [fileList, setFileList] = React.useState<NonNullable<DropZoneProps["fileList"]>>([
    {
      name: "brand-guidelines.pdf",
      size: 2.4 * 1024 * 1024,
      type: "application/pdf",
    },
  ]);
  const [lastAction, setLastAction] = React.useState("Waiting for changes");

  return (
    <div className="flex max-w-md flex-col gap-4">
      <DropZone
        aria-label="Controlled drop zone"
        {...args}
        fileList={fileList}
        onChange={(nextUploadedFiles) => {
          setFileList(nextUploadedFiles);
          setLastAction(`onChange: ${nextUploadedFiles.length} file(s)`);
          args.onChange?.(nextUploadedFiles);
        }}
        onDrop={async (event) => {
          setLastAction(`onDrop: accepted ${event.items.length} item(s)`);
          args.onDrop?.(event);
        }}
        onRemove={(uploadedFile, nextUploadedFiles) => {
          setLastAction(`onRemove: ${uploadedFile.name}`);
          args.onRemove?.(uploadedFile, nextUploadedFiles);
        }}
      />
      <div className="rounded-large border border-default-200 bg-content1 p-4">
        <p className="text-small font-medium text-foreground">Controlled state</p>
        <p className="mt-2 text-small text-default-500">{lastAction}</p>
        <ul className="mt-3 space-y-2 text-small text-default-600">
          {fileList.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              className="rounded-medium bg-default-50 px-3 py-2"
            >
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RestApiUploadTemplate = (args: DropZoneProps) => {
  const [projectUrl, setProjectUrl] = React.useState("https://xnmgtscekecpuftjgkds.supabase.co");
  const [bucket, setBucket] = React.useState("loan");
  const [apiKey, setApiKey] = React.useState("sb_publishable_vfHoG_24ARSa7ku0BJhCjw_Eay72o9_");
  const [folder, setFolder] = React.useState("pub");
  const [lastSuccess, setLastSuccess] = React.useState<string | null>(null);
  const [lastError, setLastError] = React.useState<string | null>(null);

  const uploadWithSupabaseRest = React.useCallback(
    (
      file: File,
      {onProgress, signal}: {onProgress: (progress: number) => void; signal: AbortSignal},
    ) =>
      new Promise<{name?: string; path?: string; fullPath?: string}>((resolve, reject) => {
        const normalizedProjectUrl = projectUrl.trim().replace(/\/$/, "");
        const normalizedBucket = bucket.trim();
        const normalizedApiKey = apiKey.trim();
        const normalizedFolder = folder.trim().replace(/^\/+|\/+$/g, "");

        if (!normalizedProjectUrl || !normalizedBucket || !normalizedApiKey) {
          reject(new Error("Project URL, bucket, and API key are required."));

          return;
        }

        const objectPath = [normalizedFolder, `${Date.now()}-${file.name}`]
          .filter(Boolean)
          .join("/");
        const endpoint = `${normalizedProjectUrl}/storage/v1/object/${normalizedBucket}/${objectPath}`;
        const xhr = new XMLHttpRequest();

        xhr.open("POST", endpoint);
        xhr.responseType = "json";
        xhr.setRequestHeader("apikey", normalizedApiKey);
        xhr.setRequestHeader("Authorization", `Bearer ${normalizedApiKey}`);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.setRequestHeader("content-type", file.type || "application/octet-stream");

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          onProgress(event.loaded / event.total);
        };

        xhr.onload = () => {
          const response = xhr.response ?? JSON.parse(xhr.responseText || "{}");

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              name: file.name,
              path: objectPath,
              fullPath: response?.Key ?? response?.path ?? objectPath,
            });

            return;
          }

          reject(
            new Error(
              response?.message ?? response?.error ?? `Upload failed with status ${xhr.status}`,
            ),
          );
        };

        xhr.onerror = () => {
          reject(new Error("Network error while uploading to Supabase Storage."));
        };

        xhr.onabort = () => {
          reject(new DOMException("Upload aborted.", "AbortError"));
        };

        signal.addEventListener(
          "abort",
          () => {
            xhr.abort();
          },
          {once: true},
        );

        xhr.send(file);
      }),
    [apiKey, bucket, folder, projectUrl],
  );

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className="rounded-large border border-default-200 bg-default-50 p-4">
        <p className="text-small font-medium text-foreground">Supabase REST upload config</p>
        <p className="mt-2 text-small text-default-500">
          Uses direct HTTP upload to <code>/storage/v1/object</code> with no{" "}
          <code>@supabase/supabase-js</code> dependency.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-small text-default-600">
            Project URL
            <input
              className="rounded-medium border border-default-200 bg-content1 px-3 py-2 text-foreground"
              placeholder="https://your-project-id.supabase.co"
              value={projectUrl}
              onChange={(event) => setProjectUrl(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-small text-default-600">
            Bucket
            <input
              className="rounded-medium border border-default-200 bg-content1 px-3 py-2 text-foreground"
              placeholder="images"
              value={bucket}
              onChange={(event) => setBucket(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-small text-default-600">
            API key / JWT
            <input
              className="rounded-medium border border-default-200 bg-content1 px-3 py-2 text-foreground"
              placeholder="anon key or signed user token"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-small text-default-600">
            Folder prefix
            <input
              className="rounded-medium border border-default-200 bg-content1 px-3 py-2 text-foreground"
              placeholder="storybook"
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
            />
          </label>
        </div>
        <p className="mt-3 text-tiny text-default-400">
          Make sure the bucket and storage policies allow this key to upload objects.
        </p>
      </div>
      <DropZone
        aria-label="Supabase REST API upload drop zone"
        {...args}
        onUpload={uploadWithSupabaseRest}
        onUploadError={(uploadedFile, error) => {
          const message = error instanceof Error ? error.message : String(error);

          setLastError(`${uploadedFile.name}: ${message}`);
          args.onUploadError?.(uploadedFile, error);
        }}
        onUploadSuccess={(uploadedFile, result) => {
          setLastError(null);
          setLastSuccess(`${uploadedFile.name} -> ${String(result.fullPath ?? result.path ?? "")}`);
          args.onUploadSuccess?.(uploadedFile, result);
        }}
      />
      <div className="rounded-large border border-default-200 bg-content1 p-4">
        <p className="text-small font-medium text-foreground">Upload callbacks</p>
        <p className="mt-2 text-small text-default-500">
          Success: {lastSuccess ?? "No successful upload yet."}
        </p>
        <p className="mt-1 text-small text-danger">{lastError ?? "No upload error."}</p>
      </div>
    </div>
  );
};

const ProgressPreviewCard = ({args, progress}: {args: DropZoneProps; progress: number}) => {
  const {
    state,
    title,
    icon,
    hideIcon,
    getUploadTriggerProps,
    getUploadCardWrapperProps,
    getUploadCardProps,
    getUploadCardOverlayProps,
    getUploadedContentProps,
    getIdleContentProps,
    getIdleCardProps,
    getIdleLabelProps,
    getIconWrapperProps,
    getIconProps,
    getDetailCardProps,
    getClearButtonProps,
    getClearButtonIconProps,
    getFileIconWrapperProps,
    getFileIconProps,
    getFileTypeBadgeProps,
    getFileInfoProps,
    getFileNameProps,
    getFileMetaProps,
  } = useDropZone({
    ...args,
    defaultFileList: [previewFile],
  });

  const cardProps: DropZoneCardRenderProps = {
    hideIcon: hideIcon ?? false,
    icon,
    state,
    title,
    disableAnimation: true,
    uploadedFile: previewFile,
    uploadedFileSize: "2.4 MB",
    uploadedFileType: "PNG",
    removeUploadedFile: () => undefined,
    retryUpload: () => undefined,
    uploadState: {
      status: "uploading",
      progress,
      file: new File(["preview"], previewFile.name, {type: previewFile.type}),
    },
    getUploadTriggerProps,
    getUploadCardWrapperProps,
    getUploadCardProps,
    getUploadCardOverlayProps,
    getUploadedContentProps,
    getIdleContentProps,
    getIdleCardProps,
    getIdleLabelProps,
    getDetailCardProps,
    getClearButtonProps,
    getClearButtonIconProps,
    getFileIconWrapperProps,
    getFileIconProps,
    getFileTypeBadgeProps,
    getFileInfoProps,
    getFileNameProps,
    getFileMetaProps,
    getIconProps,
    getIconWrapperProps,
  };

  return <UploadCard cardProps={cardProps} />;
};

const UploadProgressStatesTemplate = (args: DropZoneProps) => {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <div className="rounded-large border border-default-200 bg-default-50 p-4">
        <p className="text-small font-medium text-foreground">Upload progress preview</p>
        <p className="mt-2 text-small text-default-500">
          Static preview of the upload card at 25%, 50%, and 100%.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {previewProgressItems.map((item) => (
          <div key={item.label} className="rounded-large border border-default-200 bg-content1 p-4">
            <p className="mb-3 text-small font-medium text-foreground">{item.label}</p>
            <ProgressPreviewCard args={args} progress={item.progress} />
          </div>
        ))}
      </div>
    </div>
  );
};

const PreviewTemplate = (args: DropZoneProps) => {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className="rounded-large border border-default-200 bg-default-50 p-4">
        <p className="text-small font-medium text-foreground">Image preview</p>
        <p className="mt-2 text-small text-default-500">
          Select or drop image files to render responsive previews below the upload cards.
        </p>
      </div>
      <DropZone aria-label="Image preview drop zone" {...args} />
    </div>
  );
};

export const Default = {
  render: PlaygroundTemplate,
  args: {
    ...defaultProps,
  },
};

export const Secondary = {
  render: PlaygroundTemplate,
  args: {
    ...defaultProps,
    color: "secondary",
    variant: "flat",
  },
};

export const InvalidState = {
  render: PlaygroundTemplate,
  args: {
    ...defaultProps,
    isInvalid: true,
    color: "danger",
  },
};

export const CustomChildren = {
  render: CustomContentTemplate,
  args: {
    ...defaultProps,
    variant: "faded",
    color: "success",
  },
};

export const Controlled = {
  render: ControlledTemplate,
  args: {
    ...defaultProps,
    title: "Controlled uploaded files",
    maxFiles: 3,
    color: "primary",
  },
};

export const AcceptImagesOnly = {
  render: ConstraintTemplate,
  args: {
    ...defaultProps,
    title: "Upload image assets",
    accept: "image/*",
    color: "primary",
  },
};

export const AcceptPngAndPdf = {
  render: ConstraintTemplate,
  args: {
    ...defaultProps,
    title: "Upload PNG or PDF files",
    accept: ["image/png", ".pdf"],
    color: "secondary",
    variant: "flat",
  },
};

export const MaxFileSize5MB = {
  render: ConstraintTemplate,
  args: {
    ...defaultProps,
    title: "Upload files up to 5 MB",
    maxFileSize: 5 * 1024 * 1024,
    color: "warning",
  },
};

export const MaxFilesThree = {
  render: ConstraintTemplate,
  args: {
    ...defaultProps,
    title: "Upload up to 3 files",
    maxFiles: 3,
    color: "success",
    variant: "faded",
  },
};

export const CombinedConstraints = {
  render: ConstraintTemplate,
  args: {
    ...defaultProps,
    title: "Upload up to 2 PNG or PDF files under 5 MB",
    accept: ["image/png", ".pdf"],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 2,
    color: "danger",
  },
};

export const SupabaseRestUpload = {
  render: RestApiUploadTemplate,
  args: {
    ...defaultProps,
    title: "Upload images to Supabase Storage via REST API",
    accept: "image/*",
    maxFiles: 3,
    isPreview: true,
    color: "primary",
  },
};

export const UploadProgressStates = {
  render: UploadProgressStatesTemplate,
  args: {
    ...defaultProps,
    title: "Upload progress states",
    color: "primary",
  },
};

export const ImagePreview = {
  render: PreviewTemplate,
  args: {
    ...defaultProps,
    title: "Upload image assets with preview",
    accept: "image/*",
    maxFiles: 1,
    isPreview: true,
    color: "primary",
  },
};
