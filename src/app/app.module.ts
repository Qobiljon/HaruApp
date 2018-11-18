import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { MyApp } from './app.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Media } from '@ionic-native/media';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

import { ApiProvider } from '../providers/api/api';
import { LocalNotificationsProvider } from '../providers/local-notifications/local-notifications';
import { StorageProvider } from '../providers/storage/storage';
import { UtilProvider } from '../providers/util/util';
import { HaruCardDataProvider } from '../providers/hc/harucard-data/harucard-data';
import { HaruCardFavoritesDataProvider } from '../providers/hc/harucard-favorites-data/harucard-favorites-data';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    InAppBrowser,
    SocialSharing,
    ScreenOrientation,
    AppVersion,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    ApiProvider,
    LocalNotificationsProvider,
    UtilProvider,
    StorageProvider,
    HaruCardDataProvider,
    HaruCardFavoritesDataProvider,
    Network,
    Media,
    YoutubeVideoPlayer,
    BackgroundMode,
    PhotoViewer
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
