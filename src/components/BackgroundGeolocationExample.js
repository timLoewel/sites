/**
 * Created by tim on 19/03/17.
 */
import BackgroundGeolocation from "react-native-background-geolocation";
import React from "react";

export default React.createClass({
  componentWillMount() {
    // 1.  Wire up event-listeners

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on("location", this.onLocation);

    // This handler fires whenever bgGeo receives an error
    BackgroundGeolocation.on("error", this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on("motionchange", this.onMotionChange);

    // This event fires when a chnage in motion activity is detected
    BackgroundGeolocation.on("activitychange", this.onActivityChange);

    // This event fires when the user toggles location-services
    BackgroundGeolocation.on("providerchange", this.onProviderChange);

    // 2.  #configure the plugin (just once for life-time of app)
    BackgroundGeolocation.configure(
      {
        // Geolocation Config
        desiredAccuracy: 0,
        stationaryRadius: 50,
        distanceFilter: 0,
        // locationUpdateInterval:5000,
        disableElasticity: false,
        // Activity Recognition
        stopTimeout: 1,
        fastestLocationUpdateInterval: 5000,
        // Application config
        debug: true, // <-- enable this hear sounds for background-systemState life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        disableStopDetection: true, // REMOVE THIS, ONLY FOR DEBUG
        stopOnTerminate: true, // <-- Allow the background-service to continue tracking when user closes the app.
        stopTimeout: 3,
        startOnBoot: false, // <-- Auto start tracking when device is powered-up.
        // HTTP / SQLite config
        // url: 'http://yourserver.com/locations',
        batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: false, // <-- [Default: true] Set true to sync each location to server as it arrives.
        // headers: {              // <-- Optional HTTP headers
        // 	"X-FOO": "bar"
        // },
        // params: {               // <-- Optional HTTP params
        // 	"auth_token": "maybe_your_server_authenticates_via_token_YES?"
        locationAuthorizationAlert: {
          titleWhenNotEnabled: "Yo, location-services not enabled",
          titleWhenOff: "Yo, location-services OFF",
          instructions: "You must enable 'Always' in location-services, buddy",
          cancelButton: "Cancel",
          settingsButton: "Settings"
        }
        // }
      },
      function(state) {
        console.log(
          "- BackgroundGeolocation is configured and ready: ",
          state.enabled
        );

        if (!state.enabled) {
          BackgroundGeolocation.start(function() {
            console.log("- Start success");
          });
        }
      }
    );
    this.locate();
  },
  locate() {
    BackgroundGeolocation.getCurrentPosition(
      {
        timeout: 300,
        samples: 3,
        desiredAccuracy: 10,
        maximumAge: 0,
        persist: false
      },
      function(location) {
        console.log(
          "- manual get current position: ",
          JSON.stringify(location)
        );
      },
      function(error) {
        console.info("ERROR: Could not get current position", error);
      }.bind(this)
    );
  },

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    console.log("remove systemState callbacks");

    // Remove BackgroundGeolocation listeners
    BackgroundGeolocation.un("location", this.onLocation);
    BackgroundGeolocation.un("error", this.onError);
    BackgroundGeolocation.un("motionchange", this.onMotionChange);
    BackgroundGeolocation.un("activitychange", this.onActivityChange);
    BackgroundGeolocation.un("providerchange", this.onProviderChange);
  },
  render() {
    return null;
  },
  onLocation(location) {
    console.log("- [js]location: ", JSON.stringify(location));
  },
  onError(error) {
    let type = error.type;
    let code = error.code;
    alert(type + " Error: " + code);
  },
  onActivityChange(activityName) {
    console.log("- Current motion activity: ", activityName); // eg: 'on_foot', 'still', 'in_vehicle'
  },
  onProviderChange(provider) {
    console.log("- Location provider changed: ", provider.enabled);
  },
  onMotionChange(location) {
    console.log("- [js]motionchanged: ", JSON.stringify(location));
  }
});
