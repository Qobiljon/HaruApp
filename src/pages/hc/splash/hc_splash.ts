import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../../providers/hc/storage/storage';

@IonicPage()
@Component({
  selector: 'hc-page-splash',
  templateUrl: 'hc_splash.html',
})
export class HcSplashPage {

  params: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider) {

    let appPartName = this.storage.getAppPartName();

  	this.params.data = {
      "duration" : 3000,
      "backgroundImage" : 'assets/hc/img/background.jpg',
      "logo" : 'assets/hc/img/logo.png',
      "title" : '정신건강 자기관리 프로그램',
      "content" : appPartName,
      "copyright" : 'assets/hc/img/copyright.png'
  	}

  	this.params.events = {
  		"onRedirect" : function() {
  			  console.log('redirect');

          if (storage.isLoggedIn())
          {
              navCtrl.setRoot('HcTabsPage');
          } else {
              navCtrl.setRoot('HcLoginPage');
          }
  		}
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

}
