import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';
import { UtilProvider } from '../../../providers/util/util';
import { Ht1PgConfig } from '../config/pg.config';

@IonicPage()
@Component({
  selector: 'ht1-page-alarm',
  templateUrl: 'ht1_alarm.html',
})
export class Ht1AlarmPage {
  /* Common */
  pgConfig = new Ht1PgConfig(0);

  alarmUse:boolean = false;
  alarmMode:string;
  alarmHour:number;
  alarmMin:number;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public util: UtilProvider,
    public storage: StorageProvider)
  {
    let alarmInfo = storage.getAlarmInfo();

    if (alarmInfo != null)
    {
      this.alarmUse = alarmInfo.alarmUse;
      this.alarmMode = alarmInfo.alarmMode;
      this.alarmHour = Number(alarmInfo.alarmHour);
      this.alarmMin = Number(alarmInfo.alarmMin);
    } else {
      this.alarmUse = false;
      this.alarmMode = '오전';
      this.alarmHour = 10;
      this.alarmMin = 0;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmPage');
  }

  onChangeUse(mode) {
    this.alarmUse = mode;
    console.log('mode :', mode);
  }

  /* time */
  changeAmPmUp()
  {
    if (this.alarmMode == '오전') {
      this.alarmMode = '오후';
    } else {
      this.alarmMode = '오전';
    }
  }

  changeAmPmDown()
  {
    if (this.alarmMode == '오전') {
      this.alarmMode = '오후';
    } else {
      this.alarmMode = '오전';
    }
  }

  changeHourUp()
  {
    if (this.alarmHour == 12) {
      this.alarmHour = 1;
    } else {
      this.alarmHour += 1;
    }
  }

  changeHourDown()
  {
    if (this.alarmHour == 1) {
      this.alarmHour = 12;
    } else {
      this.alarmHour -= 1;
    }
  }

  changeMinUp()
  {
    if (this.alarmMin == 59) {
      this.alarmMin = 0;
    } else {
      this.alarmMin += 1;
    }
  }

  changeMinDown()
  {
    if (this.alarmMin == 0) {
      this.alarmMin = 59;
    } else {
      this.alarmMin -= 1;
    }
  }

  confirm() {
    console.log('confirm AlarmPage');

    this.storage.setAlarmInfo(this.alarmUse, this.alarmMode, String(this.alarmHour), String(this.alarmMin));

    let data = { 'mode': 'close' };
    this.viewCtrl.dismiss(data);
  }
}
