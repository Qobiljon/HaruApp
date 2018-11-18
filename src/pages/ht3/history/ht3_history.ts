import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';
import { ApiProvider } from '../../../providers/api/api';

@IonicPage()
@Component({
  selector: 'ht3-page-history',
  templateUrl: 'ht3_history.html',
})
export class Ht3HistoryPage {

	date: any;
	dayLabel: any;
	dayTables: Array<{num: number, date: string, point: number, bonus: number, zone: number, quiz: number, total: number}> = [];

	totalPoint:string = '0';

 	todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
	todayCount: number = 1;
	startDate: string = '';

	pointItems: Array<{num: number, point: number, bonus: number, zone: number, quiz: number}> = [];

	constructor(
		public viewCtrl: ViewController,
		public navCtrl: NavController,
		public events: Events,
		public api: ApiProvider,
		public storage: StorageProvider,
		public navParams: NavParams)
	{
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HistoryPage');

		this.postHaruTodayHistory();

		this.events.subscribe('totalPoint:changed', data => {
			this.totalPoint = data;
			console.log('totalPoint:changed', this.totalPoint);
		});
	}

	getDaysOfHistory()
	{
		console.log('getDaysOfHistory');

		let haruTodayDateInfo = this.storage.getHaruTodayDateInfo();

		if (haruTodayDateInfo != null)
		{
			console.log('haruTodayDateInfo', haruTodayDateInfo);

			this.todayCount = haruTodayDateInfo.today_count;
			this.startDate = haruTodayDateInfo.start_date;
		}
		else
		{
			return;
		}

		console.log('this.startDate', this.startDate);
		this.date = new Date(this.startDate.substring(5, 7) + '/' + this.startDate.substring(8, 10) + '/' + this.startDate.substring(0, 4));
		console.log('this.date', this.date);

		this.dayLabel = this.date.getDay();

		for (var i = 0; i < this.dayLabel-1; i++) {
			this.dayTables.push({num:0, date:'', point:0, bonus:0, zone:0, quiz:0, total:0});
		}

		let count = this.dayLabel;
		let realDay = 1 ;
		for (let day = 1;day <= 48;count++) {

			if ( (count % 7) == 0 || (count % 7) == 6)
			{
				//
			} else {
				let currentDate = new Date(this.date);

				currentDate.setDate(this.date.getDate() + realDay - 1);

				let total:number = Number(this.pointItems[day-1].point) + Number(this.pointItems[day-1].bonus) + Number(this.pointItems[day-1].zone) + Number(this.pointItems[day-1].quiz);

				this.dayTables.push({num:day, date:(currentDate.getMonth()+1)+'월'+currentDate.getDate()+'일', point:this.pointItems[day-1].point, bonus:this.pointItems[day-1].bonus, zone:this.pointItems[day-1].zone, quiz:this.pointItems[day-1].quiz, total:total});

				day++;
			}

			realDay++;
		}

		count = this.dayLabel;
		if ((7 - (count % 7) + 1) < 5) {
			for (let left = 0;left < (7 - (count % 7) + 1); left++) {
				this.dayTables.push({num:0, date:'', point:0, bonus:0, zone:0, quiz:0, total:0});
			}
		}

		return;
	}

	postHaruTodayHistory()
	{
		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harutoday_history", "id":userInfo.id, "key":userInfo.key };

		console.log('postHaruTodayHistory requestData', requestData);

		this.api.postData('harutoday_history', requestData)
		.then((data) => {
			let responseListData:any = data;

			console.log('postHaruTodayHistory responseListData : ', responseListData);
			if (responseListData.mode == 'harutoday_history' && responseListData.code == 'ok')
			{
				this.storage.setTotalPoint(responseListData.result.total_point);
				this.storage.setHaruTodayDateInfo(responseListData.result.date_info);

				this.totalPoint = responseListData.result.total_point;

				let haruTodayDateInfo = this.storage.getHaruTodayDateInfo();

				if (haruTodayDateInfo != null)
				{
					console.log('haruTodayDateInfo', haruTodayDateInfo);
					this.todayCount = haruTodayDateInfo.today_count;
					this.startDate = haruTodayDateInfo.start_date;
					this.todayDate = haruTodayDateInfo.today_date;
				}

				let point_items = responseListData.result.point_items;
				let bonus_items = responseListData.result.bonus_items;
				let zone_items = responseListData.result.zone_items;
				let quiz_items = responseListData.result.quiz_items;

				this.pointItems.length = 0;

				for (let orderCount = 1; orderCount <= this.todayCount; orderCount++) {
					let point:number = Number(point_items[orderCount]);
					let bonus:number = Number(bonus_items[orderCount]);
					let zone:number = Number(zone_items[orderCount]);
					let quiz:number = Number(quiz_items[orderCount]);

					this.pointItems.push({ num: orderCount, point: point, bonus: bonus, zone: zone, quiz: quiz});
				}

				this.getDaysOfHistory();
			}
		}, (err) => {
			// Error log
			console.log('error postHaruTodayHistory');
		});
	}

	closeHistoryModal() {
		let data = { 'mode': 'close' };
		this.viewCtrl.dismiss(data);
	}
}
