import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../../providers/ht2/storage/storage';

@IonicPage()
@Component({
  selector: 'ht2-page-splash',
  templateUrl: 'ht2_splash.html',
})
export class Ht2SplashPage {

  params: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider) {

  	this.params.data = {
      "duration" : 3000,
      "backgroundImage" : 'assets/img/background.jpg',
      "logo" : 'assets/img/logo.png',
      "title" : '정신건강 자기관리 프로그램',
      "content" : '[ 수면 ]',
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
