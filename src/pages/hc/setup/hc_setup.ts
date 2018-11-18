import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';
import { UtilProvider } from '../../../providers/util/util';

@IonicPage()
@Component({
  selector: 'hc-page-setup',
  templateUrl: 'hc_setup.html',
})
export class HcSetupPage {

  bgm_enable:boolean;

  appPartName: string;

  constructor(
    public util: UtilProvider,
    public storage: StorageProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public events: Events)
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupPage');

  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter()');

    this.appPartName = this.storage.getAppPartName();

    this.bgm_enable = (this.storage.getPlayBgm() == "false") ? false : true;
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave()');
  }

  changeBgm() {
    let bgm_enable = (this.bgm_enable) ? 'false' : 'true';

    this.bgm_enable = (this.bgm_enable) ? false : true;

    this.storage.setPlayBgm(bgm_enable);

    this.events.publish('playBgm:changed', bgm_enable);
  }

  close()
  {
    this.events.publish('playBgm:changed', 'true');

    this.navCtrl.setRoot('HcTabsPage', {pageName: 'home'});
    this.navCtrl.popToRoot();
  }

  openAlarm()
  {
    let alarmModal = this.modalCtrl.create('HcAlarmPage');

    alarmModal.onDidDismiss(data => {
    if (data.mode == 'close') {
      console.log('close history');
    } else {
      console.log('send history : ', data);
    }
    });

    alarmModal.present(); 
  }
}
