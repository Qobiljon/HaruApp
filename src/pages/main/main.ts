import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  haruCardPage(){
    this.navCtrl.setRoot('HcTabsPage');
  }

  haruToday1Page(){
    this.navCtrl.setRoot('Ht1TabsPage');
  }

  haruToday2Page(){
    this.navCtrl.setRoot('Ht2TabsPage');
  }

  haruToday3Page(){
    this.navCtrl.setRoot('Ht3TabsPage');
  }
}
