import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, Tabs, Searchbar, IonicPage } from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';
import { HaruCardFavoritesDataProvider } from '../../../providers/hc/harucard-favorites-data/harucard-favorites-data';

@IonicPage()
@Component({
  selector: 'hc-page-favorites',
  templateUrl: 'hc_favorites.html',
})
export class HcFavoritesPage {
	todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
	responseData: any = {};

	searchTerm: string = '';

	items: Array<{num: number, no: number, targetdate: string, img: string, code: string, category: string, title: string, bookmark: boolean, read:boolean}> = [];

	title: string = '하루카드 즐겨찾기';

	@ViewChild('searchbar') searchbar: Searchbar;

	constructor(
		public tabs: Tabs,
		public navCtrl: NavController,
		public navParams: NavParams,
		public platform: Platform,
		public storage: StorageProvider,
		public haruCardFavoritesData: HaruCardFavoritesDataProvider)
	{
		this.tabs = this.navCtrl.parent;
  	}

	setSearchbar() {
		this.searchbar.setFocus();
	} 

	itemTapped(event, item) {
		console.log('itemTapped', item);
		this.platform.ready().then( () => {
			// 아이템을 등록하고 탭으로 이동한다.
			this.storage.setSelectHaruCardItem(item);				
			this.tabs.select(1);
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FavoritesPage');
	}

	ionViewWillEnter() {

		console.log('하루카드 즐겨찾기 : 리스트 모드');
		this.title = '하루카드 즐겨찾기';

		this.setFilteredItems();
	}	

	setFilteredItems() {
		this.items = this.haruCardFavoritesData.filterItems(this.searchTerm);
	}
}
