package com.sites;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.RNFetchBlob.RNFetchBlobPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.devialab.exif.RCTExifPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNBackgroundGeolocation(),
            new RNGeocoderPackage(),
            new RNViewShotPackage(),
            new VectorIconsPackage(),
            new ReactNativeI18n(),
            new RNFetchBlobPackage(),
            new ExtraDimensionsPackage(),
            new RCTExifPackage(),
            new RCTCameraPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
