/**
 * Created by tim on 03/04/17.
 */
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { storiesOf, action, linkTo } from "@storybook/react-native";
import moment from "moment";
import CenterView from "../basics/CenterView";
import RenderImage from "./RenderImage";

const examplePhoto = "/storage/emulated/0/DCIM/example_000.jpg";

storiesOf("RenderImage", module)
  .addDecorator(getStory =>
    <ScrollView style={{ backgroundColor: "grey" }}>
      {getStory()}
    </ScrollView>
  )
  .add("simple", () =>
    <RenderImage
      photoForRendering={{
        uriOriginalPhoto: examplePhoto,
        height: 1280,
        width: 960,
        orientation: 1,
        createdAtMillis: moment().valueOf(),
        shareableUri: "http://img.obob.work/2sWdfV",
        description:
          "description of this photo which is long, but not too long",
        siteObjectId: "v8fJe",
        siteName: "some site name",
        creatorObjectId: "cud3OhHGcy",
        creatorName: "Tim Loewel",
        selectedLocation: {
          address: { formattedAddress: "Formatted address" }
        },
        systemLocation: {
          address: { formattedAddress: "system location address" }
        }
      }}
    />
  )
  .add("long description", () =>
    <RenderImage
      photoForRendering={{
        uriOriginalPhoto: examplePhoto,
        height: 1280,
        width: 960,
        orientation: 1,
        createdAtMillis: moment().valueOf(),
        shareableUri: "http://img.obob.work/2sWdfV",
        description: `description of this photo which is longer, and should wrapp for some lines. and it even contains
					its own linebreak. there should be more then one
					paragraph and the rest is further down the line.`,
        siteObjectId: "v8fJe",
        siteName: "some site name",
        creatorObjectId: "cud3OhHGcy",
        creatorName: "Tim Loewel",
        selectedLocation: {
          address: { formattedAddress: "Formatted address" }
        },
        systemLocation: {
          address: { formattedAddress: "system location address" }
        }
      }}
    />
  )
  .add("longitude, latitude", () =>
    <RenderImage
      photoForRendering={{
        uriOriginalPhoto: examplePhoto,
        height: 1280,
        width: 960,
        orientation: 1,
        createdAtMillis: moment().valueOf(),
        shareableUri: "http://img.obob.work/2sWdfV",
        description:
          "description of this photo which is long, but not too long",
        siteObjectId: "v8fJe",
        siteName: "some site name",
        creatorObjectId: "cud3OhHGcy",
        creatorName: "Tim Loewel",
        selectedLocation: {
          address: { formattedAddress: "Formatted address" }
        },
        systemLocation: {
          address: { formattedAddress: "system location address" }
        }
      }}
    />
  )
  .add("selected location & system location", () =>
    <RenderImage
      photoForRendering={{
        uriOriginalPhoto: examplePhoto,
        height: 1280,
        width: 960,
        orientation: 1,
        createdAtMillis: moment().valueOf(),
        shareableUri: "http://img.obob.work/2sWdfV",
        description:
          "description of this photo which is long, but not too long",
        siteObjectId: "v8fJe",
        siteName: "some site name",
        creatorObjectId: "cud3OhHGcy",
        creatorName: "Tim Loewel",
        selectedLocation: {
          address: { formattedAddress: "Formatted address" }
        },
        systemLocation: {
          address: { formattedAddress: "system location address" }
        }
      }}
    />
  );
