import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'hc-page-rating-history',
  templateUrl: 'hc_rating-history.html',
})
export class HcRatingHistoryPage {

	ratingNumItems:any;
	ratingDataItems:any;
	
	constructor(
		public viewCtrl: ViewController,
		public navCtrl: NavController,
		public storage: StorageProvider,
		public navParams: NavParams) {

	}

	ngOnInit() {
		console.log('ngOnInit');

		this.ratingNumItems = this.storage.getLastRatingGraphFullNum();
		this.ratingDataItems = this.storage.getLastRatingGraphFullData();
	}

	ngAfterViewInit() {
		console.log("afterinit");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RatingHistoryPage');
	}

	ngOnDestroy() {
		console.log('ngOnDestroy');
	}

	closeRatingHistoryModal() {
		let data = { 'mode': 'close' };

		this.viewCtrl.dismiss(data);
	}
}
