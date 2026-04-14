import type {DropZoneCardState, PreviewResolver} from "../src/types";

import {renderHook, waitFor} from "@testing-library/react";

import {useDropZonePreviews} from "../src/hooks/use-drop-zone-previews";

function createImageFile(name = "photo.png") {
  return new File(["image"], name, {type: "image/png"});
}

function createUploadedImage(name = "photo.png") {
  return {
    name,
    size: 123,
    type: "image/png",
  };
}

describe("useDropZonePreviews", () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    let objectUrlCount = 0;

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: jest.fn(() => `blob:preview-${++objectUrlCount}`),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: originalCreateObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: originalRevokeObjectURL,
    });
  });

  it("calls previewResolver for controlled remote images without a local preview source", async () => {
    const previewResolver = jest.fn<ReturnType<PreviewResolver>, Parameters<PreviewResolver>>(
      () => "https://example.com/signed-preview.png",
    );
    const uploadCards: DropZoneCardState[] = [
      {
        id: "remote-card",
        uploadedFile: createUploadedImage("remote.png"),
      },
    ];
    const {result} = renderHook(() =>
      useDropZonePreviews({
        uploadCards,
        previewResolver,
      }),
    );

    await waitFor(() => expect(previewResolver).toHaveBeenCalledTimes(1));
    expect(result.current["remote-card"]).toMatchObject({
      isLoading: false,
      url: "https://example.com/signed-preview.png",
    });
  });

  it("prefers the local File preview and does not call previewResolver", async () => {
    const previewResolver = jest.fn<ReturnType<PreviewResolver>, Parameters<PreviewResolver>>(
      () => "https://example.com/should-not-run.png",
    );
    const localFile = createImageFile();
    const uploadCards: DropZoneCardState[] = [
      {
        id: "local-card",
        uploadedFile: createUploadedImage(),
        uploadState: {
          status: "uploading",
          progress: 0.4,
          file: localFile,
        },
      },
    ];
    const {result} = renderHook(() =>
      useDropZonePreviews({
        uploadCards,
        previewResolver,
      }),
    );

    await waitFor(() =>
      expect(result.current["local-card"]).toMatchObject({
        isLoading: false,
        url: "blob:preview-1",
      }),
    );
    expect(previewResolver).not.toHaveBeenCalled();
  });

  it("does not call previewResolver again after a local image upload succeeds", async () => {
    const previewResolver = jest.fn<ReturnType<PreviewResolver>, Parameters<PreviewResolver>>(
      () => "https://example.com/should-not-run.png",
    );
    const localFile = createImageFile();
    const uploadedFile = createUploadedImage();
    const {rerender} = renderHook(
      ({uploadCards}: {uploadCards: DropZoneCardState[]}) =>
        useDropZonePreviews({
          uploadCards,
          previewResolver,
        }),
      {
        initialProps: {
          uploadCards: [
            {
              id: "local-card",
              uploadedFile,
              uploadState: {
                status: "uploading" as const,
                progress: 0.5,
                file: localFile,
              },
            },
          ],
        },
      },
    );

    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalledTimes(1));

    rerender({
      uploadCards: [
        {
          id: "local-card",
          uploadedFile,
          uploadState: {
            status: "success",
            progress: 1,
            file: localFile,
            result: {
              fullPath: "private/path/photo.png",
            },
          },
        },
      ],
    });

    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalledTimes(1));
    expect(previewResolver).not.toHaveBeenCalled();
  });

  it("switches from a resolved remote preview to the local File preview when the controlled file changes", async () => {
    const previewResolver = jest.fn<ReturnType<PreviewResolver>, Parameters<PreviewResolver>>(
      () => "https://example.com/signed-preview.png",
    );
    const remoteCard: DropZoneCardState = {
      id: "card",
      uploadedFile: createUploadedImage("remote.png"),
    };
    const localFile = createImageFile("new-local.png");
    const {result, rerender} = renderHook(
      ({uploadCards}: {uploadCards: DropZoneCardState[]}) =>
        useDropZonePreviews({
          uploadCards,
          previewResolver,
        }),
      {
        initialProps: {
          uploadCards: [remoteCard],
        },
      },
    );

    await waitFor(() => expect(previewResolver).toHaveBeenCalledTimes(1));
    expect(result.current.card?.url).toBe("https://example.com/signed-preview.png");

    rerender({
      uploadCards: [
        {
          id: "card",
          uploadedFile: createUploadedImage("new-local.png"),
          uploadState: {
            status: "uploading",
            progress: 0.2,
            file: localFile,
          },
        },
      ],
    });

    await waitFor(() => expect(result.current.card?.url).toBe("blob:preview-1"));
    expect(previewResolver).toHaveBeenCalledTimes(1);
  });

  it("surfaces previewResolver errors through onPreviewError", async () => {
    const error = new Error("Preview failed");
    const previewResolver = jest.fn<ReturnType<PreviewResolver>, Parameters<PreviewResolver>>(
      () => {
        throw error;
      },
    );
    const onPreviewError = jest.fn();
    const uploadCards: DropZoneCardState[] = [
      {
        id: "remote-card",
        uploadedFile: createUploadedImage("remote.png"),
      },
    ];

    const {result} = renderHook(() =>
      useDropZonePreviews({
        uploadCards,
        previewResolver,
        onPreviewError,
      }),
    );

    await waitFor(() => expect(onPreviewError).toHaveBeenCalledTimes(1));
    expect(onPreviewError).toHaveBeenCalledWith(uploadCards[0].uploadedFile, error);
    expect(result.current["remote-card"]?.error).toBe(error);
  });
});
