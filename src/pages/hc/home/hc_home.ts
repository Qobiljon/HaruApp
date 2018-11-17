import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, Events, Platform, Tabs, IonicPage } from 'ionic-angular';
import { StorageProvider } from '../../../providers/hc/storage/storage';
import { ApiProvider } from '../../../providers/hc/api/api';
import { UtilProvider } from '../../../providers/hc/util/util';
import { Chart } from 'chart.js';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'hc-page-home',
  templateUrl: 'hc_home.html'
})
export class HcHomePage {
	/* Common */
	textAmPm:any = {'오전':'오전', '오후':'오후'};
	textHour:any = {0:'00시', 1:'01시', 2:'02시', 3:'03시', 4:'04시', 5:'05시', 6:'06시', 7:'07시', 8:'08시', 9:'09시', 10:'10시', 11:'11시', 12:'12시'};
	textMin:any = {0:'00분', 1: '01분', 2: '02분', 3:'03분', 4:'04분', 5:'05분', 6:'06분', 7:'07분', 8:'08분', 9:'09분', 10:'10분',
	11: '11분', 12: '12분', 13:'13분', 14:'14분', 15:'15분', 16:'16분', 17:'17분', 18:'18분', 19:'19분', 20:'20분',
	21: '21분', 22: '22분', 23:'23분', 24:'24분', 25:'25분', 26:'26분', 27:'27분', 28:'28분', 29:'29분', 30:'30분',
	31: '31분', 32: '32분', 33:'33분', 34:'34분', 35:'35분', 36:'36분', 37:'37분', 38:'38분', 39:'39분', 40:'40분',
	41: '41분', 42: '42분', 43:'43분', 44:'44분', 45:'45분', 46:'46분', 47:'47분', 48:'48분', 49:'49분', 50:'50분',
	51: '51분', 52: '52분', 53:'53분', 54:'54분', 55:'55분', 56:'56분', 57:'57분', 58:'58분', 59:'59분'};

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
 	todayWeekDay:number = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).getDay();
	todayCount: number = 1;
	startDate: string = '';
	testDate: string = '';

	ratingJoined:boolean = false;
	ratingPoint: number = 0;
	ratingText: string = '하루카드 기분평가 그래프';

    @ViewChild('lineCanvas') lineCanvas;

	lineChart: any;

	items: Array<{num: number, no: number, targetdate: string, targetday: string, img: string, code: string, category: string, title: string, bookmark:boolean, read:boolean}> = [];

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public tabs: Tabs,
		public storage: StorageProvider,
		public events: Events,
		public platform: Platform, 
		public modalCtrl: ModalController,
		public util: UtilProvider,
		public api: ApiProvider,
		public localNotifications: LocalNotifications,
		public backgroundMode: BackgroundMode) {

		tabs = this.navCtrl.parent;

		events.subscribe('postHaruCardInfo:changed', (read, testDate, title, ratingJoined, ratingPoint, totalPoint) => {

			let msg = this.storage.getLocalNotifications();

			if (msg != '' && read == 0)
			{
				this.storage.setLocalNotifications('');

				this.util.alert('[하루카드] "' + title + '" 알림이 도착했습니다.');
			}

			this.testDate = testDate;
			this.ratingJoined = ratingJoined;
			this.ratingPoint = ratingPoint;
			this.totalPoint = totalPoint;

			this.drawChart();

			// 기프티콘 선택 팝업 체크
			this.openGift(this.totalPoint);

			return;
		});

		events.subscribe('eventHaruCardBookmark:changed', (num, title, bookmark) => {
			console.log('구독 : 하루카드 북마크', num);

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

		events.subscribe('eventHaruCardRead:changed', (num, last_read_date, point) => {
			console.log('구독 : 하루카드 읽기', num);
			// 점수 갱신
			this.totalPoint = this.storage.getTotalPoint();

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

		this.util.toast('하루카드 알림이 '+this.textAmPm[this.alarmMode]+' '+this.textHour[this.alarmHour]+' '+this.textMin[this.alarmMin]+'으로 설정되었습니다.', 1500, 'bottom');

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
									title: '[하루카드] 정신건강 자기관리 프로그램',
									text: '하루카드 알림이 도착했습니다.',
									firstAt: currentDateTime,
									led: 'FF0000',
									sound: this.setAlarmSound(),
									data: { msg: '하루카드드 알림이 도착했습니다.' },
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
			return 'file://assets/hc/audio/alarm.mp3'
		} else {
			return 'file://assets/hc/audio/alarm.caf'
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

		// 하루카드 메타정보 리스트 조회
		this.postHaruCardList();

		return;
	}

	ngOnDestroy() {
		console.log('ngOnDestroy');
	}

	goRefresh() {
		console.log('리프레쉬');
		// 리프레쉬
		this.tabs.select(0);
		this.postHaruCardList();
	} 

	itemTapped(event, item) {
		console.log('itemTapped', this.todayWeekDay);

		if (this.storage.hasRatingJoined() || this.todayWeekDay >= 6)
		{
			console.log('itemTapped', item);
			this.platform.ready().then( () => {
				// 아이템을 등록하고 탭으로 이동한다.
				this.storage.setSelectHaruCardItem(item);				
				this.tabs.select(1);
			});
		}
		else
		{
			let ratingModal = this.modalCtrl.create('HcRatingPage');

			ratingModal.onDidDismiss(data => {
				if (data.mode == 'close') {
					console.log('close rating');
				} else {
					console.log('send rating : ', data);

					// 리프레쉬
					this.goRefresh();				
				}
			});

			ratingModal.present();
		}
	}

	postHaruCardInfo()
	{
		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harucard_info", "id":userInfo.id, "key":userInfo.key, "app_name": this.util.getAppName(), "app_os": this.util.getAppOS(), "app_ver": this.util.getAppVersion() };

		console.log('postHaruCardInfo requestData', requestData);

		this.api.postData('harucard_info', requestData)
		.then((data) => {
			let responseData:any = data;

			console.log('postHaruCardInfo responseData : ', responseData);
			if (responseData.mode == 'harucard_info' && responseData.code == 'ok')
			{
				this.storage.setHaruCardRatingInfo(responseData.result.rating_items);
				this.storage.setHaruCardReadInfo(responseData.result.read_items);
				this.storage.setHaruCardBookmarkInfo(responseData.result.bookmark_items);

				this.storage.setHaruCardDateInfo(responseData.result.date_info);
				this.storage.setLastReadDate(responseData.result.last_read_date);
				this.storage.setLastBookmarkDate(responseData.result.last_bookmark_date);
				this.storage.setLastRatingDate(responseData.result.last_rating_date);
				this.storage.setLastRatingGraphNum(responseData.result.rating_graph_num_items);
				this.storage.setLastRatingGraphData(responseData.result.rating_graph_data_items);
				this.storage.setLastRatingGraphFullNum(responseData.result.rating_graph_full_num_items);
				this.storage.setLastRatingGraphFullData(responseData.result.rating_graph_full_data_items);				
				this.storage.setTotalPoint(responseData.result.total_point);
				this.storage.setAppPart(responseData.result.part);

				this.appPartName = this.storage.getAppPartName();
				this.appPart = this.storage.getAppPart();

				this.ratingPoint = this.storage.getCurrentRatingPoint();
				if (this.storage.hasRatingJoined())
					this.ratingJoined = true;

				let haruCardDateInfo = this.storage.getHaruCardDateInfo();

				if (haruCardDateInfo != null)
				{
					console.log('haruCardDateInfo', haruCardDateInfo);

					this.todayCount = haruCardDateInfo.today_count;
					this.startDate = haruCardDateInfo.start_date;
					this.todayDate = haruCardDateInfo.today_date;
					this.testDate = haruCardDateInfo.test_date;
				}

				this.totalPoint = this.storage.getTotalPoint();

				this.items.length = 0;

				let haruCardList = this.storage.getHaruCardList();
				let haruCardBookmarkList = this.storage.getHaruCardBookmarkInfo();
				let haruCardReadList = this.storage.getHaruCardReadInfo();

				let title:string = '';
				if (haruCardList != null) {
					let orderCount = haruCardList.length - 1;
					let item = haruCardList[orderCount];

					title = item.hc_title;
					this.items.push({ num: item.num, no: item.hc_no, targetdate: item.hc_targetdate, targetday: item.hc_targetday, img: item.hc_image[0], code: item.hc_code, category: item.hc_category_name, title: item.hc_title, bookmark: (haruCardBookmarkList[orderCount] == 1) ? true : false, read: (haruCardReadList[orderCount] == 1) ? true : false  });
				}

				this.storage.eventPostHaruCardInfo(haruCardReadList[this.todayCount], this.testDate, title, this.ratingJoined, this.ratingPoint, this.totalPoint);
			}
		}, (err) => {
			// Error log
			console.log('error postHaruCardInfo');
		});
	}

	drawChart()
	{
		this.lineChart = new Chart(this.lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: this.storage.getLastRatingGraphNum(),
				datasets: [{
					label: this.ratingText,
					fill: false,
					lineTension: 0,
					backgroundColor: "rgba(106, 104, 193, 0.4)",
					borderColor: "rgba(106, 104, 193, 1.0)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.1,
					borderJoinStyle: 'circle',
					pointBorderColor: "rgba(106, 104, 193, 1.0)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(106, 104, 193, 1.0)",
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
	}

	postHaruCardList()
	{
		let userInfo = this.storage.getUserInfo();

		let requestData = { "mode": "harucard_list", "id":userInfo.id, "key":userInfo.key };

		console.log('postHaruCardList requestData', requestData);

		this.api.postData('harucard_list', requestData).then((data) => {
			let responseData:any = data;

			console.log('postHaruCardList responseData : ', responseData);
			if (responseData.mode == 'harucard_list' && responseData.code == 'ok')
			{
				this.storage.setHaruCardList(responseData.result.items);

				// 하루카드 정보 불러오기
				this.postHaruCardInfo();
			}
		}, (err) => {
			// Error log
			console.log('error postHaruCardList');
		});
	}

	openRating()
	{
		console.log('openRating', this.storage.hasRatingJoined());

		if (this.storage.hasRatingJoined())
		{
			this.util.alert('기분평가를 이미 참여하셨습니다.');
		}
		else
		{
			let ratingModal = this.modalCtrl.create('HcRatingPage');

			ratingModal.onDidDismiss(data => {
			if (data.mode == 'close') {
				console.log('close rating');
			} else {
				console.log('send rating : ', data);
				// 리프레쉬
				this.goRefresh();
			}
			});

			ratingModal.present();
		}
	}

	openHistory()
	{
		let historyModal = this.modalCtrl.create('HistoryPage');

		historyModal.onDidDismiss(data => {
			if (data.mode == 'close') {
				console.log('close history');
			}
		});

		historyModal.present();	
	}

	openRatingHistory()
	{
		let ratingHistoryModal = this.modalCtrl.create('RatingHistoryPage');

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
		let ratingGraphModal = this.modalCtrl.create('RatingGraphPage');

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
		let alarmModal = this.modalCtrl.create('HcAlarmPage');

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

			if (giftItem.gift_record2 == null && totalPoint >=900) {
				selectCount = 2;
			}

			if (selectCount > 0) {
				// 기프티콘 선택 팝업
				let giftModal = this.modalCtrl.create('GiftPage');

				giftModal.onDidDismiss(data => {
				if (data.mode == 'close') {
					console.log('close gift');

					this.postHaruCardSelectGift(selectCount, data.select_no);
				} else {
					console.log('send gift : ', data);
				}
				});

				giftModal.present();
			}
		}

		return;
	}

	postHaruCardSelectGift(selectCount, selectNum)
	{
		let userInfo = this.storage.getUserInfo();
		let requestData = {"mode": "harucard_select_gift", "id":userInfo.id, "key":userInfo.key, "select_count":selectCount, "select_num": selectNum};

		console.log('postHaruCardSelectGift requestData', requestData);

		this.api.postData('harucard_select_gift', requestData)
		.then((data) => {
			let responseData:any = data;

			console.log('postHaruCardSelectGift responseData');

			if (responseData.mode == 'harucard_select_gift' && responseData.code == 'ok')
			{
				this.util.toast('기프티콘을 신청하였습니다.');
			}

		}, (err) => {
			// Error log
			console.log('error postHaruCardSelectGift');
		});
	}
}
