import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { UtilProvider } from '../../../providers/ht2/util/util';
import { StorageProvider } from '../../../providers/ht2/storage/storage';

@IonicPage()
@Component({
  selector: 'ht2-page-setup',
  templateUrl: 'ht2_setup.html',
})
export class Ht2SetupPage {

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

    if (this.bgm_enable) {
      this.events.publish('playBgm:changed', "false");
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave()');

    if (this.bgm_enable) {
      this.events.publish('playBgm:changed', "true");
    }
  }

  changeBgm() {
    let bgm_enable = (this.bgm_enable) ? "false" : "true";

    this.bgm_enable = (this.bgm_enable) ? false : true;

    this.storage.setPlayBgm(bgm_enable);
  }

  close()
  {
    if (this.bgm_enable) {
      this.events.publish('playBgm:changed', "true");
    }

    this.navCtrl.setRoot('TabsPage', {pageName: 'home'});
  }

  openAlarm()
  {
    let alarmModal = this.modalCtrl.create('AlarmPage');

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
