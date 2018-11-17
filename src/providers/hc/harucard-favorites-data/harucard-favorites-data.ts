import { Http } from '@angular/http';
import { Events, Platform} from 'ionic-angular';
import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import 'rxjs/add/operator/map';
 
@Injectable()
export class HaruCardFavoritesDataProvider {

	items: Array<{num: number, no: number, targetdate: string, targetday: string, img: string, code: string, category: string, title: string, bookmark:boolean, read:boolean}> = [];

	constructor(public http: Http,
		public storage: StorageProvider,
		public platform: Platform,
		public events: Events) {

		platform.ready().then(() => {

			events.subscribe('eventHaruCardBookmark:changed', (num, title, bookmark) => {
				console.log('구독 : 하루카드 즐겨찾기 북마크', num);

				this.items.length = 0;

				let haruCardList = storage.getHaruCardList();
				let haruCardBookmarkList = this.storage.getHaruCardBookmarkInfo();
				let haruCardReadList = this.storage.getHaruCardReadInfo();

				for (let orderCount = haruCardList.length - 1; orderCount > -1; --orderCount) {
					let item = haruCardList[orderCount];
					if (haruCardBookmarkList[orderCount+1] == 1) {
						this.items.push({ num: item.num, no: item.hc_no, targetdate: item.hc_targetdate, targetday: item.hc_targetday, img: item.hc_image[0], code: item.hc_code, category: item.hc_category_name, title: item.hc_title, bookmark: (haruCardBookmarkList[orderCount+1] == 1) ? true : false, read: (haruCardReadList[orderCount+1] == 1) ? true : false });
					}
				}
			});

			events.subscribe('eventHaruCardRead:changed', (num, last_read_date, point) => {
				console.log('구독 : 하루카드 즐겨찾기 읽기', num);

				this.items.length = 0;

				let haruCardList = storage.getHaruCardList();
				let haruCardBookmarkList = this.storage.getHaruCardBookmarkInfo();
				let haruCardReadList = this.storage.getHaruCardReadInfo();

				for (let orderCount = haruCardList.length - 1; orderCount > -1; --orderCount) {
					let item = haruCardList[orderCount];
					if (haruCardBookmarkList[orderCount+1] == 1) {
						this.items.push({ num: item.num, no: item.hc_no, targetdate: item.hc_targetdate, targetday: item.hc_targetday, img: item.hc_image[0], code: item.hc_code, category: item.hc_category_name, title: item.hc_title, bookmark: (haruCardBookmarkList[orderCount+1] == 1) ? true : false, read: (haruCardReadList[orderCount+1] == 1) ? true : false });
					}
				}
			});

		});

		let haruCardList = storage.getHaruCardList();
		let haruCardBookmarkList = this.storage.getHaruCardBookmarkInfo();
		let haruCardReadList = this.storage.getHaruCardReadInfo();

		for (let orderCount = haruCardList.length - 1; orderCount > -1; --orderCount) {
			let item = haruCardList[orderCount];
			if (haruCardBookmarkList[orderCount+1] == 1) {
				this.items.push({ num: item.num, no: item.hc_no, targetdate: item.hc_targetdate, targetday: item.hc_targetday, img: item.hc_image[0], code: item.hc_code, category: item.hc_category_name, title: item.hc_title, bookmark: (haruCardBookmarkList[orderCount+1] == 1) ? true : false, read: (haruCardReadList[orderCount+1] == 1) ? true : false });
			}
		}

		console.log('즐겨찾기 갯수 :', this.items.length);
	}

	filterItems(searchTerm) {
		return this.items.filter((item) => {
			return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
		});
	}
}
