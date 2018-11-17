import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ViewController, NavParams, Events, Platform, IonicPage } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Media, MediaObject } from '@ionic-native/media';
import { StatusBar } from '@ionic-native/status-bar';
import { StorageProvider } from '../../../providers/ht1/storage/storage';
import { UtilProvider } from '../../../providers/ht1/util/util';
import { ApiProvider } from '../../../providers/ht1/api/api';
import { Chart } from 'chart.js';
import { Ht1PgConfig } from '../config/pg.config';
import { Ht1Pg08Data } from './ht1_pg08.data';
import { Ht1Pg07Data } from '../pg07/ht1_pg07.data';

@IonicPage()
@Component({
  selector: 'ht1-page-pg08',
  templateUrl: 'ht1_pg08.html',
})
export class Ht1Pg08Page {

	/* Common */
	pgConfig = new Ht1PgConfig(8);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg1st = new Ht1Pg07Data();
	dtPg = new Ht1Pg08Data();

	/* 시간표 */
	objLineTimeChart: any;
	isTimeChartPassed: boolean = false;

	objLineTimeChart2: any;
	isTimeChart2Passed: boolean = false;
 
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
		console.log('ionViewDidLoad Pg8Page');
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
	
		let dtPg1st = new Ht1Pg07Data();
		dtPg1st = this.storage.getObject('dtPg07');

		if (typeof dtPg1st !== 'undefined' && dtPg1st != null)
		{
			this.dtPg1st = dtPg1st;
		}

		let dtPgData = new Ht1Pg08Data();
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

		if (this.isTimeChartPassed == true)
			return;

		if (this.isTimeChart2Passed == true)
			return;

		if (this.pgConfig.sceneNumber <= 1) {
			this.pgConfig.sceneNumber = 1;
			return;
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData24 && this.dtPg.selectUcData20 == 1) {
			// 분기#1
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData21;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData21 && this.dtPg.selectUcData20 == 1) {
			// 분기#1
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData20;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData33 && this.dtPg.selectUcData20 == 1) {
			// 분기#1
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData28;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData29 && this.dtPg.selectUcData20 == 2) {
			// 분기#2
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData22;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData22 && this.dtPg.selectUcData20 == 2) {
			// 분기#2
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData20;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData33 && this.dtPg.selectUcData20 == 2) {
			// 분기#2
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData32;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData29 && this.dtPg.selectUcData20 == 3) {
			// 분기#3
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData23;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData23 && this.dtPg.selectUcData20 == 3) {
			// 분기#3
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData20;
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData33 && this.dtPg.selectUcData20 == 3) {
			// 분기#3
			this.pgConfig.sceneNumber = this.dtPg.sceneUcData32;
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

		if (this.isTimeChartPassed == true)
			return;

		if (this.isTimeChart2Passed == true)
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

			if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData20 && this.dtPg.selectUcData20 == 1) {
				// 분기#1
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData21;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData21 && this.dtPg.selectUcData20 == 1) {
				// 분기#1
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData24;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData28 && this.dtPg.selectUcData20 == 1) {
				// 분기#1
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData33;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData20 && this.dtPg.selectUcData20 == 2) {
				// 분기#2
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData22;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData22 && this.dtPg.selectUcData20 == 2) {
				// 분기#2
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData29;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData32 && this.dtPg.selectUcData20 == 2) {
				// 분기#2
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData33;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData20 && this.dtPg.selectUcData20 == 3) {
				// 분기#3
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData23;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData23 && this.dtPg.selectUcData20 == 3) {
				// 분기#3
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData29;
			} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcData32 && this.dtPg.selectUcData20 == 3) {
				// 분기#3
				this.pgConfig.sceneNumber = this.dtPg.sceneUcData33;	
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

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcAlarm1) {
			if (this.dtPg.isUcAlarm1 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput1) {
			if (this.dtPg.resultUcInput1 == -1)
			{
				this.util.toast('보기의 활동을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput1 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput2) {
			if (this.dtPg.resultUcInput2 == -1)
			{
				this.util.toast('보기의 활동을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput2 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput3) {
			if (this.dtPg.resultUcInput3 == -1)
			{
				this.util.toast('보기의 활동을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput3 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput4) {
			if (this.dtPg.resultUcInput4 == -1)
			{
				this.util.toast('보기의 활동을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput4 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput5) {
			if (this.dtPg.resultUcInput5 == -1)
			{
				this.util.toast('보기의 활동을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput5 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating1) {
			if (this.dtPg.resultUcFeelRating1 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating1 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating2) {
			if (this.dtPg.resultUcFeelRating2 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating2 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating3) {
			if (this.dtPg.resultUcFeelRating3 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating3 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating4) {
			if (this.dtPg.resultUcFeelRating4 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating4 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating5) {
			if (this.dtPg.resultUcFeelRating5 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating5 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput25 ) {
			if (this.dtPg.resultUcInput25 == -1)
			{
				this.util.toast('보기의 활동을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput25 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput27) {
			if (this.dtPg.resultUcInput27 == -1)
			{
				this.util.toast('보기의 활동을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput27 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput31) {
			if (this.dtPg.resultUcInput31 == -1)
			{
				this.util.toast('보기의 활동을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput31 == false) {
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
			if (this.dtPg.resultUcQuiz2[1] == false &&
				this.dtPg.resultUcQuiz2[2] == false &&
				this.dtPg.resultUcQuiz2[3] == false &&
				this.dtPg.resultUcQuiz2[4] == false )
			{
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

		if (this.item.ht_userdata == this.dtPg.sceneUcAlarm1) {
			this.showUcAlarm1();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput1) {
			this.showUcInput1();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput2) {
			this.showUcInput2();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput3) {
			this.showUcInput3();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput4) {
			this.showUcInput4();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput5) {
			this.showUcInput5();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcFeelRating1) {
			this.showUcFeelRating1();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcFeelRating2) {
			this.showUcFeelRating2();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcFeelRating3) {
			this.showUcFeelRating3();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcFeelRating4) {
			this.showUcFeelRating4();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcFeelRating5) {
			this.showUcFeelRating5();
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

		if (this.item.ht_userdata == this.dtPg.sceneUcData20) {
			this.isTimeChartPassed = true;

			this.sortTimeChart();

			this.chartTimer = setTimeout(() => {
				this.drawTimeChart();
			}, 500);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcData21 || this.item.ht_userdata == this.dtPg.sceneUcData22 || this.item.ht_userdata == this.dtPg.sceneUcData23) {

			this.isTimeChart2Passed = true;

			this.chartTimer = setTimeout(() => {
				this.drawTimeChart2();
			}, 500);
		}

		this.soundTimer = setTimeout(() => {
			this.playSound(this.item.ht_base_audio, this.item.ht_pcode, this.item.ht_audio);
		}, 500);
	}

	showUcAlarm1()
	{
		console.log('showUcAlarm1()');
		return;
	}

	showUcInput1()
	{
		console.log('showUcInput1()');
		return;
	}

	showUcInput2()
	{
		console.log('showUcInput2()');
		return;
	}

	showUcInput3()
	{
		console.log('showUcInput3()');
		return;
	}

	showUcInput4()
	{
		console.log('showUcInput4()');
		return;
	}

	showUcInput5()
	{
		console.log('showUcInput5()');
		return;
	}

	showUcFeelRating1()
	{
		console.log('showUcFeelRating1()');
		return;
	}

	showUcFeelRating2()
	{
		console.log('showUcFeelRating2()');
		return;
	}

	showUcFeelRating3()
	{
		console.log('showUcFeelRating3()');
		return;
	}

	showUcFeelRating4()
	{
		console.log('showUcFeelRating4()');
		return;
	}

	showUcFeelRating5()
	{
		console.log('showUcFeelRating5()');
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

	sortTimeChart()
	{
		console.log('sortTimeChart()');

		let result = [
			{ rank: 1, point: this.dtPg1st.resultUcFeelRating1, input:this.dtPg1st.resultUcInput1},
			{ rank: 2, point: this.dtPg1st.resultUcFeelRating2, input:this.dtPg1st.resultUcInput2},
			{ rank: 3, point: this.dtPg1st.resultUcFeelRating3, input:this.dtPg1st.resultUcInput3},
			{ rank: 4, point: this.dtPg1st.resultUcFeelRating4, input:this.dtPg1st.resultUcInput4},
			{ rank: 5, point: this.dtPg1st.resultUcFeelRating5, input:this.dtPg1st.resultUcInput5},
			{ rank: 6, point: this.dtPg.resultUcFeelRating1, input:this.dtPg.resultUcInput1},
			{ rank: 7, point: this.dtPg.resultUcFeelRating2, input:this.dtPg.resultUcInput2},
			{ rank: 8, point: this.dtPg.resultUcFeelRating3, input:this.dtPg.resultUcInput3},
			{ rank: 9, point: this.dtPg.resultUcFeelRating4, input:this.dtPg.resultUcInput4},
			{ rank: 10, point: this.dtPg.resultUcFeelRating5, input:this.dtPg.resultUcInput5}
		];

		let sortingField = "point";

		result.sort(function(a, b) { // 오름차순
			return b[sortingField] - a[sortingField];
		});

		if ((result[0].point - result[9].point) >= 3) {
			this.dtPg.selectUcData20 = 1;
		} else if (result[0].point - result[9].point > 0 && result[0].point - result[9].point < 3) {
			this.dtPg.selectUcData20 = 2;

		} else {
			this.dtPg.selectUcData20 = 3;
		}

		this.dtPg.resultUcData20 = result;

		return;
	}

	sendUcAlarm1()
	{
		console.log("sendUcAlarm1");

		if (this.dtPg.isUcAlarm1 == false) {
			this.util.toast('일어난 시간을 입력하셨습니다.');
			this.dtPg.isUcAlarm1 = true;

			if (this.dtPg.resultUcAlarm1.ampm == '오전' && this.dtPg.resultUcAlarm1.hour >= 10) {

				this.dtPg.resultUcAlarm2.ampm = '오후';
				this.dtPg.resultUcAlarm2.hour = this.dtPg.resultUcAlarm1.hour - 9;
				this.dtPg.resultUcAlarm2.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm3.ampm = '오후';
				this.dtPg.resultUcAlarm3.hour = this.dtPg.resultUcAlarm1.hour - 6;
				this.dtPg.resultUcAlarm3.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm4.ampm = '오후';
				this.dtPg.resultUcAlarm4.hour = this.dtPg.resultUcAlarm1.hour - 3;
				this.dtPg.resultUcAlarm4.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm5.ampm = '오후';
				this.dtPg.resultUcAlarm5.hour = this.dtPg.resultUcAlarm1.hour;
				this.dtPg.resultUcAlarm5.min = this.dtPg.resultUcAlarm1.min;
			} else if (this.dtPg.resultUcAlarm1.ampm == '오전' && this.dtPg.resultUcAlarm1.hour >= 7 && this.dtPg.resultUcAlarm1.hour < 10) {
				this.dtPg.resultUcAlarm2.ampm = '오전';
				this.dtPg.resultUcAlarm2.hour = this.dtPg.resultUcAlarm1.hour + 3;
				this.dtPg.resultUcAlarm2.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm3.ampm = '오후';
				this.dtPg.resultUcAlarm3.hour = this.dtPg.resultUcAlarm1.hour - 6;
				this.dtPg.resultUcAlarm3.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm4.ampm = '오후';
				this.dtPg.resultUcAlarm4.hour = this.dtPg.resultUcAlarm1.hour - 3;
				this.dtPg.resultUcAlarm4.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm5.ampm = '오후';
				this.dtPg.resultUcAlarm5.hour = this.dtPg.resultUcAlarm1.hour;
				this.dtPg.resultUcAlarm5.min = this.dtPg.resultUcAlarm1.min;
			} else if (this.dtPg.resultUcAlarm1.ampm == '오전' && this.dtPg.resultUcAlarm1.hour >= 4 && this.dtPg.resultUcAlarm1.hour < 7) {
				this.dtPg.resultUcAlarm2.ampm = '오전';
				this.dtPg.resultUcAlarm2.hour = this.dtPg.resultUcAlarm1.hour + 3;
				this.dtPg.resultUcAlarm2.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm3.ampm = '오전';
				this.dtPg.resultUcAlarm3.hour = this.dtPg.resultUcAlarm1.hour + 6;
				this.dtPg.resultUcAlarm3.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm4.ampm = '오후';
				this.dtPg.resultUcAlarm4.hour = this.dtPg.resultUcAlarm1.hour - 3;
				this.dtPg.resultUcAlarm4.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm5.ampm = '오후';
				this.dtPg.resultUcAlarm5.hour = this.dtPg.resultUcAlarm1.hour;
				this.dtPg.resultUcAlarm5.min = this.dtPg.resultUcAlarm1.min;
			} else if (this.dtPg.resultUcAlarm1.ampm == '오전' && this.dtPg.resultUcAlarm1.hour >= 1 && this.dtPg.resultUcAlarm1.hour < 4) {
				this.dtPg.resultUcAlarm2.ampm = '오전';
				this.dtPg.resultUcAlarm2.hour = this.dtPg.resultUcAlarm1.hour + 3;
				this.dtPg.resultUcAlarm2.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm3.ampm = '오전';
				this.dtPg.resultUcAlarm3.hour = this.dtPg.resultUcAlarm1.hour + 6;
				this.dtPg.resultUcAlarm3.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm4.ampm = '오전';
				this.dtPg.resultUcAlarm4.hour = this.dtPg.resultUcAlarm1.hour + 9;
				this.dtPg.resultUcAlarm4.min = this.dtPg.resultUcAlarm1.min;

				this.dtPg.resultUcAlarm5.ampm = '오후';
				this.dtPg.resultUcAlarm5.hour = this.dtPg.resultUcAlarm1.hour;
				this.dtPg.resultUcAlarm5.min = this.dtPg.resultUcAlarm1.min;
			}

			console.log("dtPg.resultUcAlarm1.ampm", this.dtPg.resultUcAlarm1.ampm);
			console.log("dtPg.resultUcAlarm1.hour", this.dtPg.resultUcAlarm1.hour);
			console.log("dtPg.resultUcAlarm2.ampm", this.dtPg.resultUcAlarm2.ampm);
			console.log("dtPg.resultUcAlarm2.hour", this.dtPg.resultUcAlarm2.hour);
			console.log("dtPg.resultUcAlarm3.ampm", this.dtPg.resultUcAlarm3.ampm);
			console.log("dtPg.resultUcAlarm3.hour", this.dtPg.resultUcAlarm3.hour);
			console.log("dtPg.resultUcAlarm4.ampm", this.dtPg.resultUcAlarm4.ampm);
			console.log("dtPg.resultUcAlarm4.hour", this.dtPg.resultUcAlarm4.hour);
			console.log("dtPg.resultUcAlarm5.ampm", this.dtPg.resultUcAlarm5.ampm);
			console.log("dtPg.resultUcAlarm5.hour", this.dtPg.resultUcAlarm5.hour);

			return;
		}
	}

	sendUcInput1()
	{
		console.log('sendUcInput1()');

		if (this.dtPg.resultUcInput1 == -1)
		{
			this.util.toast('보기의 활동을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 활동을 선택하셨습니다.');
			this.dtPg.isUcInput1 = true;
			return;
		}
	}

	sendUcInput2()
	{
		console.log('sendUcInput2()');

		if (this.dtPg.resultUcInput2 == -1)
		{
			this.util.toast('보기의 활동을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 활동을 선택하셨습니다.');
			this.dtPg.isUcInput2 = true;
			return;
		}
	}

	sendUcInput3()
	{
		console.log('sendUcInput3()');

		if (this.dtPg.resultUcInput3 == -1)
		{
			this.util.toast('보기의 활동을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 활동을 선택하셨습니다.');
			this.dtPg.isUcInput3 = true;
			return;
		}
	}

	sendUcInput4()
	{
		console.log('sendUcInput4()');

		if (this.dtPg.resultUcInput4 == -1)
		{
			this.util.toast('보기의 활동을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 활동을 선택하셨습니다.');
			this.dtPg.isUcInput4 = true;
			return;
		}
	}

	sendUcInput5()
	{
		console.log('sendUcInput5()');

		if (this.dtPg.resultUcInput5 == -1)
		{
			this.util.toast('보기의 활동을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 활동을 선택하셨습니다.');
			this.dtPg.isUcInput5 = true;
			return;
		}
	}

	sendUcFeelRating1()
	{
		console.log("sendUcFeelRating1", this.dtPg.resultUcFeelRating1);

		if (this.dtPg.resultUcFeelRating1 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating1 = true;
			return;		
		}
	}

	sendUcFeelRating2()
	{
		console.log("sendUcFeelRating2", this.dtPg.resultUcFeelRating2);

		if (this.dtPg.resultUcFeelRating2 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating2 = true;
			return;		
		}
	}

	sendUcFeelRating3()
	{
		console.log("sendUcFeelRating3", this.dtPg.resultUcFeelRating3);

		if (this.dtPg.resultUcFeelRating3 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating3 = true;
			return;		
		}
	}

	sendUcFeelRating4()
	{
		console.log("sendUcFeelRating4", this.dtPg.resultUcFeelRating4);

		if (this.dtPg.resultUcFeelRating4 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating4 = true;
			return;		
		}
	}

	sendUcFeelRating5()
	{
		console.log("sendUcFeelRating5", this.dtPg.resultUcFeelRating5);

		if (this.dtPg.resultUcFeelRating5 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating5 = true;
			return;		
		}
	}

	sendUcInput25()
	{
		console.log('sendUcInput25()');

		if (this.dtPg.resultUcInput25 == -1)
		{
			this.util.toast('보기의 활동을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 활동을 선택하셨습니다.');
			this.dtPg.isUcInput25 = true;
			return;
		}
	}

	sendUcInput27()
	{
		console.log('sendUcInput27()');

		if (this.dtPg.resultUcInput27 == -1)
		{
			this.util.toast('보기의 활동을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 활동을 선택하셨습니다.');
			this.dtPg.isUcInput27 = true;
			return;
		}
	}

	sendUcInput31()
	{
		console.log('sendUcInput31()');

		if (this.dtPg.resultUcInput31 == -1)
		{
			this.util.toast('보기의 활동을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 활동을 선택하셨습니다.');
			this.dtPg.isUcInput31 = true;
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

		if (this.dtPg.resultUcQuiz2[1] == false &&
			this.dtPg.resultUcQuiz2[2] == false &&
			this.dtPg.resultUcQuiz2[3] == false &&
			this.dtPg.resultUcQuiz2[4] == false )
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcQuiz2[1] == this.dtPg.passUcQuiz2[1] &&
			this.dtPg.resultUcQuiz2[2] == this.dtPg.passUcQuiz2[2] &&
			this.dtPg.resultUcQuiz2[3] == this.dtPg.passUcQuiz2[3] &&
			this.dtPg.resultUcQuiz2[4] == this.dtPg.passUcQuiz2[4] )
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

	/* time */
	changeAmPmUp()
	{
		if (this.dtPg.resultUcAlarm1.ampm == '오전') {
			this.dtPg.resultUcAlarm1.ampm = '오후';
		} else {
			this.dtPg.resultUcAlarm1.ampm = '오전';
		}
	}

	changeAmPmDown()
	{
		if (this.dtPg.resultUcAlarm1.ampm == '오전') {
			this.dtPg.resultUcAlarm1.ampm = '오후';
		} else {
			this.dtPg.resultUcAlarm1.ampm = '오전';
		}
	}

	changeHourUp()
	{
		if (this.dtPg.resultUcAlarm1.hour == 12) {
			this.dtPg.resultUcAlarm1.hour = 1;
		} else {
			this.dtPg.resultUcAlarm1.hour += 1;
		}
	}

	changeHourDown()
	{
		if (this.dtPg.resultUcAlarm1.hour == 1) {
			this.dtPg.resultUcAlarm1.hour = 12;
		} else {
			this.dtPg.resultUcAlarm1.hour -= 1;
		}
	}

	changeMinUp()
	{
		if (this.dtPg.resultUcAlarm1.min == 55) {
			this.dtPg.resultUcAlarm1.min = 0;
		} else {
			this.dtPg.resultUcAlarm1.min += 5;
		}
	}

	changeMinDown()
	{
		if (this.dtPg.resultUcAlarm1.min == 0) {
			this.dtPg.resultUcAlarm1.min = 55;
		} else {
			this.dtPg.resultUcAlarm1.min -= 5;
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

	drawTimeChart()
	{
		console.log('drawTimeChart()');

		this.objLineTimeChart = new Chart(this.lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: [this.dtPg.resultUcAlarm1['ampm']+' '+this.dtPg.resultUcAlarm1['hour']+'시', this.dtPg.resultUcAlarm2['ampm']+' '+this.dtPg.resultUcAlarm2['hour']+'시', this.dtPg.resultUcAlarm3['ampm']+' '+this.dtPg.resultUcAlarm3['hour']+'시', this.dtPg.resultUcAlarm4['ampm']+' '+this.dtPg.resultUcAlarm4['hour']+'시', this.dtPg.resultUcAlarm5['ampm']+' '+this.dtPg.resultUcAlarm5['hour']+'시'],
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
					data: [this.dtPg.resultUcFeelRating1, this.dtPg.resultUcFeelRating2, this.dtPg.resultUcFeelRating3, this.dtPg.resultUcFeelRating4, this.dtPg.resultUcFeelRating5],
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
							max : 5,
							min : 0,
							stepSize: 1
						}
					}],
				}
			}
		});

		if (this.item.ht_tpcode == 'hcst020') {
			setTimeout(() => {
				this.isTimeChartPassed = false;
			}, 500);
		}
	}

	drawTimeChart2()
	{
		console.log('drawTimeChart2()');

		this.objLineTimeChart2 = new Chart(this.lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: [this.dtPg1st.resultUcAlarm1['ampm']+' '+this.dtPg1st.resultUcAlarm1['hour']+'시', this.dtPg1st.resultUcAlarm2['ampm']+' '+this.dtPg1st.resultUcAlarm2['hour']+'시', this.dtPg1st.resultUcAlarm3['ampm']+' '+this.dtPg1st.resultUcAlarm3['hour']+'시', this.dtPg1st.resultUcAlarm4['ampm']+' '+this.dtPg1st.resultUcAlarm4['hour']+'시', this.dtPg1st.resultUcAlarm5['ampm']+' '+this.dtPg1st.resultUcAlarm5['hour']+'시',
				this.dtPg.resultUcAlarm1['ampm']+' '+this.dtPg.resultUcAlarm1['hour']+'시', this.dtPg.resultUcAlarm2['ampm']+' '+this.dtPg.resultUcAlarm2['hour']+'시', this.dtPg.resultUcAlarm3['ampm']+' '+this.dtPg.resultUcAlarm3['hour']+'시', this.dtPg.resultUcAlarm4['ampm']+' '+this.dtPg.resultUcAlarm4['hour']+'시', this.dtPg.resultUcAlarm5['ampm']+' '+this.dtPg.resultUcAlarm5['hour']+'시'],
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
					data: [this.dtPg1st.resultUcFeelRating1, this.dtPg1st.resultUcFeelRating2, this.dtPg1st.resultUcFeelRating3, this.dtPg1st.resultUcFeelRating4, this.dtPg1st.resultUcFeelRating5,
					this.dtPg.resultUcFeelRating1, this.dtPg.resultUcFeelRating2, this.dtPg.resultUcFeelRating3, this.dtPg.resultUcFeelRating4, this.dtPg.resultUcFeelRating5],
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
							max : 10,
							min : 0,
							stepSize: 1
						}
					}],
				}
			}
		});

		if (this.item.ht_tpcode == 'hcst021' || this.item.ht_tpcode == 'hcst022' || this.item.ht_tpcode == 'hcst023') {
			setTimeout(() => {
				this.isTimeChart2Passed = false;
			}, 500);
		}
	}
}
