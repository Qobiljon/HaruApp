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
import { Ht2Pg14Data } from './ht2_pg14.data';
import { Ht2Pg08Data } from '../pg08/ht2_pg08.data';
import { Ht2Pg09Data } from '../pg09/ht2_pg09.data';
import { Ht2Pg10Data } from '../pg10/ht2_pg10.data';
import { Ht2Pg11Data } from '../pg11/ht2_pg11.data';
import { Ht2Pg12Data } from '../pg12/ht2_pg12.data';
import { Ht2Pg13Data } from '../pg13/ht2_pg13.data';

@IonicPage()
@Component({
  selector: 'ht2-page-pg14',
  templateUrl: 'ht2_pg14.html',
})
export class Ht2Pg14Page {

	/* Common */
	pgConfig = new Ht2PgConfig(14);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg1st = new Ht2Pg08Data();
	dtPg2nd = new Ht2Pg09Data();
	dtPg3rd = new Ht2Pg10Data();
	dtPg4th = new Ht2Pg11Data();
	dtPg5th = new Ht2Pg12Data();
	dtPg6th = new Ht2Pg13Data();
	dtPg = new Ht2Pg14Data();

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
	){}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Pg14Page');
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

		let dtPg1st = new Ht2Pg08Data();
		dtPg1st = this.storage.getObject('dtPg08');

		if (typeof dtPg1st !== 'undefined' && dtPg1st != null)
		{
			this.dtPg1st = dtPg1st;
		}

		let dtPg2nd = new Ht2Pg09Data();
		dtPg2nd = this.storage.getObject('dtPg09');

		if (typeof dtPg2nd !== 'undefined' && dtPg2nd != null)
		{
			this.dtPg2nd = dtPg2nd;
		}

		let dtPg3rd = new Ht2Pg10Data();
		dtPg3rd = this.storage.getObject('dtPg10');

		if (typeof dtPg3rd !== 'undefined' && dtPg3rd != null)
		{
			this.dtPg3rd = dtPg3rd;
		}

		let dtPg4th = new Ht2Pg11Data();
		dtPg4th = this.storage.getObject('dtPg11');

		if (typeof dtPg4th !== 'undefined' && dtPg4th != null)
		{
			this.dtPg4th = dtPg4th;
		}

		let dtPg5th = new Ht2Pg12Data();
		dtPg5th = this.storage.getObject('dtPg12');

		if (typeof dtPg5th !== 'undefined' && dtPg5th != null)
		{
			this.dtPg5th = dtPg5th;
		}

		let dtPg6th = new Ht2Pg13Data();
		dtPg6th = this.storage.getObject('dtPg13');

		if (typeof dtPg6th !== 'undefined' && dtPg6th != null)
		{
			this.dtPg6th = dtPg6th;
		}

		let dtPgData = new Ht2Pg14Data();
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

		if (this.pgConfig.sceneNumber <= 1) {
			this.pgConfig.sceneNumber = 1;
			return;
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData46 && this.dtPg.selectUcSleepTime42 == 1 ) {
			// 분기#1
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData44;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData43 && this.dtPg.selectUcSleepTime42 == 1 ) {
			// 분기#1
			this.pgConfig.sceneNumber = this.dtPg.sceneUcSleepTime42;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData46 && this.dtPg.selectUcSleepTime42 == 2 ) {
			// 분기#2
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData45;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData45 && this.dtPg.selectUcSleepTime42 == 2 ) {
			// 분기#2
			this.pgConfig.sceneNumber = this.dtPg.sceneUcSleepTime42;
		} else {
			this.pgConfig.sceneNumber--;
		}

		console.log('goPrev() this.pgConfig.sceneNumber : ', this.pgConfig.sceneNumber);

		this.showPage();
	}

	goNext()
	{
		if (this.pgConfig.isLineChartPassed == true)
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

			if (this.pgConfig.sceneNumber == this.dtPg.sceneUcSleepTime42 && this.dtPg.selectUcSleepTime42 == 1 ) {
				// 분기#1
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData43;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData44 && this.dtPg.selectUcSleepTime42 == 1 ) {
				// 분기#1
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData46;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcSleepTime42 && this.dtPg.selectUcSleepTime42 == 2 ) {
				// 분기#2
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData45;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData45 && this.dtPg.selectUcSleepTime42 == 2 ) {
				// 분기#2
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData46;
			} else {
				this.pgConfig.sceneNumber++;
			}

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

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcSleepTime48) {
			if (this.dtPg.isUcSleepTime48 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcSleepTime49) {
			if (this.dtPg.isUcSleepTime49 == false) {
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

		this.scrollToTop();

		let haruTodayDataList = this.storage.getHaruTodayDataList();

		if (typeof haruTodayDataList == 'undefined' || haruTodayDataList == null)
			return;

		this.item = haruTodayDataList[this.pgConfig.sceneNumber-1];

		if (typeof this.item == 'undefined' || this.item == null)
			return;

		console.log('showPage() this.item : ', this.item);

		if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime[1]) {
			this.showUcSleepTime(1);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime[2]) {
			this.showUcSleepTime(2);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime[3]) {
			this.showUcSleepTime(3);
		} else if (this.item.ht_userdata == this.pgConfig.sceneTodaySleepRating) {
			this.showTodaySleepRating();
		}

		if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime42) {
			this.showUcData42();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime48) {
			this.showUcSleepTime48();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime49) {
			this.showUcSleepTime49();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime50) {
			this.showUcSleepTime50();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcSleepTime51) {
			this.showUcSleepTime51();
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

	showUcData42()
	{
		console.log('showUcData25()');

		console.log('this.dtPg.resultUcSleepTime :', (Number(this.dtPg.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg.resultUcSleepTime[1].min));
		console.log('this.dtPg1st.resultUcSleepTime :', (Number(this.dtPg1st.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg1st.resultUcSleepTime[1].min));
		console.log('this.dtPg2nd.resultUcSleepTime :', (Number(this.dtPg2nd.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg2nd.resultUcSleepTime[1].min));
		console.log('this.dtPg3rd.resultUcSleepTime :', (Number(this.dtPg3rd.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg3rd.resultUcSleepTime[1].min));
		console.log('this.dtPg4th.resultUcSleepTime :', (Number(this.dtPg4th.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg4th.resultUcSleepTime[1].min));
		console.log('this.dtPg5th.resultUcSleepTime :', (Number(this.dtPg5th.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg5th.resultUcSleepTime[1].min));
		console.log('this.dtPg6th.resultUcSleepTime :', (Number(this.dtPg6th.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg6th.resultUcSleepTime[1].min));

		let sumUcBedTime:number = 0;
		let avgUcBedTime:number = 0;

		if (this.dtPg.resultUcSleepTime[1].ampm == '오후') {
			sumUcBedTime += (12 * 60);
		}
		sumUcBedTime += (Number(this.dtPg.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg.resultUcSleepTime[1].min);

		if (this.dtPg1st.resultUcSleepTime[1].ampm == '오후') {
			sumUcBedTime += (12 * 60);
		}
		sumUcBedTime += (Number(this.dtPg1st.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg1st.resultUcSleepTime[1].min);

		if (this.dtPg2nd.resultUcSleepTime[1].ampm == '오후') {
			sumUcBedTime += (12 * 60);
		}
		sumUcBedTime += (Number(this.dtPg2nd.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg2nd.resultUcSleepTime[1].min);

		if (this.dtPg3rd.resultUcSleepTime[1].ampm == '오후') {
			sumUcBedTime += (12 * 60);
		}
		sumUcBedTime += (Number(this.dtPg3rd.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg3rd.resultUcSleepTime[1].min);

		if (this.dtPg4th.resultUcSleepTime[1].ampm == '오후') {
			sumUcBedTime += (12 * 60);
		}
		sumUcBedTime += (Number(this.dtPg4th.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg4th.resultUcSleepTime[1].min);

		if (this.dtPg5th.resultUcSleepTime[1].ampm == '오후') {
			sumUcBedTime += (12 * 60);
		}
		sumUcBedTime += (Number(this.dtPg5th.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg5th.resultUcSleepTime[1].min);

		if (this.dtPg6th.resultUcSleepTime[1].ampm == '오후') {
			sumUcBedTime += (12 * 60);
		}
		sumUcBedTime += (Number(this.dtPg6th.resultUcSleepTime[1].hour) * 60) + Number(this.dtPg6th.resultUcSleepTime[1].min);

		avgUcBedTime = Math.ceil(sumUcBedTime / 7);

		this.dtPg.resultUcSleepTime42[1].hour = Math.floor(avgUcBedTime / 60);
		this.dtPg.resultUcSleepTime42[1].min = (avgUcBedTime % 60);

		if (this.dtPg.resultUcSleepTime42[1].hour > 12) {
			this.dtPg.resultUcSleepTime42[1].hour -= 12;
			this.dtPg.resultUcSleepTime42[1].ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime42[1].ampm = '오전';
		}

		let sumUcSleepTime:number = 0;
		let avgUcSleepTime:number = 0;

		if (this.dtPg.resultUcSleepTime[2].ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg.resultUcSleepTime[2].hour) * 60) + Number(this.dtPg.resultUcSleepTime[2].min);

		if (this.dtPg1st.resultUcSleepTime[2].ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg1st.resultUcSleepTime[2].hour) * 60) + Number(this.dtPg1st.resultUcSleepTime[2].min);

		if (this.dtPg2nd.resultUcSleepTime[2].ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg2nd.resultUcSleepTime[2].hour) * 60) + Number(this.dtPg2nd.resultUcSleepTime[2].min);

		if (this.dtPg3rd.resultUcSleepTime[2].ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg3rd.resultUcSleepTime[2].hour) * 60) + Number(this.dtPg3rd.resultUcSleepTime[2].min);

		if (this.dtPg4th.resultUcSleepTime[2].ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg4th.resultUcSleepTime[2].hour) * 60) + Number(this.dtPg4th.resultUcSleepTime[2].min);

		if (this.dtPg5th.resultUcSleepTime[2].ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg5th.resultUcSleepTime[2].hour) * 60) + Number(this.dtPg5th.resultUcSleepTime[2].min);

		if (this.dtPg6th.resultUcSleepTime[2].ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg6th.resultUcSleepTime[2].hour) * 60) + Number(this.dtPg6th.resultUcSleepTime[2].min);

		avgUcSleepTime = Math.ceil(sumUcSleepTime / 7);

		this.dtPg.resultUcSleepTime42[2].hour = Math.floor(avgUcSleepTime / 60);
		this.dtPg.resultUcSleepTime42[2].min = (avgUcSleepTime % 60);

		if (this.dtPg.resultUcSleepTime42[2].hour > 12) {
			this.dtPg.resultUcSleepTime42[2].hour -= 12;
			this.dtPg.resultUcSleepTime42[2].ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime42[2].ampm = '오전';
		}

		let sumUcWakeUpTime:number = 0;
		let avgUcWakeUpTime:number = 0;

		if (this.dtPg.resultUcSleepTime[3].ampm == '오후') {
			sumUcWakeUpTime += (12 * 60);
		}
		sumUcWakeUpTime += (Number(this.dtPg.resultUcSleepTime[3].hour) * 60) + Number(this.dtPg.resultUcSleepTime[3].min);

		if (this.dtPg1st.resultUcSleepTime[3].ampm == '오후') {
			sumUcWakeUpTime += (12 * 60);
		}
		sumUcWakeUpTime += (Number(this.dtPg1st.resultUcSleepTime[3].hour) * 60) + Number(this.dtPg1st.resultUcSleepTime[3].min);

		if (this.dtPg2nd.resultUcSleepTime[3].ampm == '오후') {
			sumUcWakeUpTime += (12 * 60);
		}
		sumUcWakeUpTime += (Number(this.dtPg2nd.resultUcSleepTime[3].hour) * 60) + Number(this.dtPg2nd.resultUcSleepTime[3].min);

		if (this.dtPg3rd.resultUcSleepTime[3].ampm == '오후') {
			sumUcWakeUpTime += (12 * 60);
		}
		sumUcWakeUpTime += (Number(this.dtPg3rd.resultUcSleepTime[3].hour) * 60) + Number(this.dtPg3rd.resultUcSleepTime[3].min);

		if (this.dtPg4th.resultUcSleepTime[3].ampm == '오후') {
			sumUcWakeUpTime += (12 * 60);
		}
		sumUcWakeUpTime += (Number(this.dtPg4th.resultUcSleepTime[3].hour) * 60) + Number(this.dtPg4th.resultUcSleepTime[3].min);

		if (this.dtPg5th.resultUcSleepTime[3].ampm == '오후') {
			sumUcWakeUpTime += (12 * 60);
		}
		sumUcWakeUpTime += (Number(this.dtPg5th.resultUcSleepTime[3].hour) * 60) + Number(this.dtPg5th.resultUcSleepTime[3].min);

		if (this.dtPg6th.resultUcSleepTime[3].ampm == '오후') {
			sumUcWakeUpTime += (12 * 60);
		}
		sumUcWakeUpTime += (Number(this.dtPg6th.resultUcSleepTime[3].hour) * 60) + Number(this.dtPg6th.resultUcSleepTime[3].min);

		avgUcWakeUpTime = Math.ceil(sumUcWakeUpTime / 7);

		this.dtPg.resultUcSleepTime42[3].hour = Math.floor(avgUcWakeUpTime / 60);
		this.dtPg.resultUcSleepTime42[3].min = (avgUcWakeUpTime %  60);

		if (this.dtPg.resultUcSleepTime42[3].hour > 12) {
			this.dtPg.resultUcSleepTime42[3].hour -= 12;
			this.dtPg.resultUcSleepTime42[3].ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime42[3].ampm = '오전';
		}

		let sumUcWakeTime:number = 0;
		let avgUcWakeTime:number = 0;

		sumUcWakeTime += Number(this.dtPg.resultUcWakeTime.hour) * 60;
		sumUcWakeTime += Number(this.dtPg1st.resultUcWakeTime.hour) * 60;
		sumUcWakeTime += Number(this.dtPg2nd.resultUcWakeTime.hour) * 60;
		sumUcWakeTime += Number(this.dtPg3rd.resultUcWakeTime.hour) * 60;
		sumUcWakeTime += Number(this.dtPg4th.resultUcWakeTime.hour) * 60;
		sumUcWakeTime += Number(this.dtPg5th.resultUcWakeTime.hour) * 60;
		sumUcWakeTime += Number(this.dtPg6th.resultUcWakeTime.hour) * 60;

		avgUcWakeTime = Math.ceil(sumUcWakeTime / 7);

		this.dtPg.resultUcSleepTime42[4].hour = Math.floor(avgUcWakeTime / 60);
		this.dtPg.resultUcSleepTime42[4].min = (avgUcWakeTime % 60);

		// 중간에 깬 총시간 30분 이내
		if (avgUcWakeTime <= 30)
			this.dtPg.selectUcSleepTime42 = 1;
		else
			this.dtPg.selectUcSleepTime42 = 2;

		return;
	}

	showUcSleepTime48()
	{
		console.log('showUcSleepTime48()');
		return;
	}

	showUcSleepTime49()
	{
		console.log('showUcSleepTime49()');
		return;
	}

	showUcSleepTime50()
	{
		console.log('showUcSleepTime50()');

		let sumUcSleepTime = 0;

		if (this.dtPg.resultUcSleepTime48.ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg.resultUcSleepTime48.hour) * 60) + Number(this.dtPg.resultUcSleepTime48.min) - (Number(this.dtPg.resultUcSleepTime49.hour) * 60);

		this.dtPg.resultUcSleepTime50.hour = Math.floor(sumUcSleepTime / 60);
		this.dtPg.resultUcSleepTime50.min = (sumUcSleepTime % 60);

		if (this.dtPg.resultUcSleepTime50.hour < 0) {
			this.dtPg.resultUcSleepTime50.hour += 24;
		}

		if (this.dtPg.resultUcSleepTime50.hour > 12) {
			this.dtPg.resultUcSleepTime50.hour -= 12;
			this.dtPg.resultUcSleepTime50.ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime50.ampm = '오전';
		}

		return;
	}

	showUcSleepTime51()
	{
		console.log('showUcSleepTime51()');

		let sumUcSleepTime:number = 0;
		let sumUcWakeUpTime:number = 0;
		let sumUcWakeTime:number = 0;
		let sumUcNewWakeUpTime:number = 0;
		let sumUcNewSleepTime:number = 0;

		let sumUcSleepRangeTime:number = 0;
		let sumUcNewSleepRangeTime:number = 0;

		if (this.dtPg.resultUcSleepTime42[2].ampm == '오후') {
			sumUcSleepTime += (12 * 60);
		}
		sumUcSleepTime += (Number(this.dtPg.resultUcSleepTime42[2].hour) * 60) + Number(this.dtPg.resultUcSleepTime42[2].min);

		if (this.dtPg.resultUcSleepTime42[3].ampm == '오후') {
			sumUcWakeUpTime += (12 * 60);
		}
		sumUcWakeUpTime += (Number(this.dtPg.resultUcSleepTime42[3].hour) * 60) + Number(this.dtPg.resultUcSleepTime42[3].min);

		if (this.dtPg.resultUcSleepTime42[4].ampm == '오후') {
			sumUcWakeTime += (12 * 60);
		}
		sumUcWakeTime += (Number(this.dtPg.resultUcSleepTime42[4].hour) * 60) + Number(this.dtPg.resultUcSleepTime42[4].min);

		if (this.dtPg.resultUcSleepTime42[2].ampm == '오후') {
			sumUcSleepRangeTime = (24 * 60) + sumUcWakeUpTime - sumUcSleepTime - sumUcWakeTime;
		} else {
			sumUcSleepRangeTime = sumUcWakeUpTime - sumUcSleepTime - sumUcWakeTime;
		}

		this.dtPg.resultUcSleepTime51[1].hour = Math.floor(sumUcSleepRangeTime / 60);
		this.dtPg.resultUcSleepTime51[1].min = (sumUcSleepRangeTime % (60));
		if (this.dtPg.resultUcSleepTime51[1].hour > 12) {
			this.dtPg.resultUcSleepTime51[1].hour -= 12;
			this.dtPg.resultUcSleepTime51[1].ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime51[1].ampm = '오전';
		}

		if (this.dtPg.resultUcSleepTime48.ampm == '오후') {
			sumUcNewWakeUpTime = (12 * 60);
		}
		sumUcNewWakeUpTime += (Number(this.dtPg.resultUcSleepTime48.hour) * 60) + Number(this.dtPg.resultUcSleepTime48.min);

		sumUcNewSleepRangeTime = sumUcSleepRangeTime - sumUcNewWakeUpTime;

		this.dtPg.resultUcSleepTime51[2].hour = Math.floor(sumUcNewSleepRangeTime / 60);
		this.dtPg.resultUcSleepTime51[2].min = (sumUcNewSleepRangeTime % (60));
		if (this.dtPg.resultUcSleepTime51[2].hour > 12) {
			this.dtPg.resultUcSleepTime51[2].hour -= 12;
			this.dtPg.resultUcSleepTime51[2].ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime51[2].ampm = '오전';
		}

		if (this.dtPg.resultUcSleepTime50.ampm == '오후') {
			sumUcNewSleepTime += (12 * 60);
		}
		sumUcNewSleepTime += (Number(this.dtPg.resultUcSleepTime50.hour) * 60) + Number(this.dtPg.resultUcSleepTime50.min);

		if (sumUcSleepTime >= sumUcNewSleepTime) {
			this.dtPg.resultUcSleepTime51[3].ampm = this.dtPg.resultUcSleepTime51[1].ampm;
			this.dtPg.resultUcSleepTime51[3].hour = this.dtPg.resultUcSleepTime51[1].hour;
			this.dtPg.resultUcSleepTime51[3].min = this.dtPg.resultUcSleepTime51[1].min;
		} else {
			sumUcNewSleepRangeTime -= 15;
			this.dtPg.resultUcSleepTime51[3].hour = Math.floor(sumUcNewSleepRangeTime / 60);
			this.dtPg.resultUcSleepTime51[3].min = (sumUcNewSleepRangeTime % (60));

			if (this.dtPg.resultUcSleepTime51[3].hour > 12) {
				this.dtPg.resultUcSleepTime51[3].hour -= 12;
				this.dtPg.resultUcSleepTime51[3].ampm = '오후';
			} else {
				this.dtPg.resultUcSleepTime51[3].ampm = '오전';
			}
		}

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

	/* user time */
	changeUcAmPmUp48()
	{
		if (this.dtPg.resultUcSleepTime48.ampm == '오전') {
			this.dtPg.resultUcSleepTime48.ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime48.ampm = '오전';
		}
	}

	changeUcAmPmDown48()
	{
		if (this.dtPg.resultUcSleepTime48.ampm == '오전') {
			this.dtPg.resultUcSleepTime48.ampm = '오후';
		} else {
			this.dtPg.resultUcSleepTime48.ampm = '오전';
		}
	}

	changeUcHourUp48()
	{
		if (this.dtPg.resultUcSleepTime48.hour == 12) {
			this.dtPg.resultUcSleepTime48.hour = 1;
		} else {
			this.dtPg.resultUcSleepTime48.hour += 1;
		}
	}

	changeUcHourDown48()
	{
		if (this.dtPg.resultUcSleepTime48.hour == 1) {
			this.dtPg.resultUcSleepTime48.hour = 12;
		} else {
			this.dtPg.resultUcSleepTime48.hour -= 1;
		}
	}

	sendUcSleepTime48()
	{
		console.log('sendUcSleepTime48');

		if (this.dtPg.isUcSleepTime48 == false) {

			this.util.toast('해당 시간을 입력하셨습니다.');
			this.dtPg.isUcSleepTime48 = true;

			return;
		}
	}

	changeUcHourUp49()
	{
		if (this.dtPg.resultUcSleepTime49.hour >= 12) {
			this.dtPg.resultUcSleepTime49.hour = 12;
		} else {
			this.dtPg.resultUcSleepTime49.hour += 1;
		}
	}

	changeUcHourDown49()
	{
		if (this.dtPg.resultUcSleepTime49.hour <= 1) {
			this.dtPg.resultUcSleepTime49.hour = 0;
		} else {
			this.dtPg.resultUcSleepTime49.hour -= 1;
		}
	}

	sendUcSleepTime49()
	{
		console.log('sendUcSleepTime49');

		if (this.dtPg.isUcSleepTime49 == false) {

			this.util.toast('해당 시간을 입력하셨습니다.');
			this.dtPg.isUcSleepTime49 = true;

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

	openUrl(url) {
		this.util.openUrl(url);
	}
}
