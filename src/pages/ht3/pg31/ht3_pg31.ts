import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ViewController, NavParams, Events, Platform, IonicPage } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Media, MediaObject } from '@ionic-native/media';
import { StatusBar } from '@ionic-native/status-bar';
import { StorageProvider } from '../../../providers/ht3/storage/storage';
import { UtilProvider } from '../../../providers/ht3/util/util';
import { ApiProvider } from '../../../providers/ht3/api/api';
import { Chart } from 'chart.js';
import { Ht3PgConfig } from '../config/pg.config';
import { Ht3Pg31Data } from './ht3_pg31.data';

@IonicPage()
@Component({
  selector: 'ht3-page-pg31',
  templateUrl: 'ht3_pg31.html',
})
export class Ht3Pg31Page {

	/* Common */
	pgConfig = new Ht3PgConfig(31);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg = new Ht3Pg31Data();

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
		console.log('ionViewDidLoad Pg31Page');
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

		let dtPgData = new Ht3Pg31Data();
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

		// 통증평가 조회
		this.initTodayAche();

		// 볼륨상태
		this.pgConfig.volumeState = this.storage.getVolumeState();

		this.showPage();
	}

	initTodayAche()
	{
		console.log('ngOnInit');

		// 통증평가 조회
		this.refreshRatingData();

		// 통증평가 이벤트
		this.events.subscribe('haruTodayRatingInfo:changed', (data) => {
			this.refreshRatingData();

			this.pgConfig.isTodayAcheRating = true;
		});

		// 통증평가 참여시
		if (this.pgConfig.itemTodayAcheRating[this.itemTarget.pnum] != -1) {
			this.pgConfig.isTodayAcheRating = true;
			this.pgConfig.countTodayAcheRating = this.pgConfig.itemTodayAcheRating[this.itemTarget.pnum];
		}

		console.log('today_date : ', this.pgConfig.todayDate);
		console.log('targetdate : ', this.itemTarget.targetdate);
		console.log('통증평점 상태 : ', this.pgConfig.isTodayAcheRating);
	}

	refreshRatingData()
	{
		this.pgConfig.itemTodayAcheRating = this.storage.getHaruTodayRatingInfo();

		this.pgConfig.itemTodayAcheDays.length = 0;
		this.pgConfig.itemTodayAcheGraphs.length = 0;
		for (let i = 1; i <= this.itemTarget.pnum; i++) {
			this.pgConfig.itemTodayAcheDays.push(i.toLocaleString() + '회기');
			this.pgConfig.itemTodayAcheGraphs.push(this.pgConfig.itemTodayAcheRating[i]);
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
		console.log('checkInput()');
	
		if (this.pgConfig.sceneNumber == this.pgConfig.sceneTodayAcheRating) {
			if (this.pgConfig.countTodayAcheRating == -1) {
				this.util.toast('오늘은 통증이 얼마나 심한지 선택하세요.');
				return false;
			} else if (this.pgConfig.isTodayAcheRating == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneTodayAcheBody) {
			if (this.dtPg.countTodayAcheBody != 3) {
				this.util.toast('제일 아픈 부위 3곳을 선택하세요.');
				return false;
			} else if (this.dtPg.isTodayAcheBody == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating14) {
			if (this.dtPg.resultUcFeelRating14 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating14 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput16) {
			if (this.dtPg.countUcInput16 == -1) {
				this.util.toast('이때의 점수를 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput16 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput19) {
			if (this.dtPg.resultUcInput19[1] == false &&
				this.dtPg.resultUcInput19[2] == false &&
				this.dtPg.resultUcInput19[3] == false &&
				this.dtPg.resultUcInput19[4] == false &&
				this.dtPg.resultUcInput19[5] == false)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput19 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput22) {
			if (this.dtPg.resultUcInput22[1] == false &&
				this.dtPg.resultUcInput22[2] == false &&
				this.dtPg.resultUcInput22[3] == false &&
				this.dtPg.resultUcInput22[4] == false &&
				this.dtPg.resultUcInput22[5] == false)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput22 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput29) {
			if (this.dtPg.isUcInput29 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput32) {
			if (this.dtPg.resultUcInput32[1] == -1 ||
				this.dtPg.resultUcInput22[2] == -1)
			{
				this.util.toast('보기의 장점 및 단점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput32 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput33) {
			if (this.dtPg.resultUcInput33 == -1) {
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput33 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput36) {
			if (this.dtPg.countUcInput36 == -1) {
				this.util.toast('이때의 점수를 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput36 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating37) {
			if (this.dtPg.resultUcFeelRating37 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating37 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcQuiz1) {
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

		if (this.item.ht_userdata == this.dtPg.sceneUcQuiz1) {
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

	checkTodayAcheBody(val)
	{
		this.dtPg.countTodayAcheBody = 0;

		for (let i = 1; i <= 14; i++) {
			if (this.dtPg.resultTodayAcheBody[i])
				this.dtPg.countTodayAcheBody++;
		}

		this.dtPg.selectTodayAcheBody[1] = -1;
		this.dtPg.selectTodayAcheBody[2] = -1;
		this.dtPg.selectTodayAcheBody[3] = -1;

		if (this.dtPg.countTodayAcheBody > 3) {
			this.util.alert('3곳을 초과할 수 없습니다.');
			val.checked = false;
		} else {

			for (let i = 1; i <= 14; i++) {
				if (this.dtPg.resultTodayAcheBody[i]) {
					this.dtPg.selectTodayAcheBody[1] = i;
					break;
				}
			}

			for (let i = 1; i <= 14; i++) {
				if (this.dtPg.resultTodayAcheBody[i] && this.dtPg.selectTodayAcheBody[1] != i) {
					this.dtPg.selectTodayAcheBody[2] = i;
					break;
				}
			}

			for (let i = 1; i <= 14; i++) {
				if (this.dtPg.resultTodayAcheBody[i] && this.dtPg.selectTodayAcheBody[1] != i && this.dtPg.selectTodayAcheBody[2] != i) {
					this.dtPg.selectTodayAcheBody[3] = i;
					break;
				}
			}
		}

		return;
	}

	sendTodayAcheBody()
	{
		console.log('sendTodayAcheBody()');

		if (this.dtPg.countTodayAcheBody != 3)
		{
			this.util.toast('제일 아픈 부위 3곳을 선택하세요.');
			return false;
		} else {

			this.dtPg.isTodayAcheBody = true;
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

	sendUcFeelRating14()
	{
		console.log("sendUcFeelRating14", this.dtPg.resultUcFeelRating14);

		if (this.dtPg.resultUcFeelRating14 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating14 = true;
			return;		
		}
	}

	sendUcInput16()
	{
		console.log("sendUcInput16", this.dtPg.countUcInput16);

		if (this.dtPg.countUcInput16 == -1)
		{
			this.util.toast('이때의 점수를 선택하세요.');
			return;
		} else {
			this.util.toast('점수를 평가하셨습니다.');
			this.dtPg.isUcInput16 = true;
			return;		
		}
	}

	sendUcInput19()
	{
		console.log('sendUcInput19()');

		if (this.dtPg.resultUcInput19[1] == false &&
			this.dtPg.resultUcInput19[2] == false &&
			this.dtPg.resultUcInput19[3] == false &&
			this.dtPg.resultUcInput19[4] == false &&
			this.dtPg.resultUcInput19[5] == false)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else if (this.dtPg.isUcInput19 == false) {
			this.util.alert('해당 항목을 선택하셨습니다.');

			this.dtPg.countUcInput19 = 0;
			if (this.dtPg.resultUcInput19[1])
				this.dtPg.countUcInput19 += 1;
			if (this.dtPg.resultUcInput19[2])
				this.dtPg.countUcInput19 += 1;
			if (this.dtPg.resultUcInput19[3])
				this.dtPg.countUcInput19 += 1;
			if (this.dtPg.resultUcInput19[4])
				this.dtPg.countUcInput19 += 1;
			if (this.dtPg.resultUcInput19[5])
				this.dtPg.countUcInput19 += 1;

			this.dtPg.isUcInput19 = true;
			return;
		}

		return;
	}

	sendUcInput22()
	{
		console.log('sendUcInput22()');

		if (this.dtPg.resultUcInput22[1] == false &&
			this.dtPg.resultUcInput22[2] == false &&
			this.dtPg.resultUcInput22[3] == false &&
			this.dtPg.resultUcInput22[4] == false &&
			this.dtPg.resultUcInput22[5] == false)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else if (this.dtPg.isUcInput22 == false) {
			this.util.alert('해당 항목을 선택하셨습니다.');

			this.dtPg.countUcInput22 = 0;
			if (this.dtPg.resultUcInput22[1])
				this.dtPg.countUcInput22 += 1;
			if (this.dtPg.resultUcInput22[2])
				this.dtPg.countUcInput22 += 1;
			if (this.dtPg.resultUcInput22[3])
				this.dtPg.countUcInput22 += 1;
			if (this.dtPg.resultUcInput22[4])
				this.dtPg.countUcInput22 += 1;
			if (this.dtPg.resultUcInput22[5])
				this.dtPg.countUcInput22 += 1;

			this.dtPg.isUcInput22 = true;
			return;
		}

		return;
	}

	changeUp19(num) {
		console.log('changeUp19()');

		if (this.dtPg.pointUcInput19[num] < 10)
		{
			this.dtPg.pointUcInput19[num] += 1;
		}

		return;
	}

	changeDown19(num) {
		console.log('changeDown19()');

		if (this.dtPg.pointUcInput19[num] >= 1)
		{
			this.dtPg.pointUcInput19[num] -= 1;
		}

		return;
	}

	changeUp22(num) {
		console.log('changeUp22()');

		if (this.dtPg.pointUcInput22[num] < 10)
		{
			this.dtPg.pointUcInput22[num] += 1;
		}

		return;
	}

	changeDown22(num) {
		console.log('changeDown22()');

		if (this.dtPg.pointUcInput22[num] >= 1)
		{
			this.dtPg.pointUcInput22[num] -= 1;
		}

		return;
	}

	sendUcInput29()
	{
		console.log("sendUcInput29");

		this.dtPg.sumUcInput19 = 0;
		this.dtPg.sumUcInput19 += this.dtPg.pointUcInput19[1];
		this.dtPg.sumUcInput19 += this.dtPg.pointUcInput19[2];
		this.dtPg.sumUcInput19 += this.dtPg.pointUcInput19[3];
		this.dtPg.sumUcInput19 += this.dtPg.pointUcInput19[4];
		this.dtPg.sumUcInput19 += this.dtPg.pointUcInput19[5];

		this.dtPg.sumUcInput22 = 0;
		this.dtPg.sumUcInput22 += this.dtPg.pointUcInput22[1];
		this.dtPg.sumUcInput22 += this.dtPg.pointUcInput22[2];
		this.dtPg.sumUcInput22 += this.dtPg.pointUcInput22[3];
		this.dtPg.sumUcInput22 += this.dtPg.pointUcInput22[4];
		this.dtPg.sumUcInput22 += this.dtPg.pointUcInput22[5];

		this.util.toast('점수를 평가하셨습니다.');
		this.dtPg.isUcInput29 = true;
		return;		
	}

	sendUcInput32()
	{
		console.log('sendUcInput32()');

		if (this.dtPg.resultUcInput32[1] == -1 ||
			this.dtPg.resultUcInput32[2] == -1)
		{
			this.util.toast('보기의 장점 단점을 선택하세요.');
			return;
		} else if (this.dtPg.isUcInput32 == false) {
			this.util.alert('해당 항목을 선택하셨습니다.');

			this.dtPg.isUcInput32 = true;
			return;
		}

		return;
	}

	sendUcInput33()
	{
		console.log('sendUcInput33()');

		if (this.dtPg.resultUcInput33 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else if (this.dtPg.isUcInput33 == false) {
			this.util.alert('해당 항목을 선택하셨습니다.');

			this.dtPg.selectUcInput33 = 0;

			if (this.dtPg.countUcInput19 > this.dtPg.countUcInput22)
				this.dtPg.selectUcInput33 += 1;

			if (this.dtPg.sumUcInput19 > this.dtPg.sumUcInput19)
				this.dtPg.selectUcInput33 += 1;

			if (this.dtPg.resultUcInput33 == 1)
				this.dtPg.selectUcInput33 += 1;

			this.dtPg.isUcInput33 = true;
			return;
		}

		return;
	}

	sendUcInput36()
	{
		console.log("sendUcInput36", this.dtPg.countUcInput36);

		if (this.dtPg.countUcInput36 == -1)
		{
			this.util.toast('이때의 점수를 선택하세요.');
			return;
		} else {
			this.util.toast('점수를 평가하셨습니다.');
			this.dtPg.isUcInput36 = true;
			return;		
		}
	}

	sendUcFeelRating37()
	{
		console.log("sendUcFeelRating37", this.dtPg.resultUcFeelRating37);

		if (this.dtPg.resultUcFeelRating37 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating37 = true;
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

	sendTodayAcheRating()
	{
		console.log("sendTodayAcheRating", this.pgConfig.countTodayAcheRating);

		if (this.pgConfig.countTodayAcheRating == -1)
		{
			this.util.toast('오늘은 통증이 얼마나 심한지 선택하세요.');
			return;
		}

		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harutoday_rating", "id": userInfo.id, "key": userInfo.key, "pcount": this.itemTarget.pnum, "rating": this.pgConfig.countTodayAcheRating};

		console.log('sendTodayAcheRating requestData', requestData);

		this.api.postData('harutoday_rating', requestData).then((data) => {

			let responseData:any = data;

			console.log('sendTodayAcheRating responseData', responseData);

			if (responseData.mode == 'harutoday_rating' && responseData.code == 'ok')
			{
				// 기분평가 설정
				this.storage.setHaruTodayRatingInfo(responseData.result.rating_items);
				this.storage.setLastRatingDate(responseData.result.last_rating_date);

			}
		}, (err) => {
			// Error log
			console.log('error sendTodayAcheRating');
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
		this.refreshRatingData();

		this.pgConfig.objLineChart = new Chart(this.lineCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: this.pgConfig.itemTodayAcheDays,
				datasets: [{
					label: '통증평점',
					fill: false,
					lineTension: 0,
					backgroundColor: "rgba(27, 176, 144, 0.4)",
					borderColor: "rgba(27, 176, 144, 1.0)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.1,
					borderJoinStyle: 'circle',
					pointBorderColor: "rgba(27, 176, 144, 1.0)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(27, 176, 144, 1.0)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: this.pgConfig.itemTodayAcheGraphs,
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

	openUrl(url) {
		this.util.openUrl(url);
	}
}
