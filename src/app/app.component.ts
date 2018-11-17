import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageProvider } from '../providers/hc/storage/storage';
import { UtilProvider } from '../providers/hc/util/util';
import { Network } from '@ionic-native/network';
import { Media, MediaObject } from '@ionic-native/media';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'SplashPage';

  bgm_file: MediaObject;
  bgm_enable: boolean;

  userName: string;
  userCreatedDateTime: string;

  pages: Array<{title: string, icon: string, component: any, pageName: string}>;

  constructor(public platform: Platform,
    public network: Network,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: StorageProvider,
    public util: UtilProvider,
    public media: Media,
    public menu: MenuController,
    public localNotifications: LocalNotifications,
    public events: Events)
  {
      this.initializeApp();

      platform.ready().then(() => {

        let lastTimeBackPress:number = 0;
        let timePeriodToExit:number  = 2000;

        this.network.onDisconnect().subscribe(() => {
          console.log('network was disconnected :-(');

          this.util.toast('네트워크 연결이 해제되었습니다. 다시 연결을 시도합니다.', 3000, 'bottom');

          lastTimeBackPress = new Date().getTime();
        });

        // watch network for a connection
        this.network.onConnect().subscribe(() => {
          console.log('network connected!'); 

          this.util.toast('네트워크 연결되었습니다.', 3000, 'bottom');

          lastTimeBackPress = new Date().getTime();
        });

        // local notification
        if (this.platform.is('cordova')) {
          this.platform.ready().then(() => {
            this.localNotifications.on('click').subscribe(notification => {
              let json = JSON.parse(notification.data);
              this.storage.setLocalNotifications(json.msg);
            });
          });
        }

        events.subscribe('userInfo:changed', data => {

            let userInfo = storage.getUserInfo();

            if (typeof userInfo !== undefined && userInfo !== null) {
              this.userName = userInfo.name;
              this.userCreatedDateTime = userInfo.created_datetime;
              console.log('events.subscribe userInfo:changed =>', userInfo.name);
            } else {
              console.log('events.subscribe userInfo:changed => none');
            }

        });

        //
        this.bgm_enable = (this.storage.getPlayBgm() == "false") ? false : true;

        let sound: string;
        sound = this.util.getMediaPath('assets/audio/bgm.mp3');
        this.bgm_file = this.media.create(sound);
        this.bgm_file.setVolume(0.1);

        events.subscribe('playBgm:changed', (bgm_enable) => {
            this.bgm_enable = (bgm_enable === 'false') ? false : true;

            if (this.storage.getPlayBgm() != "false" && this.bgm_enable === true) {
                this.playBgm();
            } else {
                this.stopBgm();
            }

            return;
        });

        platform.registerBackButtonAction(() => {

            if (this.menu.isOpen()) {
              console.log("Menu is open!", "loggedInMenu");
              this.menu.close();
              console.log("this.menu.isOpen(): " + JSON.stringify(this.menu.isOpen()));
              return;
            }

            let view = this.nav.getActive();

            if (view.component.name == "LoginPage" || view.component.name == "TabsPage") {
                //Double check to exit app
                if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {

                    this.close();

                    this.platform.exitApp(); //Exit from app
                } else {
                    this.util.toast('뒤로가기 버튼을 한번 더 클릭하시면 종료됩니다.', 3000, 'bottom');

                    lastTimeBackPress = new Date().getTime();

                    this.nav.pop({});
                }
            } else {
                // go to previous page
                this.nav.pop({});
            }
        });
      });

      // used for an example of ngFor and navigation
      this.pages = [
        { title: '홈', icon: 'home', component: 'TabsPage', pageName: 'home' },
        { title: '하루카드', icon: 'albums', component: 'TabsPage', pageName: 'harucard' },
        { title: '즐겨찾기', icon: 'heart', component: 'TabsPage', pageName: 'favorites' },
        { title: '설정', icon: 'settings', component: 'SetupPage', pageName: 'setup' },
        { title: '로그아웃', icon: 'power', component: 'LoginPage', pageName: 'logout' }
      ];
  }

  playBgm() {
    if (this.storage.getPlayBgm() != "false")
      this.bgm_file.play();
  }

  stopBgm() {
    if (this.bgm_file) {
      this.bgm_file.stop();
      this.bgm_file.release();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  close() {
    if (this.bgm_file) {
      this.bgm_file.stop();
      this.bgm_file.release();
    }  
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    this.nav.setRoot(page.component, {pageName: page.pageName});
  }
}
