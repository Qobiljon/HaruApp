import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ViewController, NavParams, Events, Platform, IonicPage } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Media, MediaObject } from '@ionic-native/media';
import { StatusBar } from '@ionic-native/status-bar';
import { StorageProvider } from '../../../providers/storage/storage';
import { UtilProvider } from '../../../providers/util/util';
import { ApiProvider } from '../../../providers/api/api';
import { Chart } from 'chart.js';
import { Ht1PgConfig } from '../config/pg.config';
import { Ht1Pg27Data } from './ht1_pg27.data';

@IonicPage()
@Component({
  selector: 'ht1-page-pg27',
  templateUrl: 'ht1_pg27.html',
})
export class Ht1Pg27Page {

	/* Common */
	pgConfig = new Ht1PgConfig(27);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg = new Ht1Pg27Data();

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
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Pg27Page');
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

		let dtPgData = new Ht1Pg27Data();
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

		// 기분평가 조회
		this.initTodayFeel();

		// 볼륨상태
		this.pgConfig.volumeState = this.storage.getVolumeState();

		this.showPage();
	}

	initTodayFeel()
	{
		console.log('ngOnInit');

		// 기분평가 조회
		this.refreshRatingData();

		// 기분평가 이벤트
		this.events.subscribe('haruTodayRatingInfo:changed', (data) => {
			this.refreshRatingData();

			this.pgConfig.isTodayFeelRating = true;
		});

		// 기분평가 참여시
		if (this.pgConfig.itemTodayFeelRating[this.itemTarget.pnum] != -1) {
			this.pgConfig.isTodayFeelRating = true;
			this.pgConfig.countTodayFeelRating = this.pgConfig.itemTodayFeelRating[this.itemTarget.pnum];
		}

		console.log('today_date : ', this.pgConfig.todayDate);
		console.log('targetdate : ', this.itemTarget.targetdate);
		console.log('기분평가 상태 : ', this.pgConfig.isTodayFeelRating);
	}

	refreshRatingData()
	{
		this.pgConfig.itemTodayFeelRating = this.storage.getHaruTodayRatingInfo();

		this.pgConfig.itemTodayFeelDays.length = 0;
		this.pgConfig.itemTodayFeelGraphs.length = 0;
		for (let i = 1; i <= this.itemTarget.pnum; i++) {
			this.pgConfig.itemTodayFeelDays.push(i.toLocaleString() + '회기');
			this.pgConfig.itemTodayFeelGraphs.push(this.pgConfig.itemTodayFeelRating[i]);
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

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData30 && this.dtPg.selectUcData24 == 1) {
			// 분기#1
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData27;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData27 && this.dtPg.selectUcData24 == 1) {
			// 분기#1
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData26;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData30 && this.dtPg.selectUcData24 == 2) {
			// 분기#2
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData28;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData28 && this.dtPg.selectUcData24 == 2) {
			// 분기#2
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData26;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData30 && this.dtPg.selectUcData24 == 3) {
			// 분기#3
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData29;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData29 && this.dtPg.selectUcData24 == 3) {
			// 분기#3
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData26;
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

			if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData26 && this.dtPg.selectUcData24 == 1) {
				// 분기#1
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData27;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData27 && this.dtPg.selectUcData24 == 1) {
				// 분기#1
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData30;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData26 && this.dtPg.selectUcData24 == 2) {
				// 분기#2
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData28;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData28 && this.dtPg.selectUcData24 == 2) {
				// 분기#2
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData30;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData26 && this.dtPg.selectUcData24 == 3) {
				// 분기#3
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData29;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData29 && this.dtPg.selectUcData24 == 3) {
				// 분기#3
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData30;
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
		if (this.pgConfig.sceneNumber == this.pgConfig.sceneTodayFeelRating) {
			if (this.pgConfig.countTodayFeelRating == -1) {
				this.util.toast('현재의 기분평점을 선택하세요.');
				return false;
			} else if (this.pgConfig.isTodayFeelRating == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput8) {
			if (this.dtPg.resultUcInput8 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput8 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput13) {
			if (this.dtPg.resultUcInput13 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput13 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput16) {
			if (this.dtPg.resultUcInput16 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput16 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput20) {
			if (this.dtPg.resultUcInput20 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput20 == false) {
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

		if (this.item.ht_userdata == this.dtPg.sceneUcInput8) {
			this.showUcInput8();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput13) {
			this.showUcInput13();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput16) {
			this.showUcInput16();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput20) {
			this.showUcInput20();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcData24) {
			this.showUcData24();
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

	showUcInput8()
	{
		console.log('showUcInput8()');
		return;
	}

	showUcInput13()
	{
		console.log('showUcInput13()');
		return;
	}

	showUcInput16()
	{
		console.log('showUcInput16()');
		return;
	}

	showUcInput20()
	{
		console.log('showUcInput20()');
		return;
	}

	showUcData24()
	{
		console.log('showUcData24()');

		let result = [
			{ think : this.dtPg.resultUcInput8},
			{ think : this.dtPg.resultUcInput13},
			{ think : this.dtPg.resultUcInput16},
			{ think : this.dtPg.resultUcInput20}
		]

		let sortingField = "think";

		result.sort(function(a, b) { // 오름차순
			return b[sortingField] - a[sortingField];
		});

		this.dtPg.countUcData24[5] = 0;
		this.dtPg.countUcData24[4] = 0;
		this.dtPg.countUcData24[3] = 0;
		this.dtPg.countUcData24[2] = 0;
		this.dtPg.countUcData24[1] = 0;

		if (result[0].think == 5)
			this.dtPg.countUcData24[5] = 1;
		else if (result[0].think == 4)
			this.dtPg.countUcData24[4] = 1;
		else if (result[0].think == 3)
			this.dtPg.countUcData24[3] = 1;
		else if (result[0].think == 2)
			this.dtPg.countUcData24[2] = 1;
		else if (result[0].think == 1)
			this.dtPg.countUcData24[1] = 1;

		if (result[1].think == 5)
			this.dtPg.countUcData24[5] += 1;
		else if (result[1].think == 4)
			this.dtPg.countUcData24[4] += 1;
		else if (result[1].think == 3)
			this.dtPg.countUcData24[3] += 1;
		else if (result[1].think == 2)
			this.dtPg.countUcData24[2] += 1;
		else if (result[1].think == 1)
			this.dtPg.countUcData24[1] += 1;

		if (result[2].think == 5)
			this.dtPg.countUcData24[5] += 1;
		else if (result[2].think == 4)
			this.dtPg.countUcData24[4] += 1;
		else if (result[2].think == 3)
			this.dtPg.countUcData24[3] += 1;
		else if (result[2].think == 2)
			this.dtPg.countUcData24[2] += 1;
		else if (result[2].think == 1)
			this.dtPg.countUcData24[1] += 1;

		if (result[3].think == 5)
			this.dtPg.countUcData24[5] += 1;
		else if (result[3].think == 4)
			this.dtPg.countUcData24[4] += 1;
		else if (result[3].think == 3)
			this.dtPg.countUcData24[3] += 1;
		else if (result[3].think == 2)
			this.dtPg.countUcData24[2] += 1;
		else if (result[3].think == 1)
			this.dtPg.countUcData24[1] += 1;

		if (this.dtPg.countUcData24[5] == 4 || this.dtPg.countUcData24[4] == 4 || this.dtPg.countUcData24[3] == 4 || this.dtPg.countUcData24[2] == 4 || this.dtPg.countUcData24[1] == 4 || this.dtPg.countUcData24[5] == 3 || this.dtPg.countUcData24[4] == 3 || this.dtPg.countUcData24[3] == 3 || this.dtPg.countUcData24[2] == 3 || this.dtPg.countUcData24[1] == 3)
		{
			this.dtPg.resultUcData24[result[0].think] = true;
		} else if (this.dtPg.countUcData24[5] == 2 || this.dtPg.countUcData24[4] == 2 || this.dtPg.countUcData24[3] == 2 || this.dtPg.countUcData24[2] == 2 || this.dtPg.countUcData24[1] == 2) {
			if (this.dtPg.countUcData24[5] > this.dtPg.countUcData24[4] && this.dtPg.countUcData24[5] > this.dtPg.countUcData24[3] && this.dtPg.countUcData24[5] > this.dtPg.countUcData24[2] && this.dtPg.countUcData24[5] > this.dtPg.countUcData24[1]) {
				this.dtPg.resultUcData24[5] = true;
			} else if (this.dtPg.countUcData24[4] > this.dtPg.countUcData24[5] && this.dtPg.countUcData24[4] > this.dtPg.countUcData24[3] && this.dtPg.countUcData24[4] > this.dtPg.countUcData24[2] && this.dtPg.countUcData24[4] > this.dtPg.countUcData24[1]) {
				this.dtPg.resultUcData24[4] = true;
			} else if (this.dtPg.countUcData24[3] > this.dtPg.countUcData24[5] && this.dtPg.countUcData24[3] > this.dtPg.countUcData24[4] && this.dtPg.countUcData24[3] > this.dtPg.countUcData24[2] && this.dtPg.countUcData24[3] > this.dtPg.countUcData24[1]) {
				this.dtPg.resultUcData24[3] = true;
			} else if (this.dtPg.countUcData24[2] > this.dtPg.countUcData24[5] && this.dtPg.countUcData24[2] > this.dtPg.countUcData24[4] && this.dtPg.countUcData24[2] > this.dtPg.countUcData24[3] && this.dtPg.countUcData24[2] > this.dtPg.countUcData24[1]) {
				this.dtPg.resultUcData24[2] = true;
			} else if (this.dtPg.countUcData24[1] > this.dtPg.countUcData24[5] && this.dtPg.countUcData24[1] > this.dtPg.countUcData24[4] && this.dtPg.countUcData24[1] > this.dtPg.countUcData24[3] && this.dtPg.countUcData24[1] > this.dtPg.countUcData24[2]) {
				this.dtPg.resultUcData24[1] = true;
			} else if (this.dtPg.countUcData24[5] == this.dtPg.countUcData24[4]) {
				this.dtPg.resultUcData24[5] = true;
				this.dtPg.resultUcData24[4] = true;
			} else if (this.dtPg.countUcData24[5] == this.dtPg.countUcData24[3]) {
				this.dtPg.resultUcData24[5] = true;
				this.dtPg.resultUcData24[3] = true;
			} else if (this.dtPg.countUcData24[5] == this.dtPg.countUcData24[2]) {
				this.dtPg.resultUcData24[5] = true;
				this.dtPg.resultUcData24[2] = true;
			} else if (this.dtPg.countUcData24[5] == this.dtPg.countUcData24[1]) {
				this.dtPg.resultUcData24[5] = true;
				this.dtPg.resultUcData24[1] = true;
			} else if (this.dtPg.countUcData24[4] == this.dtPg.countUcData24[3]) {
				this.dtPg.resultUcData24[4] = true;
				this.dtPg.resultUcData24[3] = true;
			} else if (this.dtPg.countUcData24[4] == this.dtPg.countUcData24[2]) {
				this.dtPg.resultUcData24[4] = true;
				this.dtPg.resultUcData24[2] = true;
			} else if (this.dtPg.countUcData24[4] == this.dtPg.countUcData24[1]) {
				this.dtPg.resultUcData24[4] = true;
				this.dtPg.resultUcData24[1] = true;
			} else if (this.dtPg.countUcData24[3] == this.dtPg.countUcData24[2]) {
				this.dtPg.resultUcData24[3] = true;
				this.dtPg.resultUcData24[2] = true;
			} else if (this.dtPg.countUcData24[2] == this.dtPg.countUcData24[1]) {
				this.dtPg.resultUcData24[2] = true;
				this.dtPg.resultUcData24[1] = true;
			}
		} else if (this.dtPg.countUcData24[5] == 1 && this.dtPg.countUcData24[4] == 1 && this.dtPg.countUcData24[3] == 1 && this.dtPg.countUcData24[2] == 1 && this.dtPg.countUcData24[1] == 0) {
			this.dtPg.resultUcData24[5] = true;
			this.dtPg.resultUcData24[4] = true;
			this.dtPg.resultUcData24[3] = true;
			this.dtPg.resultUcData24[2] = true;
		} else if (this.dtPg.countUcData24[5] == 1 && this.dtPg.countUcData24[4] == 1 && this.dtPg.countUcData24[3] == 1 && this.dtPg.countUcData24[2] == 0 && this.dtPg.countUcData24[1] == 1) {
			this.dtPg.resultUcData24[5] = true;
			this.dtPg.resultUcData24[4] = true;
			this.dtPg.resultUcData24[3] = true;
			this.dtPg.resultUcData24[1] = true;
		} else if (this.dtPg.countUcData24[5] == 1 && this.dtPg.countUcData24[4] == 1 && this.dtPg.countUcData24[3] == 0 && this.dtPg.countUcData24[2] == 1 && this.dtPg.countUcData24[1] == 1) {
			this.dtPg.resultUcData24[5] = true;
			this.dtPg.resultUcData24[4] = true;
			this.dtPg.resultUcData24[2] = true;
			this.dtPg.resultUcData24[1] = true;
		} else if (this.dtPg.countUcData24[5] == 1 && this.dtPg.countUcData24[4] == 0 && this.dtPg.countUcData24[3] == 1 && this.dtPg.countUcData24[2] == 1 && this.dtPg.countUcData24[1] == 1) {
			this.dtPg.resultUcData24[5] = true;
			this.dtPg.resultUcData24[3] = true;
			this.dtPg.resultUcData24[2] = true;
			this.dtPg.resultUcData24[1] = true;
		} else if (this.dtPg.countUcData24[5] == 0 && this.dtPg.countUcData24[4] == 1 && this.dtPg.countUcData24[3] == 1 && this.dtPg.countUcData24[2] == 1 && this.dtPg.countUcData24[1] == 1) {
			this.dtPg.resultUcData24[4] = true;
			this.dtPg.resultUcData24[3] = true;
			this.dtPg.resultUcData24[2] = true;
			this.dtPg.resultUcData24[1] = true;
		}

		if ((this.dtPg.countUcData24[1] >= 3 || this.dtPg.countUcData24[2] >= 3 || this.dtPg.countUcData24[3] >= 3 || this.dtPg.countUcData24[4] >= 3) && this.dtPg.countUcData24[5] < 3) {
			this.dtPg.selectUcData24 = 1;
		} else if (this.dtPg.countUcData24[5] >= 3) {
			this.dtPg.selectUcData24 = 2;
		} else {
			this.dtPg.selectUcData24 = 3;
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
	
	sendUcInput8()
	{
		console.log('sendUcInput8()');

		if (this.dtPg.resultUcInput8 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.alert('보기를 선택하셨습니다.');
			this.dtPg.isUcInput8 = true;
			return;
		}
	}

	sendUcInput13()
	{
		console.log('sendUcInput13()');

		if (this.dtPg.resultUcInput13 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.alert('보기를 선택하셨습니다.');
			this.dtPg.isUcInput13 = true;
			return;
		}
	}

	sendUcInput16()
	{
		console.log('sendUcInput16()');

		if (this.dtPg.resultUcInput16 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.alert('보기를 선택하셨습니다.');
			this.dtPg.isUcInput16 = true;
			return;
		}
	}

	sendUcInput20()
	{
		console.log('sendUcInput20()');

		if (this.dtPg.resultUcInput20 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.alert('보기를 선택하셨습니다.');
			this.dtPg.isUcInput20 = true;
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
		} else if (this.dtPg.resultUcQuiz1 == this.dtPg.passUcQuiz1)
		{
			this.util.alert('잘 하셨습니다.');
			this.pgConfig.pointQuiz += 5;
			this.dtPg.isUcQuiz1 = true;
		} else {

			this.dtPg.countUcQuiz1--;

			if (this.dtPg.countUcQuiz1 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
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
		} else if (this.dtPg.resultUcQuiz2 == this.dtPg.passUcQuiz2)
		{
			this.util.alert('잘 하셨습니다.');
			this.pgConfig.pointQuiz += 5;
			this.dtPg.isUcQuiz2 = true;
			return;
		} else {

			this.dtPg.countUcQuiz2--;

			if (this.dtPg.countUcQuiz2 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
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

	sendTodayFeelRating()
	{
		console.log("sendTodayFeelRating", this.pgConfig.countTodayFeelRating);

		if (this.pgConfig.countTodayFeelRating == -1)
		{
			this.util.toast('현재의 기분평점을 선택하세요.');
			return;
		}

		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harutoday_rating", "id": userInfo.id, "key": userInfo.key, "pcount": this.itemTarget.pnum, "rating": this.pgConfig.countTodayFeelRating};

		console.log('sendTodayFeelRating requestData', requestData);

		this.api.postData('harutoday_rating', requestData).then((data) => {

			let responseData:any = data;

			console.log('sendTodayFeelRating responseData', responseData);

			if (responseData.mode == 'harutoday_rating' && responseData.code == 'ok')
			{
				// 기분평가 설정
				this.storage.setHaruTodayRatingInfo(responseData.result.rating_items);
				this.storage.setLastRatingDate(responseData.result.last_rating_date);

			}
		}, (err) => {
			// Error log
			console.log('error sendTodayFeelRating');
		});
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
				labels: this.pgConfig.itemTodayFeelDays,
				datasets: [{
					label: '기분평점',
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
					data: this.pgConfig.itemTodayFeelGraphs,
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
}
