/**
 * Created by tim on 28/03/17.
 */
import cameraReducer, { enqueuePhotoForRendering } from "./cameraReducer";
import { List } from "immutable";

test("initial state", () => {
  expect(cameraReducer(undefined, { type: "not handled" })).toEqual({
    isReadyForScreenshot: false,
    screenshotDimensions: { height: 0, width: 0 },
    isDoingScreenshot: false,
    photosWaitingForRendering: [],
    selectedLocation: undefined,
    onSiteLocation: "",
    description: ""
  });
});

test("photosWaitingForRendering", () => {
  expect(
    cameraReducer(
      {
        isReadyForScreenshot: false,
        screenshotDimensions: { height: 0, width: 0 },
        isDoingScreenshot: false,
        photosWaitingForRendering: [{ value: 1 }],
        selectedLocation: undefined,
        description: ""
      },
      enqueuePhotoForRendering({ newValue: 2 })
    )
  ).toEqual({
    isReadyForScreenshot: false,
    screenshotDimensions: { height: 0, width: 0 },
    isDoingScreenshot: false,
    photosWaitingForRendering: [{ value: 1 }, { newValue: 2 }],
    selectedLocation: undefined,
    description: ""
  });
});
