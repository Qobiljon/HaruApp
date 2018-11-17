import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { StorageProvider } from '../../../providers/hc/storage/storage';
import { ApiProvider } from '../../../providers/hc/api/api';

@IonicPage()
@Component({
  selector: 'hc-page-history',
  templateUrl: 'hc_history.html',
})
export class HcHistoryPage {

	totalPoint:string = '0';

 	todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
	todayCount: number = 1;
	startDate: string = '';

	point_items: Array<{num: number, point_record: string, point: number}> = [];

	constructor(
		public viewCtrl: ViewController,
		public navCtrl: NavController,
		public events: Events,
		public api: ApiProvider,
		public storage: StorageProvider,
		public navParams: NavParams)
	{
		this.postHaruCardHistory();

		events.subscribe('totalPoint:changed', data => {
			this.totalPoint = data;
			console.log('totalPoint:changed', this.totalPoint);
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HistoryPage');
	}

	closeHistoryModal() {
		let data = { 'mode': 'close' };
		this.viewCtrl.dismiss(data);
	}

	postHaruCardHistory()
	{
		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harucard_history", "id":userInfo.id, "key":userInfo.key };

		console.log('postHaruCardHistory requestData', requestData);

		this.api.postData('harucard_history', requestData)
		.then((data) => {
			let responseListData:any = data;

			console.log('postHaruCardHistory responseListData : ', responseListData);
			if (responseListData.mode == 'harucard_history' && responseListData.code == 'ok')
			{
				this.storage.setTotalPoint(responseListData.result.total_point);
				this.storage.setHaruCardDateInfo(responseListData.result.date_info);

				let haruCardDateInfo = this.storage.getHaruCardDateInfo();

				if (haruCardDateInfo != null)
				{
					console.log('haruCardDateInfo', haruCardDateInfo);
					this.todayCount = haruCardDateInfo.today_count;
					this.startDate = haruCardDateInfo.start_date;
					this.todayDate = haruCardDateInfo.today_date;
				}

				let haruCardPointItems = responseListData.result.point_items;
				let haruCardPointRecordItems = responseListData.result.point_record_items;
				let bonus_items:any = responseListData.result.bonus_items;

				for (let orderCount = 1; orderCount <= this.todayCount; orderCount++) {
					let point:number = haruCardPointItems[orderCount];
					let point_record:string = haruCardPointRecordItems[orderCount];
					if (orderCount == 5) {
						point = Number(point) + Number(bonus_items[1]);
					} else if (orderCount == 10) {
						point = Number(point) + Number(bonus_items[2]);
					} else if (orderCount == 15) {
						point = Number(point) + Number(bonus_items[3]);
					} else if (orderCount == 20) {
						point = Number(point) + Number(bonus_items[4]);
					} else if (orderCount == 25) {
						point = Number(point) + Number(bonus_items[5]);
					} else if (orderCount == 30) {
						point = Number(point) + Number(bonus_items[6]);
					} else if (orderCount == 35) {
						point = Number(point) + Number(bonus_items[7]);
					} else if (orderCount == 40) {
						point = Number(point) + Number(bonus_items[8]);
					} else if (orderCount == 45) {
						point = Number(point) + Number(bonus_items[9]);
					}

					this.point_items.push({ num: orderCount, point_record: point_record, point: point});

					console.log('this.point_items', this.point_items);
				}

				
			}
		}, (err) => {
			// Error log
			console.log('error postHaruCardHistory');
		});
	}
}
