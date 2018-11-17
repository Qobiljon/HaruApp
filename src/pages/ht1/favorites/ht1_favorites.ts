import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'ht1-page-favorites',
  templateUrl: 'ht1_favorites.html',
})
export class Ht1FavoritesPage {

	todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);

	title: string = '오늘하루 즐겨찾기';
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FavoritesPage');
	}
}
