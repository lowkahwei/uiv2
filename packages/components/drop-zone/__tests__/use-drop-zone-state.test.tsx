import {renderHook, act} from "@testing-library/react";

import {useDropZoneState} from "../src/hooks/use-drop-zone-state";

const uploadedFiles = [
  {name: "first.png", size: 100, type: "image/png"},
  {name: "second.png", size: 200, type: "image/png"},
  {name: "third.png", size: 300, type: "image/png"},
];

function getCardNames(
  cards: ReturnType<typeof useDropZoneState>["uploadCards"],
): Array<string | null> {
  return cards.map((card) => card.uploadedFile?.name ?? null);
}

describe("useDropZoneState", () => {
  it("preserves the removed controlled card position until the remove animation completes", () => {
    const {result, rerender} = renderHook(
      ({fileList}: {fileList: typeof uploadedFiles}) =>
        useDropZoneState({
          acceptedFileTypes: [],
          fileList,
          maxFiles: 3,
        }),
      {
        initialProps: {fileList: uploadedFiles},
      },
    );
    const removedCardId = result.current.uploadCards[0].id;

    act(() => {
      result.current.removeUploadedFile(removedCardId);
    });

    expect(getCardNames(result.current.uploadCards)).toEqual([null, "second.png", "third.png"]);
    expect(result.current.uploadCards[0]?.id).toBe(removedCardId);

    act(() => {
      rerender({fileList: uploadedFiles.slice(1)});
    });

    expect(getCardNames(result.current.uploadCards)).toEqual([null, "second.png", "third.png"]);
    expect(result.current.uploadCards[0]?.id).toBe(removedCardId);

    act(() => {
      result.current.handleUploadCardContentAnimationComplete(removedCardId, null);
    });

    expect(getCardNames(result.current.uploadCards)).toEqual(["second.png", "third.png", null]);
    expect(result.current.uploadCards[2]?.id).toBe(removedCardId);
  });

  it("reconciles new controlled file lists immediately when they include more than the pending removal", () => {
    const replacementFile = {name: "replacement.png", size: 400, type: "image/png"};
    const {result, rerender} = renderHook(
      ({fileList}: {fileList: typeof uploadedFiles}) =>
        useDropZoneState({
          acceptedFileTypes: [],
          fileList,
          maxFiles: 3,
        }),
      {
        initialProps: {fileList: uploadedFiles},
      },
    );
    const removedCardId = result.current.uploadCards[0].id;

    act(() => {
      result.current.removeUploadedFile(removedCardId);
    });

    act(() => {
      rerender({fileList: [...uploadedFiles.slice(1), replacementFile]});
    });

    expect(getCardNames(result.current.uploadCards)).toEqual([
      "second.png",
      "third.png",
      "replacement.png",
    ]);
  });

  it("reorders uncontrolled cards only after the remove animation completes", () => {
    const {result} = renderHook(() =>
      useDropZoneState({
        acceptedFileTypes: [],
        defaultFileList: uploadedFiles,
        maxFiles: 3,
      }),
    );
    const removedCardId = result.current.uploadCards[0].id;

    act(() => {
      result.current.removeUploadedFile(removedCardId);
    });

    expect(getCardNames(result.current.uploadCards)).toEqual([null, "second.png", "third.png"]);
    expect(result.current.uploadCards[0]?.id).toBe(removedCardId);

    act(() => {
      result.current.handleUploadCardContentAnimationComplete(removedCardId, null);
    });

    expect(getCardNames(result.current.uploadCards)).toEqual(["second.png", "third.png", null]);
    expect(result.current.uploadCards[2]?.id).toBe(removedCardId);
  });
});
