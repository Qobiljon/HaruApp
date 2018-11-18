import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ViewController, NavParams, Events, Platform, IonicPage } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Media, MediaObject } from '@ionic-native/media';
import { StatusBar } from '@ionic-native/status-bar';
import { StorageProvider } from '../../../providers/storage/storage';
import { UtilProvider } from '../../../providers/util/util';
import { ApiProvider } from '../../../providers/api/api';
import { Chart } from 'chart.js';
import { TimerComponent } from '../../../components/timer/timer';
import { Ht3PgConfig } from '../config/pg.config';
import { Ht3Pg20Data } from './ht3_pg20.data';

@IonicPage()
@Component({
  selector: 'ht3-page-pg20',
  templateUrl: 'ht3_pg20.html',
})
export class Ht3Pg20Page {

	/* Common */
	pgConfig = new Ht3PgConfig(20);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;
	@ViewChild(TimerComponent) timer: TimerComponent;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg = new Ht3Pg20Data();

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
		console.log('ionViewDidLoad Pg20Page');
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

		let dtPgData = new Ht3Pg20Data();
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

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput11) {
			if (this.dtPg.resultUcInput11[1] == false &&
				this.dtPg.resultUcInput11[2] == false &&
				this.dtPg.resultUcInput11[3] == false &&
				this.dtPg.resultUcInput11[4] == false &&
				this.dtPg.resultUcInput11[5] == false &&
				this.dtPg.resultUcInput11[6] == false)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput11 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput18) {
			if (this.dtPg.resultUcInput18[1] == false &&
				this.dtPg.resultUcInput18[2] == false &&
				this.dtPg.resultUcInput18[3] == false &&
				this.dtPg.resultUcInput18[4] == false &&
				this.dtPg.resultUcInput18[5] == false &&
				this.dtPg.resultUcInput18[6] == false)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput18 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput39) {
			if (this.dtPg.resultUcInput39 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput39 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput40) {
			if (this.dtPg.resultUcInput40 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput40 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput41) {
			if (this.dtPg.resultUcInput41 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput41 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput42) {
			if (this.dtPg.resultUcInput42 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput42 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput43) {
			if (this.dtPg.resultUcInput43 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput43 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput52) {
			if (this.dtPg.resultUcInput52 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput52 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput61) {
			if (this.dtPg.resultUcInput61 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput61 == false) {
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

		if (this.item.ht_userdata == this.dtPg.sceneUcInput11) {
			this.showUcInput11();
		}

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

	showUcInput11()
	{
		console.log('showUcInput11()');

		let count1 = 0;
		if (this.dtPg.resultUcInput11[1] == true)
			count1++;
		if (this.dtPg.resultUcInput11[2] == true)
			count1++;
		if (this.dtPg.resultUcInput11[5] == true)
			count1++;

		let count2 = 0;
		if (this.dtPg.resultUcInput11[3] == true)
			count2++;
		if (this.dtPg.resultUcInput11[4] == true)
			count2++;
		if (this.dtPg.resultUcInput11[6] == true)
			count2++;

		if (count1 > count2)
			this.dtPg.selectUcInput11 = 1;
		else if (count1 < count2)
			this.dtPg.selectUcInput11 = 2;
		else
			this.dtPg.selectUcInput11 = 3;

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

	sendUcInput11()
	{
		console.log('sendUcInput11()');

		if (this.dtPg.resultUcInput11[1] == false &&
			this.dtPg.resultUcInput11[2] == false &&
			this.dtPg.resultUcInput11[3] == false &&
			this.dtPg.resultUcInput11[4] == false &&
			this.dtPg.resultUcInput11[5] == false &&
			this.dtPg.resultUcInput11[6] == false)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {

			let count1 = 0;
			if (this.dtPg.resultUcInput11[1] == true)
				count1++;
			if (this.dtPg.resultUcInput11[2] == true)
				count1++;
			if (this.dtPg.resultUcInput11[5] == true)
				count1++;

			let count2 = 0;
			if (this.dtPg.resultUcInput11[3] == true)
				count2++;
			if (this.dtPg.resultUcInput11[4] == true)
				count2++;
			if (this.dtPg.resultUcInput11[6] == true)
				count2++;

			if (count1 > count2)
				this.dtPg.selectUcInput11 = 1;
			else if (count1 < count2)
				this.dtPg.selectUcInput11 = 2;
			else
				this.dtPg.selectUcInput11 = 3;

			this.util.alert('해당 항목을 선택하셨습니다.');
			this.dtPg.isUcInput11 = true;
			return;
		}
	}

	sendUcInput18()
	{
		console.log('sendUcInput18()');

		if (this.dtPg.resultUcInput18[1] == false &&
			this.dtPg.resultUcInput18[2] == false &&
			this.dtPg.resultUcInput18[3] == false &&
			this.dtPg.resultUcInput18[4] == false &&
			this.dtPg.resultUcInput18[5] == false &&
			this.dtPg.resultUcInput18[6] == false)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput18[1] == this.dtPg.passUcInput18[1] &&
			this.dtPg.resultUcInput18[2] == this.dtPg.passUcInput18[2] &&
			this.dtPg.resultUcInput18[3] == this.dtPg.passUcInput18[3] &&
			this.dtPg.resultUcInput18[4] == this.dtPg.passUcInput18[4] &&
			this.dtPg.resultUcInput18[5] == this.dtPg.passUcInput18[5] &&
			this.dtPg.resultUcInput18[6] == this.dtPg.passUcInput18[6] )
		{
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput18 = true;
			return;
		} else {
			this.dtPg.countUcInput18--;

			if (this.dtPg.countUcInput18 >= 0) {
				this.util.alert('정답은 2개입니다. 다시 한 번 생각해보세요.');
			} else {
				this.util.alert('응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput18 = true;
				this.dtPg.resultUcInput18 = this.dtPg.passUcInput18;
			}

			return;
		}
	}

	sendUcInput39()
	{
		console.log("sendUcInput39");

		if (this.dtPg.resultUcInput39 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.dtPg.isUcInput39 = true;
			return;
		}
	}

	sendUcInput40()
	{
		console.log("sendUcInput40");

		if (this.dtPg.resultUcInput40 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.dtPg.isUcInput40 = true;
			return;
		}
	}

	sendUcInput41()
	{
		console.log("sendUcInput41");

		if (this.dtPg.resultUcInput41 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.dtPg.isUcInput41 = true;
			return;
		}
	}

	sendUcInput42()
	{
		console.log("sendUcInput42");

		if (this.dtPg.resultUcInput42 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.dtPg.isUcInput42 = true;
			return;
		}
	}

	sendUcInput43()
	{
		console.log("sendUcInput43");

		if (this.dtPg.resultUcInput43 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.dtPg.isUcInput43 = true;
			return;
		}
	}

	sendUcInput49()
	{
		console.log("sendUcInput49");

		setTimeout(() => {
			this.timer.startTimer();
		}, 1000)

		return;
	}

	sendUcInput52()
	{
		console.log("sendUcInput52");

		if (this.dtPg.resultUcInput52 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.dtPg.isUcInput52 = true;
			return;
		}
	}

	sendUcInput61()
	{
		console.log("sendUcInput61");

		if (this.dtPg.resultUcInput61 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.dtPg.isUcInput61 = true;
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
