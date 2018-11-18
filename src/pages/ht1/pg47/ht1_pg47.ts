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
import { Ht1Pg47Data } from './ht1_pg47.data';

@IonicPage()
@Component({
  selector: 'ht1-page-pg47',
  templateUrl: 'ht1_pg47.html',
})
export class Ht1Pg47Page {

	/* Common */
	pgConfig = new Ht1PgConfig(47);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg = new Ht1Pg47Data();

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
		console.log('ionViewDidLoad Pg47Page');
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

		let dtPgData = new Ht1Pg47Data();
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

		this.pgConfig.sceneNumber--;

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
		if (this.pgConfig.sceneNumber == this.pgConfig.sceneTodayFeelRating) {
			if (this.pgConfig.countTodayFeelRating == -1) {
				this.util.toast('현재의 기분평점을 선택하세요.');
				return false;
			} else if (this.pgConfig.isTodayFeelRating == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput10) {
			if (this.dtPg.resultUcInput10[1] == -1 &&
				this.dtPg.resultUcInput10[2] == -1 &&
				this.dtPg.resultUcInput10[3] == -1 &&
				this.dtPg.resultUcInput10[4] == -1 &&
				this.dtPg.resultUcInput10[5] == -1 &&
				this.dtPg.resultUcInput10[6] == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput10 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput13) {
			if (this.dtPg.isUcInput13 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput14) {
			if (this.dtPg.isUcInput14 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput15) {
			if (this.dtPg.isUcInput15 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput16) {
			if (this.dtPg.isUcInput16 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput18) {
			if (this.dtPg.isUcInput18 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput20) {
			if (this.dtPg.isUcInput20 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput22) {
			if (this.dtPg.isUcInput22 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput24) {
			let countCheck = 0;

			if (this.dtPg.resultUcInput10[1] != -1)
				countCheck++;
			if (this.dtPg.resultUcInput10[2] != -1)
				countCheck++;
			if (this.dtPg.resultUcInput10[3] != -1)
				countCheck++;
			if (this.dtPg.resultUcInput10[4] != -1)
				countCheck++;
			if (this.dtPg.resultUcInput10[5] != -1)
				countCheck++;
			if (this.dtPg.resultUcInput10[6] != -1)
				countCheck++;

			if (this.dtPg.stepUcInput24 <= countCheck++)
			{
				this.util.toast('보기의 항목을 모두 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput24 == false) {
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

		if (this.item.ht_userdata == this.dtPg.sceneUcInput10) {
			this.showUcInput10();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput13) {
			this.showUcInput13();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput14) {
			this.showUcInput14();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput15) {
			this.showUcInput15();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput16) {
			this.showUcInput16();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput18) {
			this.showUcInput18();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput20) {
			this.showUcInput20();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput22) {
			this.showUcInput22();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput24) {
			this.showUcInput24();
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

	showUcInput10()
	{
		console.log('showUcInput10()');
		return;
	}

	showUcInput13()
	{
		console.log('showUcInput13()');
		return;
	}

	showUcInput14()
	{
		console.log('showUcInput14()');
		return;
	}

	showUcInput15()
	{
		console.log('showUcInput15()');
		return;
	}

	showUcInput16()
	{
		console.log('showUcInput16()');
		return;
	}

	showUcInput18()
	{
		console.log('showUcInput18()');
		return;
	}

	showUcInput20()
	{
		console.log('showUcInput20()');
		return;
	}

	showUcInput22()
	{
		console.log('showUcInput22()');
		return;
	}

	showUcInput24()
	{
		console.log('showUcInput24()');
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

	sendSelectPick10(num)
	{
		if (this.dtPg.resultUcInput10[num] == -1) {
			this.dtPg.resultUcInput10[num] = num;
		} else {
			this.dtPg.resultUcInput10[num] = -1;
		}
	}

	sendSelectPick13(num)
	{
		if (this.dtPg.resultUcInput13[num] == -1) {
			this.dtPg.resultUcInput13[num] = num;
		} else {
			this.dtPg.resultUcInput13[num] = -1;
		}
	}

	sendSelectPick14(num)
	{
		if (this.dtPg.resultUcInput14[num] == -1) {
			this.dtPg.resultUcInput14[num] = num;
		} else {
			this.dtPg.resultUcInput14[num] = -1;
		}
	}

	sendSelectPick15(num)
	{
		if (this.dtPg.resultUcInput15[num] == -1) {
			this.dtPg.resultUcInput15[num] = num;
		} else {
			this.dtPg.resultUcInput15[num] = -1;
		}
	}

	sendSelectPick16(num)
	{
		if (this.dtPg.resultUcInput16[num] == -1) {
			this.dtPg.resultUcInput16[num] = num;
		} else {
			this.dtPg.resultUcInput16[num] = -1;
		}
	}

	sendSelectPick18(num)
	{
		if (this.dtPg.resultUcInput18[num] == -1) {
			this.dtPg.resultUcInput18[num] = num;
		} else {
			this.dtPg.resultUcInput18[num] = -1;
		}
	}

	sendSelectPick20(num)
	{
		if (this.dtPg.resultUcInput20[num] == -1) {
			this.dtPg.resultUcInput20[num] = num;
		} else {
			this.dtPg.resultUcInput20[num] = -1;
		}
	}

	sendSelectPick22(num)
	{
		if (this.dtPg.resultUcInput22[num] == -1) {
			this.dtPg.resultUcInput22[num] = num;
		} else {
			this.dtPg.resultUcInput22[num] = -1;
		}
	}

	sendUcInput10()
	{
		console.log('sendUcInput10()');

		if (this.dtPg.resultUcInput10[1] == -1 &&
			this.dtPg.resultUcInput10[2] == -1 &&
			this.dtPg.resultUcInput10[3] == -1 &&
			this.dtPg.resultUcInput10[4] == -1 &&
			this.dtPg.resultUcInput10[5] == -1 &&
			this.dtPg.resultUcInput10[6] == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return false;
		} else {
			this.util.alert('보기의 항목을 선택했습니다.');
			this.dtPg.isUcInput10 = true;

			return false;
		}

	}

	sendUcInput13()
	{
		console.log('sendUcInput13()');

		this.util.alert('항목을 선택하셨습니다.');
		this.dtPg.isUcInput13 = true;

		return;
	}

	sendUcInput14()
	{
		console.log('sendUcInput14()');

		this.util.alert('항목을 선택하셨습니다.');
		this.dtPg.isUcInput14 = true;

		return;
	}

	sendUcInput15()
	{
		console.log('sendUcInput15()');

		this.util.alert('항목을 선택하셨습니다.');
		this.dtPg.isUcInput15 = true;

		return;
	}

	sendUcInput16()
	{
		console.log('sendUcInput16()');

		let isFound = false;

		if (this.dtPg.resultUcInput10[1] != -1 &&
			this.dtPg.resultUcInput13[1] == -1 &&
			this.dtPg.resultUcInput14[1] == -1 &&
			this.dtPg.resultUcInput15[1] == -1 &&
			this.dtPg.resultUcInput16[1] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[2] != -1 &&
			this.dtPg.resultUcInput13[2] == -1 &&
			this.dtPg.resultUcInput14[2] == -1 &&
			this.dtPg.resultUcInput15[2] == -1 &&
			this.dtPg.resultUcInput16[2] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[3] != -1 &&
			this.dtPg.resultUcInput13[3] == -1 &&
			this.dtPg.resultUcInput14[3] == -1 &&
			this.dtPg.resultUcInput15[3] == -1 &&
			this.dtPg.resultUcInput16[3] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[4] != -1 &&
			this.dtPg.resultUcInput13[4] == -1 &&
			this.dtPg.resultUcInput14[4] == -1 &&
			this.dtPg.resultUcInput15[4] == -1 &&
			this.dtPg.resultUcInput16[4] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[5] != -1 &&
			this.dtPg.resultUcInput13[5] == -1 &&
			this.dtPg.resultUcInput14[5] == -1 &&
			this.dtPg.resultUcInput15[5] == -1 &&
			this.dtPg.resultUcInput16[5] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[6] != -1 &&
			this.dtPg.resultUcInput13[6] == -1 &&
			this.dtPg.resultUcInput14[6] == -1 &&
			this.dtPg.resultUcInput15[6] == -1 &&
			this.dtPg.resultUcInput16[6] == -1)
			isFound = true;

		if (isFound)
		{
			this.util.toast('보기의 나머지 항목을 모두 선택하세요.');
			return;
		} else {
			this.util.alert('항목을 선택하셨습니다.');
			this.dtPg.isUcInput16 = true;
		}

		return;
	}

	sendUcInput18()
	{
		console.log('sendUcInput18()');

		this.util.alert('항목을 선택하셨습니다.');
		this.dtPg.isUcInput18 = true;

		return;
	}

	sendUcInput20()
	{
		console.log('sendUcInput20()');

		this.util.alert('항목을 선택하셨습니다.');
		this.dtPg.isUcInput20 = true;

		return;
	}

	sendUcInput22()
	{
		console.log('sendUcInput22()');

		let isFound = false;

		if (this.dtPg.resultUcInput10[1] != -1 &&
			this.dtPg.resultUcInput18[1] == -1 &&
			this.dtPg.resultUcInput20[1] == -1 &&
			this.dtPg.resultUcInput22[1] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[2] != -1 &&
			this.dtPg.resultUcInput18[2] == -1 &&
			this.dtPg.resultUcInput20[2] == -1 &&
			this.dtPg.resultUcInput22[2] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[3] != -1 &&
			this.dtPg.resultUcInput18[3] == -1 &&
			this.dtPg.resultUcInput20[3] == -1 &&
			this.dtPg.resultUcInput22[3] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[4] != -1 &&
			this.dtPg.resultUcInput18[4] == -1 &&
			this.dtPg.resultUcInput20[4] == -1 &&
			this.dtPg.resultUcInput22[4] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[5] != -1 &&
			this.dtPg.resultUcInput18[5] == -1 &&
			this.dtPg.resultUcInput20[5] == -1 &&
			this.dtPg.resultUcInput22[5] == -1)
			isFound = true;

		if (this.dtPg.resultUcInput10[6] != -1 &&
			this.dtPg.resultUcInput18[6] == -1 &&
			this.dtPg.resultUcInput20[6] == -1 &&
			this.dtPg.resultUcInput22[6] == -1)
			isFound = true;

		if (isFound)
		{
			this.util.toast('보기의 나머지 항목을 모두 선택하세요.');
			return;
		} else {
			this.util.alert('항목을 선택하셨습니다.');
			this.dtPg.isUcInput22 = true;
		}

		return;
	}

	/* 순서선택 버튼처리 */
	sendSelectOrder24(num)
	{
		this.dtPg.orderUcInput24[num] = this.dtPg.stepUcInput24;
		this.dtPg.resultUcInput24[this.dtPg.stepUcInput24] = num;
		this.dtPg.stepUcInput24++;
	}

	sendSelectClear24()
	{
		this.dtPg.orderUcInput24[1] = -1;
		this.dtPg.orderUcInput24[2] = -1;
		this.dtPg.orderUcInput24[3] = -1;
		this.dtPg.orderUcInput24[4] = -1;
		this.dtPg.orderUcInput24[5] = -1;
		this.dtPg.orderUcInput24[6] = -1;
		this.dtPg.resultUcInput24[1] = -1;
		this.dtPg.resultUcInput24[2] = -1;
		this.dtPg.resultUcInput24[3] = -1;
		this.dtPg.resultUcInput24[4] = -1;
		this.dtPg.resultUcInput24[5] = -1;
		this.dtPg.resultUcInput24[6] = -1;
		this.dtPg.stepUcInput24 = 1;
	}

	sendUcInput24()
	{
		console.log('sendUcInput24()');

		let countCheck = 0;

		if (this.dtPg.resultUcInput10[1] != -1)
			countCheck++;
		if (this.dtPg.resultUcInput10[2] != -1)
			countCheck++;
		if (this.dtPg.resultUcInput10[3] != -1)
			countCheck++;
		if (this.dtPg.resultUcInput10[4] != -1)
			countCheck++;
		if (this.dtPg.resultUcInput10[5] != -1)
			countCheck++;
		if (this.dtPg.resultUcInput10[6] != -1)
			countCheck++;

		if (this.dtPg.stepUcInput24 <= countCheck++)
		{
			this.util.toast('보기의 항목을 모두 선택하세요.');
			return;
		} else {
			this.util.alert('항목을 우선순위대로 선택하셨습니다.');
			this.dtPg.isUcInput24 = true;

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
