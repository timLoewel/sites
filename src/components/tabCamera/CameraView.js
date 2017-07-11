"use strict";
import moment from "moment";
import { connect } from "react-redux";
import CameraViewRaw from "./CameraViewRaw";
import {
  setPhotoLocation,
  setPhotoDescription,
  setOnSiteLocation
} from "../../model/ui/camera/cameraReducer";
import { selectCurrentSite } from "../../model/site/siteSelectors";
import { getLastPhotoThumbnail } from "../../model/photo/photoReducer";
import { NavigationActions } from "react-navigation";

const mapStateToProps = state => ({
  selectedLocation:
    state.ui.cameraReducer.selectedLocation || state.geolocation.location,
  description: state.ui.cameraReducer.description,
  systemLocation: state.geolocation.location,
  onSiteLocation: state.ui.cameraReducer.onSiteLocation,
  creatorObjectId: state.profile.objectId,
  creatorName: state.profile.currentUser.name,
  photoForRendering: state.ui.cameraReducer.photosWaitingForRendering[0],
  currentSite: selectCurrentSite(state),
  lastPhotoThumbnail: getLastPhotoThumbnail(state)
});

function bindAction(dispatch) {
  return {
    setPhotoLocation: newLocation => dispatch(setPhotoLocation(newLocation)),
    setPhotoDescription: description =>
      dispatch(setPhotoDescription(description)),
    setPhotographing: photoData => dispatch(photographing(photoData)),
    setOnSiteLocation: onSiteLocation =>
      dispatch(setOnSiteLocation(onSiteLocation)),
    addNewLocalSite: site => dispatch(addNewLocalSite(site)),
    gotoPhotos: () =>
      dispatch(NavigationActions.navigate({ routeName: "Photos" })),
    gotoSelectSite: () =>
      dispatch(NavigationActions.navigate({ routeName: "SelectSite" }))
  };
}

export default connect(mapStateToProps, bindAction)(CameraViewRaw);
