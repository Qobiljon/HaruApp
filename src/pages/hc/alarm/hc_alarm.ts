import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../../providers/hc/storage/storage';
import { UtilProvider } from '../../../providers/hc/util/util';

@IonicPage()
@Component({
  selector: 'hc-page-alarm',
  templateUrl: 'hc_alarm.html',
})
export class HcAlarmPage {
  /* Common */
  textAmPm:any = {'오전':'오전', '오후':'오후'};
  textHour:any = {0:'00시', 1:'01시', 2:'02시', 3:'03시', 4:'04시', 5:'05시', 6:'06시', 7:'07시', 8:'08시', 9:'09시', 10:'10시', 11:'11시', 12:'12시'};
  textMin:any = {0:'00분', 1: '01분', 2: '02분', 3:'03분', 4:'04분', 5:'05분', 6:'06분', 7:'07분', 8:'08분', 9:'09분', 10:'10분',
         11: '11분', 12: '12분', 13:'13분', 14:'14분', 15:'15분', 16:'16분', 17:'17분', 18:'18분', 19:'19분', 20:'20분',
         21: '21분', 22: '22분', 23:'23분', 24:'24분', 25:'25분', 26:'26분', 27:'27분', 28:'28분', 29:'29분', 30:'30분',
         31: '31분', 32: '32분', 33:'33분', 34:'34분', 35:'35분', 36:'36분', 37:'37분', 38:'38분', 39:'39분', 40:'40분',
         41: '41분', 42: '42분', 43:'43분', 44:'44분', 45:'45분', 46:'46분', 47:'47분', 48:'48분', 49:'49분', 50:'50분',
         51: '51분', 52: '52분', 53:'53분', 54:'54분', 55:'55분', 56:'56분', 57:'57분', 58:'58분', 59:'59분'};

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
