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
import { Ht1Pg31Data } from './ht1_pg31.data';

@IonicPage()
@Component({
  selector: 'ht1-page-pg31',
  templateUrl: 'ht1_pg31.html',
})
export class Ht1Pg31Page {

	/* Common */
	pgConfig = new Ht1PgConfig(31);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;
	@ViewChild('pieCanvas') pieCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg = new Ht1Pg31Data();

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
	}

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

		let dtPgData = new Ht1Pg31Data();
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
		if (this.pgConfig.sceneNumber == this.pgConfig.sceneTodayFeelRating) {
			if (this.pgConfig.countTodayFeelRating == -1) {
				this.util.toast('현재의 기분평점을 선택하세요.');
				return false;
			} else if (this.pgConfig.isTodayFeelRating == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		}

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating10) {
			if (this.dtPg.resultUcFeelRating10 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating10 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcFeelRating25) {
			if (this.dtPg.resultUcFeelRating25 == -1) {
				this.util.toast('이때의 기분평점을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcFeelRating25 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput14) {
			if (this.dtPg.countUcInput14 < 4)
			{
				this.util.toast('보기의 순서를 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput14 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput16) {
			if (this.dtPg.sumUcInput16 == 0)
			{
				this.util.toast('보기의 퍼센트를 입력하세요.');
				return false;
			} else if (this.dtPg.isUcInput16 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput24) {
			if (this.dtPg.resultUcInput24 == -1) {
				this.util.toast('보기의 답을 선택하세요.');
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

		if (this.item.ht_userdata == this.dtPg.sceneUcFeelRating10) {
			this.showUcFeelRating10();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcFeelRating25) {
			this.showUcFeelRating25();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput14) {
			this.showUcInput14();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcData15) {
			this.showUcData15();
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

		if (this.item.ht_userdata == this.dtPg.sceneUcData18) {
			this.isPieChart1Passed = true;

			this.showUcData18();

			this.chartTimer = setTimeout(() => {
				this.drawPieChart1();
			}, 500);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcData19) {
			this.isPieChart2Passed = true;

			this.showUcData19();

			this.chartTimer = setTimeout(() => {
				this.drawPieChart2();
			}, 500);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcData20) {
			this.isPieChart3Passed = true;

			this.showUcData20();

			this.chartTimer = setTimeout(() => {
				this.drawPieChart3();
			}, 500);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcData21) {
			this.isPieChart4Passed = true;

			this.showUcData21();

			this.chartTimer = setTimeout(() => {
				this.drawPieChart4();
			}, 500);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcData22) {
			this.isPieChart5Passed = true;

			this.showUcData22();

			this.chartTimer = setTimeout(() => {
				this.drawPieChart5();
			}, 500);
		} else if (this.item.ht_userdata == this.dtPg.sceneUcData23) {
			this.isPieChart6Passed = true;

			this.showUcData23();

			this.chartTimer = setTimeout(() => {
				this.drawPieChart6();
			}, 500);
		}

		this.soundTimer = setTimeout(() => {
			this.playSound(this.item.ht_base_audio, this.item.ht_pcode, this.item.ht_audio);
		}, 500);
	}

	showUcFeelRating10()
	{
		console.log('showUcFeelRating10()');
		return;
	}

	showUcFeelRating25()
	{
		console.log('showUcFeelRating25()');
		return;
	}

	showUcInput14()
	{
		console.log('showUcInput14()');
		return;
	}

	showUcData15()
	{
		console.log('showUcData15()');

		var i = 1;

		for (i = 1; i < 10; i++) {
			if (this.dtPg.resultUcInput14[i] == true) {
				this.dtPg.resultUcData15[1] = i;
				break;
			}
		}

		for (i = 1; i < 10; i++) {
			if (this.dtPg.resultUcInput14[i] == true && this.dtPg.resultUcData15[1] != i) {
				this.dtPg.resultUcData15[2] = i;
				break;
			}
		}

		for (i = 1; i < 10; i++) {
			if (this.dtPg.resultUcInput14[i] == true && this.dtPg.resultUcData15[1] != i && this.dtPg.resultUcData15[2] != i) {
				this.dtPg.resultUcData15[3] = i;
				break;
			}
		}

		for (i = 1; i < 10; i++) {
			if (this.dtPg.resultUcInput14[i] == true && this.dtPg.resultUcData15[1] != i && this.dtPg.resultUcData15[2] != i && this.dtPg.resultUcData15[3] != i) {
				this.dtPg.resultUcData15[4] = i;
				break;
			}
		}

		return;
	}

	changeUp(num) {
		console.log('changeUp()');

		if (this.dtPg.sumUcInput16 < 100 && this.dtPg.resultUcInput16[num] < 100)
		{
			this.dtPg.resultUcInput16[num] += 5;

			this.dtPg.sumUcInput16 = this.dtPg.resultUcInput16[1];
			this.dtPg.sumUcInput16 += this.dtPg.resultUcInput16[2];
			this.dtPg.sumUcInput16 += this.dtPg.resultUcInput16[3];
			this.dtPg.sumUcInput16 += this.dtPg.resultUcInput16[4];

		} else {
			this.util.toast('합계가 100을 넘을 수 없습니다.');
		}

		return;
	}

	changeDown(num) {
		console.log('changeDown()');

		if (this.dtPg.sumUcInput16 >= 5 && this.dtPg.resultUcInput16[num] >= 5)
		{
			this.dtPg.resultUcInput16[num] -= 5;

			this.dtPg.sumUcInput16 = this.dtPg.resultUcInput16[1];
			this.dtPg.sumUcInput16 += this.dtPg.resultUcInput16[2];
			this.dtPg.sumUcInput16 += this.dtPg.resultUcInput16[3];
			this.dtPg.sumUcInput16 += this.dtPg.resultUcInput16[4];

		} else {
			this.util.toast('합계가 0 이상이어야 합니다.');
		}

		return;
	}

	showUcData18()
	{
		console.log('showUcData18()');

		return;
	}

	showUcData19()
	{
		console.log('showUcData19()');

		return;
	}

	showUcData20()
	{
		console.log('showUcData20()');

		return;
	}

	showUcData21()
	{
		console.log('showUcData21()');

		return;
	}

	showUcData22()
	{
		console.log('showUcData22()');

		return;
	}

	showUcData23()
	{
		console.log('showUcData23()');

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

	sendUcFeelRating10()
	{
		console.log("sendUcFeelRating10", this.dtPg.resultUcFeelRating10);

		if (this.dtPg.resultUcFeelRating10 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating10 = true;
			return;		
		}
	}

	sendUcFeelRating25()
	{
		console.log("sendUcFeelRating25", this.dtPg.resultUcFeelRating25);

		if (this.dtPg.resultUcFeelRating25 == -1)
		{
			this.util.toast('이때의 기분평점을 선택하세요.');
			return;
		} else {
			this.util.toast('기분평점을 평가하셨습니다.');
			this.dtPg.isUcFeelRating25 = true;
			return;		
		}
	}

	checkUcInput14(val)
	{
		this.dtPg.countUcInput14 = 0;

		if (this.dtPg.resultUcInput14[1])
			this.dtPg.countUcInput14 += 1;
		if (this.dtPg.resultUcInput14[2])
			this.dtPg.countUcInput14 += 1;
		if (this.dtPg.resultUcInput14[3])
			this.dtPg.countUcInput14 += 1;
		if (this.dtPg.resultUcInput14[4])
			this.dtPg.countUcInput14 += 1;
		if (this.dtPg.resultUcInput14[5])
			this.dtPg.countUcInput14 += 1;
		if (this.dtPg.resultUcInput14[6])
			this.dtPg.countUcInput14 += 1;
		if (this.dtPg.resultUcInput14[7])
			this.dtPg.countUcInput14 += 1;
		if (this.dtPg.resultUcInput14[8])
			this.dtPg.countUcInput14 += 1;
		if (this.dtPg.resultUcInput14[9])
			this.dtPg.countUcInput14 += 1;

		if (this.dtPg.countUcInput14 > 4) {
			this.util.alert('4개를 초과할 수 없습니다.');
			val.checked = false;
		}

		return;
	}

	sendUcInput14()
	{
		console.log('sendUcInput14()');

		if (this.dtPg.countUcInput14 != 4)
		{
			this.util.toast('보기의 항목을 4개 선택하세요.');
			return;
		} else {
			this.dtPg.isUcInput14 = true;
			return;
		}
	}

	sendUcInput16()
	{
		console.log('sendUcInput16()');

		if (this.dtPg.sumUcInput16 == 0)
		{
			this.util.toast('보기의 퍼센트를 입력하세요.');
			return;
		} else {
			this.dtPg.isUcInput16 = true;
			return;
		}
	}

	sendUcInput24()
	{
		console.log('sendUcInput24()');

		if (this.dtPg.resultUcInput24 == -1)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput24 == this.dtPg.passUcInput24)
		{
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput24 = true;
		} else {

			this.dtPg.countUcInput24--;

			if (this.dtPg.countUcInput24 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput24 = true;
				this.dtPg.resultUcInput24 = this.dtPg.passUcInput24;
			}

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

	drawPieChart1()
	{
		console.log('drawPieChart1()');

		this.objPieChart1 = new Chart(this.pieCanvas.nativeElement, {
			type: 'pie',
			data: {
				labels: ['1. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[1]] + ' (' + String(this.dtPg.resultUcInput16[1]) + '%)',
						''],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput16[1], (100 - this.dtPg.resultUcInput16[1])],
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

		if (this.item.ht_tpcode == 'hcst018') {
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
				labels: ['1. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[1]] + ' (' + String(this.dtPg.resultUcInput16[1]) + '%)',
						'2. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[2]] + ' (' + String(this.dtPg.resultUcInput16[2]) + '%)',
						''],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput16[1],
						this.dtPg.resultUcInput16[2],
						(100 - this.dtPg.resultUcInput16[1] - this.dtPg.resultUcInput16[2])],
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

		if (this.item.ht_tpcode == 'hcst019') {
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
				labels: ['1. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[1]] + ' (' + String(this.dtPg.resultUcInput16[1]) + '%)',
					'2. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[2]] + ' (' + String(this.dtPg.resultUcInput16[2]) + '%)',
					'3. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[3]] + ' (' + String(this.dtPg.resultUcInput16[3]) + '%)',
					''],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput16[1],
						this.dtPg.resultUcInput16[2],
						this.dtPg.resultUcInput16[3],
						(100 - this.dtPg.resultUcInput16[1] - this.dtPg.resultUcInput16[2] - this.dtPg.resultUcInput16[3])],
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

		if (this.item.ht_tpcode == 'hcst020') {
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
				labels: ['1. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[1]] + ' (' + String(this.dtPg.resultUcInput16[1]) + '%)',
					'2. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[2]] + ' (' + String(this.dtPg.resultUcInput16[2]) + '%)',
					'3. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[3]] + ' (' + String(this.dtPg.resultUcInput16[3]) + '%)',
					'4. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[4]] + ' (' + String(this.dtPg.resultUcInput16[4]) + '%)',
					''],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput16[1],
						this.dtPg.resultUcInput16[2],
						this.dtPg.resultUcInput16[3],
						this.dtPg.resultUcInput16[4],
						(100 - this.dtPg.sumUcInput16)],
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

		if (this.item.ht_tpcode == 'hcst021') {
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
				labels: ['1. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[1]] + ' (' + String(this.dtPg.resultUcInput16[1]) + '%)',
					'2. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[2]] + ' (' + String(this.dtPg.resultUcInput16[2]) + '%)',
					'3. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[3]] + ' (' + String(this.dtPg.resultUcInput16[3]) + '%)',
					'4. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[4]] + ' (' + String(this.dtPg.resultUcInput16[4]) + '%)',
					'5. 직장' + ' (' + String(100 - this.dtPg.sumUcInput16) + '%)'],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput16[1],
						this.dtPg.resultUcInput16[2],
						this.dtPg.resultUcInput16[3],
						this.dtPg.resultUcInput16[4],
						(100 - this.dtPg.sumUcInput16)],
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

		if (this.item.ht_tpcode == 'hcst022') {
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
				labels: ['1. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[1]] + ' (' + String(this.dtPg.resultUcInput16[1]) + '%)',
					'2. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[2]] + ' (' + String(this.dtPg.resultUcInput16[2]) + '%)',
					'3. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[3]] + ' (' + String(this.dtPg.resultUcInput16[3]) + '%)',
					'4. ' + this.dtPg.textUcData[this.dtPg.resultUcData15[4]] + ' (' + String(this.dtPg.resultUcInput16[4]) + '%)',
					'5. 직장' + ' (' + String(100 - this.dtPg.sumUcInput16) + '%)'],
				datasets: [{
					label: '파이차트',
					data: [this.dtPg.resultUcInput16[1],
						this.dtPg.resultUcInput16[2],
						this.dtPg.resultUcInput16[3],
						this.dtPg.resultUcInput16[4],
						(100 - this.dtPg.sumUcInput16)],
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

		if (this.item.ht_tpcode == 'hcst023') {
			setTimeout(() => {
				this.isPieChart6Passed = false;
			}, 500);
		}
	}
}
