import photoReducer, {
  addLocalPhoto,
  savePhotoJsonToServerDone
} from "./photoReducer";
import { OrderedMap } from "immutable";

test("initial state", () => {
  expect(photoReducer(undefined, { type: "not handled" })).toEqual({
    localPhotosByLocalObjectId: OrderedMap(),
    photosByObjectId: OrderedMap()
  });
});

test("add local photo", () => {
  expect(
    photoReducer(
      undefined,
      addLocalPhoto({ localObjectId: "lod1", data: "data" })
    )
  ).toEqual({
    localPhotosByLocalObjectId: OrderedMap().set("lod1", {
      localObjectId: "lod1",
      data: "data"
    }),
    photosByObjectId: OrderedMap()
  });
});

test("update local photo to server photo", () => {
  expect(
    photoReducer(
      {
        localPhotosByLocalObjectId: OrderedMap().set("lod1", {
          localObjectId: "lod1",
          data: "data"
        }),
        photosByObjectId: OrderedMap()
      },
      savePhotoJsonToServerDone({
        objectId: "id1",
        localObjectId: "lod1",
        data: "data1"
      })
    )
  ).toEqual({
    localPhotosByLocalObjectId: OrderedMap(),
    photosByObjectId: OrderedMap().set("id1", {
      objectId: "id1",
      localObjectId: "lod1",
      data: "data1"
    })
  });
});
