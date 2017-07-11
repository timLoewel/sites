/**
 * Created by tim on 06/07/17.
 */
// @flow

// classes that can be stored on the server
export const ServerClassNames = {
  Photo: "Photo",
  Site: "Site",
  User: "User"
};

export type IServerClassName = $Keys<typeof ServerClassNames>;

export type IAddress = {
  position: {
    // this is the position, the address is assigned to. not the location of the user
    longitude: number,
    latitude: number
  },
  formattedAddress: string, // the full address
  streetNumber?: string,
  streetName?: string,
  postalCode?: string,
  locality?: string, // city name
  country?: string,
  countryCode?: string,
  adminArea?: string,
  subAdminArea?: string,
  subLocality?: ?string
};

/**
 * location that can be searched in parseJs queries
 */
export type ISearchableLocation = {
  longitude: number,
  latitude: number,
  __type: "GeoPoint"
};

/**
 * a location
 */
export type ILocation = {
  longitude: number,
  latitude: number,
  accuracy: number,
  altitude: number,
  address: ?IAddress
};

export type IObjectId = string;
export type ISessionToken = string;

export type IUser = {
  objectId: IObjectId,
  name: string
};
export type ICameraViewComponentProps = {
  setPhotographing: IPhotoCapture => void,
  gotoPhotos: () => void,
  addNewLocalSite: ISite => void,

  siteName: ?string,
  selectedLocation: ILocation,
  description: string,
  systemLocation: ILocation,
  creatorObjectId: IObjectId,
  creatorName: string,
  photoForRendering: IPhotoCapture,
  currentSite: ?ISite,
  lastPhotoThumbnail: string // base64 image
};

export type IUserPointer = {
  "__type": "Pointer",
  "className": "_User",
  "objectId": string
};

export type IPhoto = {
  uriOriginalPhoto: string,
  height: number,
  width: number,
  orientation: number,
  createdAtMillis: number,
  shareableUri: string,
  description: string,
  site: string,
  creator: IUserPointer,
  creatorName: string, //store.getState().profile.currentUser.name,
  searchableLocation: ISearchableLocation, // geopoint of the selectedLocation
  selectedLocation: Location, //store.getState().ui.cameraReducer.selectedLocation,
  systemLocation: Location
};

export type IPhotoCapture = {
  capture: any,
  createdAtMillis: number,
  shareableUri: string,
  description: string,
  creatorObjectId: string,
  creatorName: string,
  selectedLocation: ILocation,
  systemLocation: ILocation,
  site: ?ISite
};

export type ISite = {
  localObjectId: IObjectId,
  name: string,
  searchableLocation: ISearchableLocation,
  selectedLocation: ILocation,
  systemLocation: ILocation,
  creator: IUserPointer,
  publicUrl: string
};
