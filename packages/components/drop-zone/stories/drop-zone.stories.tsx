import type {Meta} from "@storybook/react";
import type {DropItem, DropZoneProps, FileDropItem, TextDropItem} from "../src";

import React from "react";
import {dropZone} from "@heroui/theme";

import {DropZone} from "../src";

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
