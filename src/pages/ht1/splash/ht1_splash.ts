import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../../providers/ht1/storage/storage';

@IonicPage()
@Component({
  selector: 'ht1-page-splash',
  templateUrl: 'ht1_splash.html',
})
export class Ht1SplashPage {

  params: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider) {

  	this.params.data = {
      "duration" : 3000,
      "backgroundImage" : 'assets/img/background.jpg',
      "logo" : 'assets/img/logo.png',
      "title" : '정신건강 자기관리 프로그램',
      "content" : '[ 우울 · 불안 ]',
      "copyright" : 'assets/img/copyright.png'
  	}

  	this.params.events = {
  		"onRedirect" : function() {
  			  console.log('redirect');

          if (storage.isLoggedIn())
          {
              navCtrl.setRoot('TabsPage');
          } else {
              navCtrl.setRoot('LoginPage');
          }
  		}
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

}
