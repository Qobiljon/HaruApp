import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ViewController, NavParams, Events, Platform, IonicPage } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Media, MediaObject } from '@ionic-native/media';
import { StatusBar } from '@ionic-native/status-bar';
import { StorageProvider } from '../../../providers/ht2/storage/storage';
import { UtilProvider } from '../../../providers/ht2/util/util';
import { ApiProvider } from '../../../providers/ht2/api/api';
import { Chart } from 'chart.js';
import { Ht2PgConfig } from '../config/pg.config';
import { Ht2Pg36Data } from './ht2_pg36.data';

@IonicPage()
@Component({
  selector: 'ht2-page-pg36',
  templateUrl: 'ht2_pg36.html',
})
export class Ht2Pg36Page {

	/* Common */
	pgConfig = new Ht2PgConfig(36);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;
	@ViewChild('pieCanvas') pieCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg = new Ht2Pg36Data();

	/* 파이차트 */
	objPieChart1: any;
	isPieChart1Passed: boolean = false;

	objPieChart2: any;
	isPieChart2Passed: boolean = false;

	objPieChart3: any;
	isPieChart3Passed: boolean = false;

	objPieChart4: any;
	isPieChart4Passed: boolean = false;

	objPieChart5: any;
	isPieChart5Passed: boolean = false;

	objPieChart6: any;
	isPieChart6Passed: boolean = false;

	constructor(
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public navParams: NavParams,
		public platform: Platform,
		public screenOrientation: ScreenOrientation,
		public statusBar: StatusBar,
		public storage: StorageProvider,
		public events: Events,
		public util: UtilProvider,
		public api: ApiProvider,
		public media: Media	
	){

	ionViewDidLoad() {
		console.log('ionViewDidLoad Pg36Page');
	}

	// 사용자데이터 저장
	saveUcData(isPassed: boolean)
	{
		console.log('saveUcData');

		if (this.storage.getLastReadDate() != "")
			this.dtPg.sceneCurrent = this.pgConfig.sceneNumber;
		else 
			this.dtPg.sceneCurrent = 1;

		if (this.dtPg.isUcPassed == false && isPassed == true)
			this.dtPg.isUcPassed = true;

		this.storage.setObject(this.pgConfig.namePgClassCurrent, this.dtPg);
	}

	// 사용자데이터 불러오기
	loadUcData()
	{
		console.log('loadUcData');

		let dtPgData = new Ht2Pg36Data();
		dtPgData = this.storage.getObject(this.pgConfig.namePgClassCurrent);

		if (typeof dtPgData !== 'undefined' && dtPgData != null)
		{
			console.log('loadUcData', dtPgData);

			this.dtPg = dtPgData;

			// 현재 씬 번호
			this.pgConfig.sceneNumber = this.dtPg.sceneCurrent;
		}
	}

	ngOnInit() {
		console.log('ngOnInit');

		this.pgConfig.userInfo = this.storage.getUserInfo();

		this.itemTarget = this.navParams.get('itemTarget');
		this.pgConfig.sceneNumber = this.navParams.get('sceneNumber');
		this.pgConfig.sceneMaxNumber = this.itemTarget.count;

		// 사용자데이터 불러오기
		this.loadUcData();

		console.log('sceneNumber : ', this.pgConfig.sceneNumber);
		console.log('sceneMaxNumber : ', this.pgConfig.sceneMaxNumber);

		// 오늘하루 회기 데이터 조회
		this.postHaruTodayDataList(this.itemTarget);

		// 수면효율 조회
		this.initTodaySleep();

		// 볼륨상태
		this.pgConfig.volumeState = this.storage.getVolumeState();

		this.showPage();
	}

	initTodaySleep()
	{
		console.log('ngOnInit');

		// 수면효율 조회
		this.refreshRatingData();

		// 수면효율 이벤트
		this.events.subscribe('haruTodayRatingInfo:changed', (data) => {
			this.refreshRatingData();

			this.pgConfig.isTodaySleepRating = true;
		});

		// 수면효율 참여시
		if (this.pgConfig.itemTodaySleepRating[this.itemTarget.pnum] != -1) {
			this.pgConfig.isTodaySleepRating = true;
			this.pgConfig.countTodaySleepRating = this.pgConfig.itemTodaySleepRating[this.itemTarget.pnum];
		}

		console.log('today_date : ', this.pgConfig.todayDate);
		console.log('targetdate : ', this.itemTarget.targetdate);
		console.log('수면효율 상태 : ', this.pgConfig.isTodaySleepRating);
	}

	refreshRatingData()
	{
		this.pgConfig.itemTodaySleepRating = this.storage.getHaruTodayRatingInfo();

		this.pgConfig.itemTodaySleepDays.length = 0;
		this.pgConfig.itemTodaySleepGraphs.length = 0;
		for (let i = 1; i <= this.itemTarget.pnum; i++) {
			this.pgConfig.itemTodaySleepDays.push(i.toLocaleString() + '회기');
			this.pgConfig.itemTodaySleepGraphs.push(this.pgConfig.itemTodaySleepRating[i]);
		}
	}

	// 볼륨버튼 변경
	changeVolumeState()
	{
		if (this.pgConfig.volumeState == '1')
		{
			this.pgConfig.volumeState = '0';

			if (this.file) {
				this.file.stop();
				this.file.release();
			}
		} else {
			this.pgConfig.volumeState = '1';	
		}

		this.storage.setVolumeState(this.pgConfig.volumeState);
	}

	playSound(base_audio, pcode, sound) {

		console.log('playSound() base_audio : ', base_audio);
		console.log('playSound() pcode : ', pcode);
		console.log('playSound() sound : ', sound);

		if (this.file) {
			this.file.stop();
			this.file.release();
		}

		if (sound != '')
		{
			this.file = this.media.create(base_audio + pcode + '/'+ sound);

			if (this.pgConfig.volumeState == '1') {
				this.file.play();
			}
		}
	}

	postHaruTodayDataList(item)
	{
		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harutoday_data_list", "id":userInfo.id, "key":userInfo.key, "mcode":item.mcode, "zcode":item.zcode, "pcode":item.pcode, "part_no": this.pgConfig.part_no, "pnum": this.pgConfig.numberPg, "app_name": this.util.getAppName(), "app_os": this.util.getAppOS(), "app_ver": this.util.getAppVersion() };

		console.log('postHaruTodayDataList requestData', requestData);

		this.api.postData('harutoday_data_list', requestData)
		.then((data) => {
			let responseData:any = data;

			console.log('postHaruTodayDataList responseData : ', responseData);
			if (responseData.mode == 'harutoday_data_list' && responseData.code == 'ok')
			{
				let haruTodayDataList = responseData.result.harutoday_data_items;
				this.storage.setHaruTodayDataList(haruTodayDataList);

				this.item = haruTodayDataList[this.pgConfig.sceneNumber-1];

				let harutoday_userdata = responseData.result.harutoday_userdata;

				if (harutoday_userdata != null && harutoday_userdata != '')
				{
					// DB로부터 사용자데이터 불러오기
					this.storage.set(this.pgConfig.namePgClassCurrent, harutoday_userdata);
					this.loadUcData();
				}

				if (this.item != null) {
					console.log('postHaruTodayDataList() this.item : ', this.item);

					this.showPage();
				}
			}
		}, (err) => {
			// Error log
			console.log('error postHaruTodayDataList');
		});
	}

	goPrev()
	{
		if (this.pgConfig.isLineChartPassed == true)
			return;

		if (this.isPieChart1Passed == true)
			return;

		if (this.isPieChart2Passed == true)
			return;

		if (this.isPieChart3Passed == true)
			return;

		if (this.isPieChart4Passed == true)
			return;

		if (this.isPieChart5Passed == true)
			return;

		if (this.isPieChart6Passed == true)
			return;

		if (this.pgConfig.sceneNumber <= 1) {
			this.pgConfig.sceneNumber = 1;
			return;
		}

		this.pgConfig.sceneNumber--;

		console.log('goPrev() this.pgConfig.sceneNumber : ', this.pgConfig.sceneNumber);

		this.showPage();
	}

	goNext()
	{
		if (this.pgConfig.isLineChartPassed == true)
			return;

		if (this.isPieChart1Passed == true)
			return;

		if (this.isPieChart2Passed == true)
			return;

		if (this.isPieChart3Passed == true)
			return;

		if (this.isPieChart4Passed == true)
			return;

		if (this.isPieChart5Passed == true)
			return;

		if (this.isPieChart6Passed == true)
			return;

		if (this.checkInput() == true)
		{
			if (this.pgConfig.sceneNumber >= this.pgConfig.sceneMaxNumber) {
				if (this.storage.isExistHaruTodayReadInfo(this.itemTarget.pnum) == true)
				{
					this.finish();
				} else {
					if (this.pgConfig.isTodayRead == false)
					{
						this.pgConfig.isTodayRead = true;
						this.sendTodayRead();
					} else {
						this.finish();
					}
				}
				return;
			}

			this.pgConfig.sceneNumber++;
		} else {
			return;
		}

		console.log('goNext() this.pgConfig.sceneNumber : ', this.pgConfig.sceneNumber);

		this.showPage();
	}

	scrollToTop() {
		this.content.scrollToTop();
	}

	checkInput()
	{
		console.log('checkInput()');

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcSleepTime[1] && !this.pgConfig.isTodaySleepRating) {
			if (this.dtPg.isUcSleepTime[1] == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcSleepTime[2] && !this.pgConfig.isTodaySleepRating) {
			if (this.dtPg.isUcSleepTime[2] == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcSleepTime[3] && !this.pgConfig.isTodaySleepRating) {
			if (this.dtPg.isUcSleepTime[3] == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.pgConfig.sceneTodaySleepRating) {
			if (this.pgConfig.isTodaySleepRating == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating16) {
			if (this.dtPg.countUcFeelRating16 == -1) {
				this.util.toast('이때의 기분점수를 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating16 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput20) {
			if (this.dtPg.countUcInput20 == -1) {
				this.util.toast('이때의 생각점수를 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput20 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput24) {
			if (this.dtPg.resultUcInput24[1] == -1 ||
				this.dtPg.resultUcInput24[2] == -1 ||
				this.dtPg.resultUcInput24[3] == -1 ||
				this.dtPg.resultUcInput24[4] == -1 ||
				this.dtPg.resultUcInput24[5] == -1)
			{
				this.util.toast('모든 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput24 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput25) {
			if (this.dtPg.sumUcInput25 == 0)
			{
				this.util.toast('보기의 퍼센트를 입력하세요.');
				return false;
			} else if (this.dtPg.isUcInput25 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput33) {
			if (this.dtPg.resultUcInput33 == -1) {
				this.util.toast('보기의 답을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput33 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput36) {
			if (this.dtPg.resultUcInput36 == -1) {
				this.util.toast('보기의 답을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput36 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating37) {
			if (this.dtPg.countUcFeelRating37 == -1) {
				this.util.toast('이때의 기분점수를 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating37 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput41) {
			if (this.dtPg.countUcInput41 == -1) {
				this.util.toast('이때의 생각점수를 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput41 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcQuiz1) {
			if (this.dtPg.resultUcQuiz1 == -1) {
				this.util.toast('보기의 답을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcQuiz1 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcQuiz2) {
			if (this.dtPg.resultUcQuiz2 == -1) {
				this.util.toast('보기의 답을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcQuiz2 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		}

		return true;
	}

	showPage()
	{
		clearInterval(this.soundTimer);
		clearInterval(this.chartTimer);
	
		if (this.pgConfig.isLineChartPassed == true)
			return;

		if (this.isPieChart1Passed == true)
			return;

		if (this.isPieChart2Passed == true)
			return;

		if (this.isPieChart3Passed == true)
			return;

		if (this.isPieChart4Passed == true)
			return;

		if (this.isPieChart5Passed == true)
			return;

		if (this.isPieChart6Passed == true)
			return;

		this.scrollToTop();

		let haruTodayDataList = this.storage.getHaruTodayDataList();

		if (typeof haruTodayDataList == 'undefined' || haruTodayDataList == null)
			return;

		this.item = haruTodayDataList[this.pgConfig.sceneNumber-1];

		if (typeof this.item == 'undefined' || this.item == null)
			return;

		console.log('showPage() this.item : ', this.item);

		if (this.item.ht_userdata == this.dtPg.sceneUcData42) {
			this.showUcData42();
		}

		if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime[1]) {
			this.showUcSleepTime(1);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime[2]) {
			this.showUcSleepTime(2);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime[3]) {
			this.showUcSleepTime(3);
		} else if (this.item.ht_userdata == this.pgConfig.sceneTodaySleepRating) {
			this.showTodaySleepRating();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcQuiz1) {
			this.showUcQuiz1();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcQuiz2) {
			this.showUcQuiz2();
		}

		if (this.item.ht_tpcode == 'hcct017') {
			this.pgConfig.isLineChartPassed = true;

			this.chartTimer = setTimeout(() => {
				this.drawLineChart();
			}, 500);
		}

		if (this.item.ht_userdata == this.dtPg.sceneUcData27) {
			this.isPieChart1Passed = true;

			this.chartTimer = setTimeout(() => {
				this.drawPieChart1();
			}, 500);
		}

		if (this.item.ht_userdata == this.dtPg.sceneUcData28) {
			this.isPieChart2Passed = true;

			this.chartTimer = setTimeout(() => {
				this.drawPieChart2();
			}, 500);
		}

		if (this.item.ht_userdata == this.dtPg.sceneUcData29) {
			this.isPieChart3Passed = true;

			this.chartTimer = setTimeout(() => {
				this.drawPieChart3();
			}, 500);
		}

		if (this.item.ht_userdata == this.dtPg.sceneUcData30) {
			this.isPieChart4Passed = true;

			this.chartTimer = setTimeout(() => {
				this.drawPieChart4();
			}, 500);
		}

		if (this.item.ht_userdata == this.dtPg.sceneUcData31) {
			this.isPieChart5Passed = true;

			this.chartTimer = setTimeout(() => {
				this.drawPieChart5();
			}, 500);
		}

		if (this.item.ht_userdata == this.dtPg.sceneUcData32) {
			this.isPieChart6Passed = true;

			this.chartTimer = setTimeout(() => {
				this.drawPieChart6();
			}, 500);
		}

		this.soundTimer = setTimeout(() => {
			this.playSound(this.item.ht_base_audio, this.item.ht_pcode, this.item.ht_audio);
		}, 500);
	}

	showUcSleepTime(num)
	{
		console.log('showUcSleepTime()', num);
		return;
	}

	showTodaySleepRating()
	{
		console.log('showTodaySleepRating()');

		let bedTime:number = 0;
		let sleepTime:number = 0;
		let wakeTime:number = 0;
		let wakeUpTime:number = 0;

		if (this.dtPg.resultUcSleepTime[1].ampm == '오후') {
			bedTime += (12 * 60);
		}
		bedTime += (Number(this.dtPg.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg.resultUcSleepTime[1].min);

		if (this.dtPg.resultUcSleepTime[2].ampm == '오후') {
			sleepTime += (12 * 60);
		}
		sleepTime += (Number(this.dtPg.resultUcSleepTime[2].hour) * 60) + Number(this.dtPg.resultUcSleepTime[2].min);

		if (this.dtPg.resultUcSleepTime[3].ampm == '오후') {
			wakeTime += (12 * 60);
		}
		wakeTime += (Number(this.dtPg.resultUcSleepTime[3].hour) * 60) + Number(this.dtPg.resultUcSleepTime[3].min);

		console.log("showTodaySleepRating() bedTime :", bedTime);
		console.log("showTodaySleepRating() sleepTime :", sleepTime);
		console.log("showTodaySleepRating() wakeTime :", wakeTime);

		// 침대에 누워있던 시간
		if (bedTime > 12 * 60) {
			this.dtPg.countUcSleepTime[1] = (24 * 60) - bedTime + wakeTime;
		} else {
			this.dtPg.countUcSleepTime[1] = bedTime - wakeTime;
		}

		// 잠자리에 든 시간
		if (sleepTime > 12 * 60) {
			this.dtPg.countUcSleepTime[2] = (24 * 60) - sleepTime + wakeTime;
		} else {
			this.dtPg.countUcSleepTime[2] = sleepTime - wakeTime;
		}

		wakeUpTime = Number(this.dtPg.resultUcWakeTime.hour) * 60;

		// 실제 수면시간
		this.dtPg.countUcSleepTime[3] = this.dtPg.countUcSleepTime[2] - wakeUpTime;

		if (this.dtPg.countUcSleepTime[1] == 0)
		{
			this.pgConfig.countTodaySleepRating = 0;
		} else {
			this.pgConfig.countTodaySleepRating = Math.round((this.dtPg.countUcSleepTime[3] * 100) / this.dtPg.countUcSleepTime[1]);
		}

		// 침대에 누워있던 시간 (시/분)
		this.dtPg.resultUcRangeTime[1].hour = Math.floor(this.dtPg.countUcSleepTime[1] / 60);
		this.dtPg.resultUcRangeTime[1].min = (this.dtPg.countUcSleepTime[1] % 60);

		// 잠자리에 든 시간 (시/분)
		this.dtPg.resultUcRangeTime[2].hour = Math.floor(this.dtPg.countUcSleepTime[2] / 60);
		this.dtPg.resultUcRangeTime[2].min = (this.dtPg.countUcSleepTime[2] % 60);

		// 실제 수면시간 (시/분)
		this.dtPg.resultUcRangeTime[3].hour = Math.floor(this.dtPg.countUcSleepTime[3] / 60);
		this.dtPg.resultUcRangeTime[3].min = (this.dtPg.countUcSleepTime[3] % 60);

		console.log("showTodaySleepRating() this.dtPg.countUcSleepTime[1] :", this.dtPg.countUcSleepTime[1]);
		console.log("showTodaySleepRating() this.dtPg.countUcSleepTime[2] :", this.dtPg.countUcSleepTime[2]);
		console.log("showTodaySleepRating() this.dtPg.countUcSleepTime[3] :", this.dtPg.countUcSleepTime[3]);

		return;
	}

	showUcQuiz1()
	{
		console.log('showUcQuiz1()');
		return;
	}

	showUcQuiz2()
	{
		console.log('showUcQuiz2()');
		return;
	}

	showUcData42()
	{
		console.log('showUcData42()');

		if (this.dtPg.countUcInput20 <= 3)
		{
			this.dtPg.selectUcData42 = 1;
		} else {
			if (this.dtPg.countUcInput20 > this.dtPg.countUcInput41) {
				this.dtPg.selectUcData42 = 2;
			} else {
				this.dtPg.selectUcData42 = 3;
			}
		}

		return;
	}

	sendUcFeelRating16()
	{
		console.log("sendUcFeelRating16", this.dtPg.countUcFeelRating16);

		if (this.dtPg.countUcFeelRating16 == -1)
		{
			this.util.toast('기분점수를 선택하세요.');
			return;
		} else {
			this.util.toast('기분점수를 평가하셨습니다.');
			this.dtPg.isUcFeelRating16 = true;

			return;		
		}
	}

	sendUcInput20()
	{
		console.log("sendUcInput20", this.dtPg.countUcInput20);

		if (this.dtPg.countUcInput20 == -1)
		{
			this.util.toast('생각점수를 선택하세요.');
			return;
		} else {
			this.util.toast('생각점수를 평가하셨습니다.');
			this.dtPg.isUcInput20 = true;

			return;		
		}
	}

	sendUcOrder24(num)
	{
		console.log('sendUcOrder24()');

		for (let step:number = 1; step <=5; step++) {
			if (this.dtPg.orderUcInput24[step] == -1)
			{
				this.dtPg.orderUcInput24[step] = num;
				this.dtPg.resultUcInput24[num] = step;
				break;
			}
		}
	}

	removeUcOrder24(num)
	{
		console.log('removeUcOrder24()');

		for (let step:number = 1; step <=5; step++) {
			if (this.dtPg.orderUcInput24[step] == num)
			{
				this.dtPg.orderUcInput24[step] = -1;
				this.dtPg.resultUcInput24[num] = -1;
				break;
			}
		}
	}

	sendUcInput24()
	{
		console.log("sendUcInput24");

		if (this.dtPg.resultUcInput24[1] == -1 ||
			this.dtPg.resultUcInput24[2] == -1 ||
			this.dtPg.resultUcInput24[3] == -1 ||
			this.dtPg.resultUcInput24[4] == -1 ||
			this.dtPg.resultUcInput24[5] == -1)
		{
			this.util.toast('모든 항목을 선택하세요.');
			return;
		} else {
			this.util.toast('대상 항목을 선택하셨습니다.');
			this.dtPg.isUcInput24 = true;

			return;		
		}
	}

	changeUp(num) {
		console.log('changeUp()');

		if (this.dtPg.sumUcInput25 < 100 && this.dtPg.resultUcInput25[num] < 100)
		{
			this.dtPg.resultUcInput25[num] += 5;

			this.dtPg.sumUcInput25 = this.dtPg.resultUcInput25[1];
			this.dtPg.sumUcInput25 += this.dtPg.resultUcInput25[2];
			this.dtPg.sumUcInput25 += this.dtPg.resultUcInput25[3];
			this.dtPg.sumUcInput25 += this.dtPg.resultUcInput25[4];

			this.dtPg.resultUcInput25[5] = 100 - this.dtPg.sumUcInput25;
		} else {
			this.util.toast('합계가 100을 넘을 수 없습니다.');
		}

		return;
	}

	changeDown(num) {
		console.log('changeDown()');

		if (this.dtPg.sumUcInput25 >= 5 && this.dtPg.resultUcInput25[num] >= 5)
		{
			this.dtPg.resultUcInput25[num] -= 5;

			this.dtPg.sumUcInput25 = this.dtPg.resultUcInput25[1];
			this.dtPg.sumUcInput25 += this.dtPg.resultUcInput25[2];
			this.dtPg.sumUcInput25 += this.dtPg.resultUcInput25[3];
			this.dtPg.sumUcInput25 += this.dtPg.resultUcInput25[4];

			this.dtPg.resultUcInput25[5] = 100 - this.dtPg.sumUcInput25;
		} else {
			this.util.toast('합계가 0 이상이어야 합니다.');
		}

		return;
	}

	sendUcInput25()
	{
		console.log('sendUcInput25()');

		if (this.dtPg.sumUcInput25 == 0)
		{
			this.util.toast('보기의 퍼센트를 입력하세요.');
			return;
		} else {
			this.dtPg.isUcInput25 = true;
			return;
		}
	}

	sendUcInput33()
	{
		console.log('sendUcInput33()');

		if (this.dtPg.resultUcInput33 == -1)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput33 == this.dtPg.passUcInput33) {
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput33 = true;
			return;
		} else {
			this.dtPg.countUcInput33--;

			if (this.dtPg.countUcInput33 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput33 = true;
				this.dtPg.resultUcInput33 = this.dtPg.passUcInput33;
			}

			return;
		}
	}

	sendUcInput36()
	{
		console.log('sendUcInput36()');

		if (this.dtPg.resultUcInput36 == -1)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput36 == this.dtPg.passUcInput36) {
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput36 = true;
			return;
		} else {
			this.dtPg.countUcInput36--;

			if (this.dtPg.countUcInput36 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput36 = true;
				this.dtPg.resultUcInput36 = this.dtPg.passUcInput36;
			}

			return;
		}
	}

	sendUcFeelRating37()
	{
		console.log("sendUcFeelRating37", this.dtPg.countUcFeelRating37);

		if (this.dtPg.countUcFeelRating37 == -1)
		{
			this.util.toast('기분점수를 선택하세요.');
			return;
		} else {
			this.util.toast('기분점수를 평가하셨습니다.');
			this.dtPg.isUcFeelRating37 = true;

			return;		
		}
	}

	sendUcInput41()
	{
		console.log("sendUcInput41", this.dtPg.countUcInput41);

		if (this.dtPg.countUcInput41 == -1)
		{
			this.util.toast('생각점수를 선택하세요.');
			return;
		} else {
			this.util.toast('생각점수를 평가하셨습니다.');
			this.dtPg.isUcInput41 = true;

			return;		
		}
	}

	sendUcQuiz1()
	{
		console.log('sendUcQuiz1()');

		if (this.dtPg.resultUcQuiz1 == -1)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcQuiz1 == this.dtPg.passUcQuiz1) {
			this.util.alert('잘 하셨습니다.');
			this.pgConfig.pointQuiz += 5;
			this.dtPg.isUcQuiz1 = true;
			return;
		} else {
			this.dtPg.countUcQuiz1--;

			if (this.dtPg.countUcQuiz1 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('응답 횟수를 초과하였습니다.');
				this.dtPg.isUcQuiz1 = true;
				this.dtPg.resultUcQuiz1 = this.dtPg.passUcQuiz1;
			}

			return;
		}
	}

	sendUcQuiz2()
	{
		console.log('sendUcQuiz2()');

		if (this.dtPg.resultUcQuiz2 == -1)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcQuiz2 == this.dtPg.passUcQuiz2) {
			this.util.alert('잘 하셨습니다.');
			this.pgConfig.pointQuiz += 5;
			this.dtPg.isUcQuiz2 = true;
			return;
		} else {
			this.dtPg.countUcQuiz2--;

			if (this.dtPg.countUcQuiz2 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('응답 횟수를 초과하였습니다.');
				this.dtPg.isUcQuiz2 = true;
				this.dtPg.resultUcQuiz2 = this.dtPg.passUcQuiz2;
			}

			return;
		}
	}

	ngAfterViewInit() {
		console.log("afterinit");

		// get current
		console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

		this.platform.ready().then(() => {
			this.statusBar.hide();

			if (this.platform.isPortrait() && (this.platform.is('ios') || this.platform.is('android'))) {

				// set to landscape
				this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).catch(function() {
					console.log("Orientation error");
				});

			}
		});

		// detect orientation changes
		this.screenOrientation.onChange().subscribe(() => {
			console.log("Orientation Changed");
		});
	}

	ngOnDestroy() {
		console.log('ngOnDestroy');

		if (this.file) {
			this.file.stop();
			this.file.release();
		}

		clearInterval(this.soundTimer);
		clearInterval(this.chartTimer);

		this.statusBar.show();

		if (this.platform.isLandscape() && (this.platform.is('ios') || this.platform.is('android'))) {
			// set to portrait
			this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).catch(function() {
				console.log("set to portrait error");
			});
		};
	}

	close()
	{
		// 사용자데이터 중간 저장
		this.saveUcData(false);

		this.platform.ready().then( () => {
			if (this.file) {
				this.file.stop();
				this.file.release();
			}
			
			this.navCtrl.pop();
		});
	}
 
	finish()
	{
		// 사용자데이터 최종 저장
		this.saveUcData(true);

		this.platform.ready().then( () => {
			if (this.file) {
				this.file.stop();
				this.file.release();
			}
			
			// 사용자데이터 서버 전송
			this.sendSaveTodayUserData();
		});
	}

	sendSaveTodayUserData()
	{
		console.log("sendSaveTodayUserData");

		let dtPgData:string = this.storage.get(this.pgConfig.namePgClassCurrent);
		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harutoday_save_userdata", "id": userInfo.id, "key": userInfo.key, "pcount": this.itemTarget.pnum, "userdata": dtPgData};

		console.log('sendSaveTodayUserData requestData', requestData);

		this.api.postData('harutoday_save_userdata', requestData).then((data) => {

		let responseData:any = data;

		console.log('sendSaveTodayUserData responseData', responseData);

			if (responseData.mode == 'harutoday_save_userdata' && responseData.code == 'ok')
			{
				// 종료
				this.util.closePopAlert('수고하셨습니다.', this.navCtrl);
			}
		}, (err) => {
			// Error log
			console.log('error sendSaveTodayUserData');

			this.navCtrl.pop();
		});

		return;
	}

	/* time */
	changeAmPmUp(num)
	{
		if (this.dtPg.resultUcSleepTime[num].ampm == '오전') {
			this.dtPg.resultUcSleepTime[num].ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime[num].ampm = '오전';
		}
	}

	changeAmPmDown(num)
	{
		if (this.dtPg.resultUcSleepTime[num].ampm == '오전') {
			this.dtPg.resultUcSleepTime[num].ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime[num].ampm = '오전';
		}
	}

	changeHourUp(num)
	{
		if (this.dtPg.resultUcSleepTime[num].hour == 12) {
			this.dtPg.resultUcSleepTime[num].hour = 1;
		} else {
			this.dtPg.resultUcSleepTime[num].hour += 1;
		}
	}

	changeHourDown(num)
	{
		if (this.dtPg.resultUcSleepTime[num].hour == 1) {
			this.dtPg.resultUcSleepTime[num].hour = 12;
		} else {
			this.dtPg.resultUcSleepTime[num].hour -= 1;
		}
	}

	changeMinUp(num)
	{
		if (this.dtPg.resultUcSleepTime[num].min == 55) {
			this.dtPg.resultUcSleepTime[num].min = 0;
		} else {
			this.dtPg.resultUcSleepTime[num].min += 5;
		}
	}

	changeMinDown(num)
	{
		if (this.dtPg.resultUcSleepTime[num].min == 0) {
			this.dtPg.resultUcSleepTime[num].min = 55;
		} else {
			this.dtPg.resultUcSleepTime[num].min -= 5;
		}
	}

	changeWakeHourUp()
	{
		let sleepHour:number = 0;
		let wakeHour:number = 0;
		let maxHour:number = 0;

		if (this.dtPg.resultUcSleepTime[2].ampm == '오전') {
			sleepHour = this.dtPg.resultUcSleepTime[2].hour;
		} else {
			sleepHour = this.dtPg.resultUcSleepTime[2].hour + 12;
		}

		if (this.dtPg.resultUcSleepTime[3].ampm == '오전') {
			wakeHour = this.dtPg.resultUcSleepTime[3].hour;
		} else {
			wakeHour = this.dtPg.resultUcSleepTime[3].hour + 12;
		}

		maxHour = 24 - sleepHour + wakeHour;

		if (this.dtPg.resultUcWakeTime.hour < maxHour)
		{
			if (this.dtPg.resultUcWakeTime.hour >= 11) {
				this.dtPg.resultUcWakeTime.hour = 12;
			} else {
				this.dtPg.resultUcWakeTime.hour += 1;
			}
		} else {
			this.util.toast('전체 수면 시간을 초과할 수 없습니다.');
		}
	}

	changeWakeHourDown()
	{
		if (this.dtPg.resultUcWakeTime.hour <= 1) {
			this.dtPg.resultUcWakeTime.hour = 0;
		} else {
			this.dtPg.resultUcWakeTime.hour -= 1;
		}
	}


	sendUcSleepTime(num)
	{
		console.log('sendUcSleepTime', num);

		if (this.dtPg.isUcSleepTime[num] == false) {

			this.util.toast('해당 시간을 입력하셨습니다.');
			this.dtPg.isUcSleepTime[num] = true;

			return;
		}
	}

	sendTodaySleepRating()
	{
		console.log('sendTodaySleepRating()');

		if (this.pgConfig.isTodaySleepRating == false) {

			this.util.toast('해당 시간을 입력하셨습니다.');
			
			this.pgConfig.isTodaySleepRating = true;

			let userInfo = this.storage.getUserInfo();

			let requestData = {"mode": "harutoday_rating", "id": userInfo.id, "key": userInfo.key, "pcount": this.itemTarget.pnum, "rating": this.pgConfig.countTodaySleepRating};

			console.log('sendTodaySleepRating requestData', requestData);

			this.api.postData('harutoday_rating', requestData).then((data) => {

				let responseData:any = data;

				console.log('sendTodaySleepRating responseData', responseData);

				if (responseData.mode == 'harutoday_rating' && responseData.code == 'ok')
				{
					// 수면효율 설정
					this.storage.setHaruTodayRatingInfo(responseData.result.rating_items);
					this.storage.setLastRatingDate(responseData.result.last_rating_date);

				}
			}, (err) => {
				// Error log
				console.log('error sendTodaySleepRating');
			});

			return;
		}
	}

	sendTodayRead()
	{
		console.log("sendTodayRead");

		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harutoday_read", "id": userInfo.id, "key": userInfo.key, "code": this.itemTarget.mcode, "num": this.itemTarget.pnum, "quizpoint": this.pgConfig.pointQuiz, "zone_num": 0};

		console.log('sendTodayRead requestData', requestData);

		this.api.postData('harutoday_read', requestData).then((data) => {

			let responseData:any = data;

			console.log('sendTodayRead responseData', responseData);

			if (responseData.mode == 'harutoday_read' && responseData.code == 'ok')
			{
				// 회기 읽음 설정
				this.storage.setHaruTodayReadInfo(responseData.result.read_items);
				this.storage.setLastReadDate(responseData.result.last_read_date);

				this.finish();
			}
		}, (err) => {
			// Error log
			console.log('error sendTodayRead');
		});
	}

	drawLineChart()
	{
		console.log('drawLineChart()');

		this.pgConfig.objLineChart = new Chart(this.lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: this.pgConfig.itemTodaySleepDays,
				datasets: [{
					label: '수면효율',
					fill: false,
					lineTension: 0,
					backgroundColor: "rgba(96, 151, 251, 0.4)",
					borderColor: "rgba(96, 151, 251, 1.0)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.1,
					borderJoinStyle: 'circle',
					pointBorderColor: "rgba(96, 151, 251, 1.0)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(96, 151, 251, 1.0)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: this.pgConfig.itemTodaySleepGraphs,
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
							max : 100,
							min : 0,
							stepSize: 10
						}
					}],
					xAxes: [{
						ticks: {
							max : 48,
							min : 0,
							stepSize: 1
						}
					}],
				}
			}
		});

		if (this.item.ht_tpcode == 'hcct017') {
			setTimeout(() => {
				this.pgConfig.isLineChartPassed = false;
			}, 500);
		}
	}

	drawPieChart1()
	{
		console.log('drawPieChart1()');

		this.objPieChart1 = new Chart(this.pieCanvas.nativeElement, {
			type: 'pie',
			data: {
				labels: ['1. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[1]] + ' (' + String(this.dtPg.resultUcInput25[1]) + '%)',
						''],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput25[1], (100 - this.dtPg.resultUcInput25[1])],
					backgroundColor: [
						'rgba(255, 99, 132, 0.7)',
						'rgba(255, 255, 255, 1.0)'
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#FFFFFF"
					]
				}]
			}
		});

		if (this.item.ht_tpcode == 'hcst027') {
			setTimeout(() => {
				this.isPieChart1Passed = false;
			}, 500);
		}
	}

	drawPieChart2()
	{
		console.log('drawPieChart2()');

		this.objPieChart2 = new Chart(this.pieCanvas.nativeElement, {
			type: 'pie',
			data: {
				labels: ['1. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[1]] + ' (' + String(this.dtPg.resultUcInput25[1]) + '%)',
						'2. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[2]] + ' (' + String(this.dtPg.resultUcInput25[2]) + '%)',
						''],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput25[1],
						this.dtPg.resultUcInput25[2],
						(100 - this.dtPg.resultUcInput25[1] - this.dtPg.resultUcInput25[2])],
					backgroundColor: [
						'rgba(255, 99, 132, 0.7)',
						'rgba(54, 162, 235, 0.7)',
						'rgba(255, 255, 255, 1.0)'
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFFFFF"
					]
				}]
			}
		});

		if (this.item.ht_tpcode == 'hcst028') {
			setTimeout(() => {
				this.isPieChart2Passed = false;
			}, 500);
		}
	}

	drawPieChart3()
	{
		console.log('drawPieChart3()');

		this.objPieChart3 = new Chart(this.pieCanvas.nativeElement, {
			type: 'pie',
			data: {
				labels: ['1. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[1]] + ' (' + String(this.dtPg.resultUcInput25[1]) + '%)',
					'2. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[2]] + ' (' + String(this.dtPg.resultUcInput25[2]) + '%)',
					'3. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[3]] + ' (' + String(this.dtPg.resultUcInput25[3]) + '%)',
					''],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput25[1],
						this.dtPg.resultUcInput25[2],
						this.dtPg.resultUcInput25[3],
						(100 - this.dtPg.resultUcInput25[1] - this.dtPg.resultUcInput25[2] - this.dtPg.resultUcInput25[3])],
					backgroundColor: [
						'rgba(255, 99, 132, 0.7)',
						'rgba(54, 162, 235, 0.7)',
						'rgba(255, 206, 86, 0.7)',
						'rgba(255, 255, 255, 1.0)'
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#FFFFFF"
					]
				}]
			}
		});

		if (this.item.ht_tpcode == 'hcst029') {
			setTimeout(() => {
				this.isPieChart3Passed = false;
			}, 500);
		}
	}

	drawPieChart4()
	{
		console.log('drawPieChart4()');

		this.objPieChart4 = new Chart(this.pieCanvas.nativeElement, {
			type: 'pie',
			data: {
				labels: ['1. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[1]] + ' (' + String(this.dtPg.resultUcInput25[1]) + '%)',
					'2. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[2]] + ' (' + String(this.dtPg.resultUcInput25[2]) + '%)',
					'3. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[3]] + ' (' + String(this.dtPg.resultUcInput25[3]) + '%)',
					'4. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[4]] + ' (' + String(this.dtPg.resultUcInput25[4]) + '%)',
					''],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput25[1],
						this.dtPg.resultUcInput25[2],
						this.dtPg.resultUcInput25[3],
						this.dtPg.resultUcInput25[4],
						this.dtPg.resultUcInput25[5]],
					backgroundColor: [
						'rgba(255, 99, 132, 0.7)',
						'rgba(54, 162, 235, 0.7)',
						'rgba(255, 206, 86, 0.7)',
						'rgba(75, 192, 192, 0.7)',
						'rgba(255, 255, 255, 1.0)'
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#FF6384",
						"#FFFFFF"
					]
				}]
			}
		});

		if (this.item.ht_tpcode == 'hcst030') {
			setTimeout(() => {
				this.isPieChart4Passed = false;
			}, 500);
		}
	}

	drawPieChart5()
	{
		console.log('drawPieChart5()');

		this.objPieChart5 = new Chart(this.pieCanvas.nativeElement, {
			type: 'pie',
			data: {
				labels: ['1. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[1]] + ' (' + String(this.dtPg.resultUcInput25[1]) + '%)',
					'2. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[2]] + ' (' + String(this.dtPg.resultUcInput25[2]) + '%)',
					'3. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[3]] + ' (' + String(this.dtPg.resultUcInput25[3]) + '%)',
					'4. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[4]] + ' (' + String(this.dtPg.resultUcInput25[4]) + '%)',
					'5. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[5]] + ' (' + String(this.dtPg.resultUcInput25[5]) + '%)'],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput25[1],
						this.dtPg.resultUcInput25[2],
						this.dtPg.resultUcInput25[3],
						this.dtPg.resultUcInput25[4],
						this.dtPg.resultUcInput25[5]],
					backgroundColor: [
						'rgba(255, 99, 132, 0.7)',
						'rgba(54, 162, 235, 0.7)',
						'rgba(255, 206, 86, 0.7)',
						'rgba(75, 192, 192, 0.7)',
						'rgba(100, 102, 255, 0.7)'
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#FF6384",
						"#36A2EB",
					]
				}]
			}
		});

		if (this.item.ht_tpcode == 'hcst031') {
			setTimeout(() => {
				this.isPieChart5Passed = false;
			}, 500);
		}
	}

	drawPieChart6()
	{
		console.log('drawPieChart6()');

		this.objPieChart6 = new Chart(this.pieCanvas.nativeElement, {
			type: 'pie',
			data: {
				labels: ['1. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[1]] + ' (' + String(this.dtPg.resultUcInput25[1]) + '%)',
					'2. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[2]] + ' (' + String(this.dtPg.resultUcInput25[2]) + '%)',
					'3. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[3]] + ' (' + String(this.dtPg.resultUcInput25[3]) + '%)',
					'4. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[4]] + ' (' + String(this.dtPg.resultUcInput25[4]) + '%)',
					'5. ' + this.dtPg.textUcInput24[this.dtPg.orderUcInput24[5]] + ' (' + String(this.dtPg.resultUcInput25[5]) + '%)'],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput25[1],
						this.dtPg.resultUcInput25[2],
						this.dtPg.resultUcInput25[3],
						this.dtPg.resultUcInput25[4],
						this.dtPg.resultUcInput25[5]],
					backgroundColor: [
						'rgba(255, 99, 132, 0.7)',
						'rgba(54, 162, 235, 0.7)',
						'rgba(255, 206, 86, 0.7)',
						'rgba(75, 192, 192, 0.7)',
						'rgba(100, 102, 255, 0.7)'
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#FF6384",
						"#36A2EB",
					]
				}],
				options:{
					legends:{
						display:false
					}
				}
			}
		});

		if (this.item.ht_tpcode == 'hcst032') {
			setTimeout(() => {
				this.isPieChart6Passed = false;
			}, 500);
		}
	}

	openUrl(url) {
		this.util.openUrl(url);
	}
}
