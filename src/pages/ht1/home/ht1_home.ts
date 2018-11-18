import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, Events, Platform, App, Tabs, IonicPage } from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';
import { UtilProvider } from '../../../providers/util/util';
import { ApiProvider } from '../../../providers/api/api';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Ht1PgConfig } from '../config/pg.config';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'ht1-page-home',
  templateUrl: 'ht1_home.html'
})
export class Ht1HomePage {
	/* Common */
	pgConfig = new Ht1PgConfig(0);

	alarmUse: boolean = false;
	alarmMode: string = '오전';
	alarmHour: string = '10';
	alarmMin: string = '00';

	params: any = {};

	userName: string;
	totalPoint: string = '0';

	appPartName: string;
	appPart: string = '1';

 	todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
	todayCount: number = 1;
	startDate: string = '';
	testDate: string = '';
	testDateText: string = ''; // 년-월-일

	ratingJoined:boolean = false;
	ratingPoint: number = 0;
	ratingText: string = '오늘하루 기분평가 그래프';

    @ViewChild('lineCanvas') lineCanvas;

	objLineChart: any;

	items: Array<{num: number, pnum: number, mtitle: string, ztitle: string, ptitle: string, mcode: string, zcode: string, pcode: string, count: number, targetdate: string, targetday: string, bookmark:boolean, read:boolean }> = [];

	rootNavCtrl: NavController;

	constructor(
		public appCtrl: App,
		public navCtrl: NavController,
		public navParams: NavParams,
		public tabs: Tabs,
		public storage: StorageProvider,
		public events: Events,
		public platform: Platform, 
		public modalCtrl: ModalController,
		public util: UtilProvider,
		public api: ApiProvider,
		public localNotifications: LocalNotifications,
		public backgroundMode: BackgroundMode)
	{
		this.rootNavCtrl = this.appCtrl.getRootNavs()[0];

		tabs = this.navCtrl.parent;

		events.subscribe('postHaruTodayInfo:changed', (read, testDateText, title, ratingJoined, ratingPoint, totalPoint) => {

			let msg = this.storage.getLocalNotifications();

			if (msg != '' && read == 0)
			{
				this.storage.setLocalNotifications('');

				this.util.alert('[오늘하루] "' + title + '" 알림이 도착했습니다.');
			}

			this.testDateText = testDateText;
			this.ratingJoined = ratingJoined;
			this.ratingPoint = ratingPoint;
			this.totalPoint = totalPoint;

			this.drawLineChart();

			// 기프티콘 선택 팝업 체크
			this.openGift(this.totalPoint);

			return;
		});

		events.subscribe('eventHaruTodayBookmark:changed', (num, title, bookmark) => {
			console.log('구독 : 오늘하루 북마크', num);

			this.items[0].bookmark = (bookmark == 1) ? true : false;

			return;
		});

		events.subscribe('alarmInfo:changed', (alarmUse, alarmMode, alarmHour, alarmMin) => {
			this.alarmUse = alarmUse;
			this.alarmMode = alarmMode;
			this.alarmHour = alarmHour;
			this.alarmMin = alarmMin;

			if (this.alarmUse) {
				this.scheduleNotification();
			} else {
				this.cancelAll();
				this.util.toast('오늘하루 알림 시간이 해제되었습니다.', 1500, 'bottom');
			}

			return;
		});

		events.subscribe('lastRatingDate:changed', (data) => {
			this.ratingPoint = this.storage.getCurrentRatingPoint();
			if (this.storage.hasRatingJoined())
				this.ratingJoined = true;

			return;
		});

		if (this.platform.is('cordova')) {
			this.backgroundMode.enable();
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomePage');

		if (this.platform.is('cordova')) {
			this.platform.ready().then(() => {
				this.localNotifications.hasPermission().then(function (granted) {
					if (!granted) {
						// IOS10의 권한 설정
						this.localNotifications.registerPermission();
					}
				});
			});
		}
	}

	scheduleNotification()
	{
		console.log('scheduleNotification');

		this.util.toast('오늘하루 알림이 '+this.pgConfig.textAmPm[this.alarmMode]+' '+this.pgConfig.textHour[this.alarmHour]+' '+this.pgConfig.textMin[this.alarmMin]+'으로 설정되었습니다.', 1500, 'bottom');

		let todayDate = new Date(Date.now());
		let dayCount:number = todayDate.getDay();

		console.log('todayDate : ', todayDate);
		console.log('todayDate.getDay() : ', dayCount);

		let startDate = new Date(todayDate);

		if (dayCount == 6) {
			startDate.setDate(todayDate.getDate() + 2);
		} else if (dayCount == 7) {
			startDate.setDate(todayDate.getDate() + 1);
		}

		console.log('startDate : ', startDate);

		let realDay:number = 0;
		let count:number = startDate.getDay();

		let chosenHours:number = Number(this.alarmHour);
		let chosenMinutes:number = Number(this.alarmMin);
		let chosenSeconds:number = 0;
		if (this.alarmMode == '오후') {
			chosenHours += 12;
		}

		if (this.alarmUse === true)
		{
			if (this.platform.is('cordova')) {
				this.localNotifications.requestPermission().then((permission) => {
					// Cancel any existing notifications
					this.localNotifications.cancelAll().then(() => {

						for (let day = 1;day <= 5;count++) {

							if ( (count % 7) != 0 && (count % 7) != 6)
							{
								let currentDateTime = new Date();
								currentDateTime.setDate(startDate.getDate() + realDay);
								currentDateTime.setHours(chosenHours);
								currentDateTime.setMinutes(chosenMinutes);
								currentDateTime.setSeconds(chosenSeconds);

								console.log('currentDateTime : ', currentDateTime);

								this.localNotifications.schedule({
									id: Math.floor(Math.random()*1001),
									title: '[오늘하루] 정신건강 자기관리 프로그램',
									text: '오늘하루 알림이 도착했습니다.',
									firstAt: currentDateTime,
									led: 'FF0000',
									sound: this.setAlarmSound(),
									data: { msg: '오늘하루 알림이 도착했습니다.' },
									every: 'week',
								});

								day++;
							}

							realDay++;
						}
					});
				});
			};
		}

		return;
	}

	setAlarmSound() {
		if (this.platform.is('android')) {
			return 'file://assets/ht1/audio/alarm.mp3'
		} else {
			return 'file://assets/ht1/audio/alarm.caf'
		}
	}

	cancelAll() {
		if (this.platform.is('cordova')) {
			this.localNotifications.cancelAll();
		}
	}

	ngOnInit() {
		console.log('ngOnInit()');

		let alarmInfo = this.storage.getAlarmInfo();

		if (alarmInfo != null)
		{
			this.alarmUse = alarmInfo.alarmUse;
			this.alarmMode = alarmInfo.alarmMode;
			this.alarmHour = alarmInfo.alarmHour;
			this.alarmMin = alarmInfo.alarmMin;
		}

		// 회원정보 업데이트
		this.storage.changeUserInfo();
		let userInfo = this.storage.getUserInfo();
		this.userName = userInfo.name;

		this.ratingJoined = false;
		this.ratingPoint = 0;

		// 오늘하루 메타정보 리스트 조회
		this.postHaruTodayMenu();
	}

	ngOnDestroy() {
		console.log('ngOnDestroy');
	}

	goRefresh() {
		console.log('리프레쉬');
		// 리프레쉬
		this.tabs.select(0);
		this.postHaruTodayMenu();
	} 

	itemTapped(event, item) {
		console.log('itemTapped', item);

		this.platform.ready().then( () => {
			this.util.toast(item.ptitle + ' 회기로 이동합니다.', 3000, 'bottom');
			// 아이템을 등록하고 탭으로 이동한다.
			this.storage.setSelectHaruTodayItem(item);				
			this.tabs.select(1);
		});
	}

	postHaruTodayInfo()
	{
		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harutoday_info", "id":userInfo.id, "key":userInfo.key, "app_name": this.util.getAppName(), "app_os": this.util.getAppOS(), "app_ver": this.util.getAppVersion() };

		console.log('postHaruTodayInfo requestData', requestData);

		this.api.postData('harutoday_info', requestData)
		.then((data) => {
			let responseData:any = data;

			console.log('postHaruTodayInfo responseData : ', responseData);
			if (responseData.mode == 'harutoday_info' && responseData.code == 'ok')
			{
				this.storage.setHaruTodayRatingInfo(responseData.result.rating_items);
				this.storage.setHaruTodayReadInfo(responseData.result.read_items);
				this.storage.setHaruTodayBookmarkInfo(responseData.result.bookmark_items);

				this.storage.setHaruTodayDateInfo(responseData.result.date_info);
				this.storage.setLastReadDate(responseData.result.last_read_date);
				this.storage.setLastBookmarkDate(responseData.result.last_bookmark_date);
				this.storage.setLastRatingDate(responseData.result.last_rating_date);
				this.storage.setLastRatingGraphNum(responseData.result.rating_graph_num_items);
				this.storage.setLastRatingGraphData(responseData.result.rating_graph_data_items);
				this.storage.setLastRatingGraphFullNum(responseData.result.rating_graph_full_num_items);
				this.storage.setLastRatingGraphFullData(responseData.result.rating_graph_full_data_items);
				this.storage.setGiftItem(responseData.result.gift_items);

				this.storage.setTotalPoint(responseData.result.total_point);

				if (this.appPart != responseData.result.part)
				{
					this.util.alert(this.userName + '님은 현재 오늘하루 [우울·불안] 대상자가 아닙니다.');

					this.rootNavCtrl.push('LoginPage', {
						pageName: 'logout'
					});
					return;
				}

				console.log('getAppVersion() : ', parseInt(this.util.getAppVersion().replace(/\./g, '')) );
				console.log('config_ver : ', parseInt(responseData.result.config_ver.replace(/\./g, '')) );

				if (parseInt(this.util.getAppVersion().replace(/\./g, '')) < parseInt(responseData.result.config_ver.replace(/\./g, '')) )
				{
					this.util.alert('최신 버전으로 업데이트 해주시기 바랍니다.');

					this.openUrl(responseData.result.config_link);
				}

				this.storage.setAppPart(responseData.result.part);

				this.appPartName = this.storage.getAppPartName();
				this.appPart = this.storage.getAppPart();

				this.ratingPoint = this.storage.getCurrentRatingPoint();
				if (this.storage.hasRatingJoined())
					this.ratingJoined = true;

				let haruTodayDateInfo = this.storage.getHaruTodayDateInfo();

				if (haruTodayDateInfo != null)
				{
					console.log('haruTodayDateInfo', haruTodayDateInfo);

					this.todayCount = haruTodayDateInfo.today_count;
					this.startDate = haruTodayDateInfo.start_date;
					this.todayDate = haruTodayDateInfo.today_date;
					this.testDate = haruTodayDateInfo.test_date;
					this.testDateText = haruTodayDateInfo.test_datetext;
				}

				this.totalPoint = this.storage.getTotalPoint();

				this.items.length = 0;

				let haruTodayMenu = this.storage.getHaruTodayMenu();
				let haruTodayBookmarkList = this.storage.getHaruTodayBookmarkInfo();
				let haruTodayReadList = this.storage.getHaruTodayReadInfo();

				let title:string = '';
				if (haruTodayMenu != null) {
					let orderCount = haruTodayMenu.length - 1;
					let item = haruTodayMenu[orderCount];

					title = item.ht_ptitle;
					this.items.push({ num: item.num, pnum: item.ht_pnum, mtitle: item.ht_mtitle, ztitle: item.ht_ztitle, ptitle: item.ht_ptitle, mcode: item.ht_mcode, zcode: item.ht_zcode, pcode: item.ht_pcode, count: item.ht_count, targetdate: item.ht_targetdate, targetday: item.ht_targetday, bookmark: (haruTodayBookmarkList[orderCount] == 1) ? true : false, read: (haruTodayReadList[orderCount] == 1) ? true : false });
				}

				this.postHaruTodayLoadUserData(this.todayCount);

				this.storage.eventPostHaruTodayInfo(haruTodayMenu[this.todayCount], this.testDateText, title, this.ratingJoined, this.ratingPoint, this.totalPoint);
			}
		}, (err) => {
			// Error log
			console.log('error postHaruTodayInfo');
		});
	}

	drawLineChart()
	{
		this.objLineChart = new Chart(this.lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: this.storage.getLastRatingGraphNum(),
				datasets: [{
					label: this.ratingText,
					fill: false,
					lineTension: 0,
					backgroundColor: "rgba(249, 146, 168, 0.4)",
					borderColor: "rgba(249, 146, 168, 1.0)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.1,
					borderJoinStyle: 'circle',
					pointBorderColor: "rgba(249, 146, 168, 1.0)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(249, 146, 168, 1.0)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: this.storage.getLastRatingGraphData(),
					spanGaps: false,
				}]
			},
			options: {
				legend: {
					display: false,
				},
				scales: {
					yAxes: [{
						ticks: {
							max : 10,
							min : 0,
							stepSize: 2
						}
					}]
				}
			}
		});

		this.objLineChart = new Chart(this.lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: this.storage.getLastRatingGraphNum(),
				datasets: [{
					label: this.ratingText,
					fill: false,
					lineTension: 0,
					backgroundColor: "rgba(249, 146, 168, 0.4)",
					borderColor: "rgba(249, 146, 168, 1.0)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.1,
					borderJoinStyle: 'circle',
					pointBorderColor: "rgba(249, 146, 168, 1.0)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(249, 146, 168, 1.0)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: this.storage.getLastRatingGraphData(),
					spanGaps: false,
				}]
			},
			options: {
				legend: {
					display: true,
				},
				scales: {
					yAxes: [{
						ticks: {
							max : 10,
							min : 0,
							stepSize: 1
						}
					}],
					xAxes: [{
						ticks: {
							max : 7,
							min : 0,
							stepSize: 1
						}
					}],
				}
			}
		});
	}

	postHaruTodayMenu()
	{
		let userInfo = this.storage.getUserInfo();

		let pgConfig = new Ht1PgConfig(0);

		let requestData = {"mode": "harutoday_menu", "id":userInfo.id, "key":userInfo.key, "mcode":pgConfig.mcode, "app_name": this.util.getAppName(), "app_os": this.util.getAppOS(), "app_ver": this.util.getAppVersion() };

		console.log('postHaruTodayMenu requestData', requestData);

		this.api.postData('harutoday_menu', requestData)
		.then((data) => {
			let responseData:any = data;

			console.log('postHaruTodayMenu responseData : ', responseData);
			if (responseData.mode == 'harutoday_menu' && responseData.code == 'ok')
			{
				this.storage.setHaruTodayMenu(responseData.result.harutoday_menu_items);

				// 오늘하루 정보 불러오기
				this.postHaruTodayInfo();
			}
		}, (err) => {
			// Error log
			console.log('error postHaruTodayMenu');
		});
	}

	postHaruTodayLoadUserData(todayCount)
	{
		let userInfo = this.storage.getUserInfo();

		let pgConfig = new Ht1PgConfig(todayCount);

		if (pgConfig.namePgClassPrev == '') {
			return;
		}

		let requestData = {"mode": "harutoday_load_userdata", "id":userInfo.id, "key":userInfo.key, "mcode":pgConfig.mcode, "latest_pnum": todayCount};

		console.log('postHaruTodayLoadUserData requestData', requestData);

		this.api.postData('harutoday_load_userdata', requestData)
		.then((data) => {
			let responseData:any = data;

			console.log('postHaruTodayLoadUserData responseData');

			if (responseData.mode == 'harutoday_load_userdata' && responseData.code == 'ok')
			{
				console.log('DB로부터 사용자데이터 불러오기');

				let userdata_items = responseData.result.userdata_items;

				if (userdata_items != null) {

					for (let item of userdata_items) {
						// console.log('responseData.userdata_items', item);

						if (item.pnum < 10) {
							this.storage.set('dtPg0'+String(item.pnum), item.userdata);
						} else {
							this.storage.set('dtPg'+String(item.pnum), item.userdata);
						}
					}
				}
			}

		}, (err) => {
			// Error log
			console.log('error postHaruTodayLoadUserData');
		});
	}

	openHistory()
	{
		let historyModal = this.modalCtrl.create('Ht1HistoryPage');

		historyModal.onDidDismiss(data => {
			if (data.mode == 'close') {
				console.log('close history');
			}
		});

		historyModal.present();	
	}

	openRatingHistory()
	{
		let ratingHistoryModal = this.modalCtrl.create('Ht1RatingHistoryPage');

		ratingHistoryModal.onDidDismiss(data => {
		if (data.mode == 'close') {
			console.log('close rating history');
		} else {
			console.log('send rating history : ', data);
		}
		});

		ratingHistoryModal.present();	
	}

	openRatingGraph()
	{
		let ratingGraphModal = this.modalCtrl.create('Ht1RatingGraphPage');

		ratingGraphModal.onDidDismiss(data => {
		if (data.mode == 'close') {
			console.log('close rating graph');
		} else {
			console.log('send rating graph : ', data);
		}
		});

		ratingGraphModal.present();	
	}

	openAlarm()
	{
		let alarmModal = this.modalCtrl.create('Ht1AlarmPage');

		alarmModal.onDidDismiss(data => {
			if (data.mode == 'close') {
				console.log('close alarm');
			} else {
				console.log('send alarm : ', data);
				// 리프레쉬
				this.goRefresh();
			}
		});

		alarmModal.present(); 
	}

	openGift(totalPoint)
	{
		let selectCount:number = 0;

		let giftItem = this.storage.getGiftItem();
		if ( giftItem !=null && giftItem.activated == 1)
		{
			if (giftItem.gift_record1 == null && totalPoint >=450 && totalPoint < 900) {
				selectCount = 1;
			}

			if (giftItem.gift_record2 == null && totalPoint >=900 && totalPoint < 1350) {
				selectCount = 2;
			}

			if (giftItem.gift_record3 == null && totalPoint >=1350 && totalPoint < 1800) {
				selectCount = 3;
			}

			if (giftItem.gift_record4 == null && totalPoint >=1800 && totalPoint < 2250) {
				selectCount = 4;
			}

			if (giftItem.gift_record5 == null && totalPoint >=2250) {
				selectCount = 5;
			}

			if (selectCount > 0) {
				// 기프티콘 선택 팝업
				let giftModal = this.modalCtrl.create('Ht1GiftPage');

				giftModal.onDidDismiss(data => {
				if (data.mode == 'close') {
					console.log('close gift');

					this.postHaruTodaySelectGift(selectCount, data.select_no);
				} else {
					console.log('send gift : ', data);
				}
				});

				giftModal.present();
			}
		}

		return;
	}

	postHaruTodaySelectGift(selectCount, selectNum)
	{
		let userInfo = this.storage.getUserInfo();
		let requestData = {"mode": "harutoday_select_gift", "id":userInfo.id, "key":userInfo.key, "select_count":selectCount, "select_num": selectNum};

		console.log('postHaruTodaySelectGift requestData', requestData);

		this.api.postData('harutoday_select_gift', requestData)
		.then((data) => {
			let responseData:any = data;

			console.log('postHaruTodaySelectGift responseData');

			if (responseData.mode == 'harutoday_select_gift' && responseData.code == 'ok')
			{
				this.util.toast('기프티콘을 신청하였습니다.');
			}

		}, (err) => {
			// Error log
			console.log('error postHaruTodayLoadUserData');
		});
	}

	openUrl(url) {
		this.util.openUrl(url);
	}
}
