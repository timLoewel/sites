/**
 * Created by tim on 06/07/17.
 */
// @flow
export type Address = {
	position: {// this is the position, the address is assigned to. not the location of the user
		longitude:number,
		latitude:number,
	},
	formattedAddress: string, // the full address
	streetNumber: ?string,
	streetName: ?string,
	postalCode: ?string,
	locality: ?string, // city name
	country: string,
	countryCode: string,
	adminArea: ?string,
	subAdminArea: ?string,
	subLocality: ?string
}

/**
 * location that can be searched in parseJs queries
 */
export type SearchablePosition = {
	longitude: number,
	latitude: number,
	__type: 'GeoPoint',
}

/**
 * a location
 */
export type ILocation = {
	longitude: number,
	latitude: number,
	accuracy: number,
	altitude: number,
	address: ?Address
}

export type IObjectId = string;

export type ICameraViewComponentProps = {
	setPhotographing: (IPhotoCapture) => void,
	gotoPhotos: () => void,
	addNewLocalSite: (ISite) => void,

	siteName: ?string,
	selectedLocation: ILocation,
	description: string,
	systemLocation: ILocation,
	creatorObjectId: IObjectId,
	creatorName: string,
	photoForRendering: IPhotoCapture,
	currentSite: ?ISite,
	lastPhotoThumbnail: string // base64 image
}

export type IPhoto = {
	uriOriginalPhoto: string,
	height: number,
	width: number,
	orientation: number,
	createdAtMillis: number,
	shareableUri: string,
	description: string,
	site: string,
	creator: {
		"__type": "Pointer",
		"className": "_User",
		"objectId": string
	},
	creatorName: string,//store.getState().profile.currentUser.name,
	searchablePosition: SearchablePosition, // geopoint of the selectedLocation
	selectedLocation: Location,//store.getState().ui.cameraReducer.selectedLocation,
	systemLocation: Location
};

export type IPhotoCapture = {
	createdAtMillis: number,
	shareableUri: string,
	description: string,
	creatorObjectId: string,
	creatorName: string,
	selectedLocation: ILocation,
	systemLocation: ILocation,
	site: ISite
};

export type ISite = any;