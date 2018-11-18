import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, Slides } from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';
import { UtilProvider } from '../../../providers/util/util';

@IonicPage()
@Component({
  selector: 'hc-page-gift',
  templateUrl: 'hc_gift.html',
})
export class HcGiftPage {

  @ViewChild(Slides) slides: Slides;

  currentIndex:number = 1;
  data1: string = '';
  data2: string = '';
  data3: string = '';
  data4: string = ''; 
  data5: string = '';

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public util: UtilProvider,
    public storage: StorageProvider)
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftPage');

    let giftItem = this.storage.getGiftItem();

    this.data1 = giftItem.data1;
    this.data2 = giftItem.data2;
    this.data3 = giftItem.data3;
    this.data4 = giftItem.data4;
    this.data5 = giftItem.data5;
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex() + 1;
  }

  confirm() {
    console.log('confirm GiftPage');

    let data = { 'mode': 'close', 'select_no': this.currentIndex};
    this.viewCtrl.dismiss(data);
  }
}
