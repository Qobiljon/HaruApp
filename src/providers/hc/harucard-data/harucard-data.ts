import { Http } from '@angular/http';
import { Events, ToastController, Platform} from 'ionic-angular';
import { Injectable } from '@angular/core';
import { StorageProvider } from '../../providers/storage/storage';
import 'rxjs/add/operator/map';
 
@Injectable()
export class HaruCardDataProvider {

 	todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);

	items: Array<{num: number, no: number, targetdate: string, targetday: string, img: string, code: string, category: string, title: string, bookmark:boolean, read:boolean}> = [];

	constructor(public http: Http,
		public storage: StorageProvider,
		public platform: Platform,
		public events: Events,
		public toastCtrl: ToastController) {

		platform.ready().then(() => {

			events.subscribe('eventHaruCardBookmark:changed', (num, title, bookmark) => {
				console.log('구독 : 하루카드 북마크', num);

				for (let item of this.items) {
					if (item.num == num)
					{
						this.items[this.items.length - num].bookmark = (bookmark == 1) ? true : false;
						console.log('하루카드 북마크 발견', this.items.length - num);
						console.log('하루카드 북마크 발견', this.items[this.items.length - num ]);

						if (bookmark == 0)
						{
							let toast = this.toastCtrl.create({
								message:  '하루카드 "' + title +'"의 즐겨찾기를 해제하였습니다.',
								duration: 3000,
								position: 'middle'
							});
							toast.present();
						} else {
							let toast = this.toastCtrl.create({
								message:  '하루카드 "' + title +'"의 즐겨찾기를 등록하였습니다.',
								duration: 3000,
								position: 'middle'
							});
							toast.present();
						}

						break;
					}
				}
			});

			events.subscribe('eventHaruCardRead:changed', (num, last_read_date, point) => {
				console.log('구독 : 하루카드 읽기');

				for (let item of this.items) {
					if (item.num == num)
					{
						this.items[this.items.length - num].read = true;
					}
				}

				if (point > 0 && last_read_date == this.todayDate)
				{
					let toast = this.toastCtrl.create({
						message:  '오늘의 하루카드 읽기점수 ' + point + '점을 획득하셨습니다.',
						duration: 3000,
						position: 'middle'
					});
					toast.present();
				}
			});

		});

		let haruCardList = storage.getHaruCardList();
		let haruCardBookmarkList = this.storage.getHaruCardBookmarkInfo();
		let haruCardReadList = this.storage.getHaruCardReadInfo();

		for (let orderCount = haruCardList.length - 1; orderCount > -1; --orderCount) {
			let item = haruCardList[orderCount];
			this.items.push({ num: item.num, no: item.hc_no, targetdate: item.hc_targetdate, targetday: item.hc_targetday, img: item.hc_image[0], code: item.hc_code, category: item.hc_category_name, title: item.hc_title, bookmark: (haruCardBookmarkList[orderCount+1] == 1) ? true : false, read: (haruCardReadList[orderCount+1] == 1) ? true : false });
		}
	}

	filterItems(searchTerm) {
		return this.items.filter((item) => {
			return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
		});
	}
}
