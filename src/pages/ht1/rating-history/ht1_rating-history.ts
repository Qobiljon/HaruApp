import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'ht1-page-rating-history',
  templateUrl: 'ht1_rating-history.html',
})
export class Ht1RatingHistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingHistoryPage');
  }

}
