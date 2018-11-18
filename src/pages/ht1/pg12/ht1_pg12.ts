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
import { Ht1Pg12Data } from './ht1_pg12.data';
import { Ht1Pg10Data } from '../pg10/ht1_pg10.data';

@IonicPage()
@Component({
  selector: 'ht1-page-pg12',
  templateUrl: 'ht1_pg12.html',
})
export class Ht1Pg12Page {

	/* Common */
	pgConfig = new Ht1PgConfig(12);

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg1st = new Ht1Pg10Data();
	dtPg = new Ht1Pg12Data();

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
		console.log('ionViewDidLoad Pg12Page');
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

		let dtPg1st = new Ht1Pg10Data();
		dtPg1st = this.storage.getObject('dtPg10');

		if (typeof dtPg1st !== 'undefined' && dtPg1st != null)
		{
			this.dtPg1st = dtPg1st;
		}

		let dtPgData = new Ht1Pg12Data();
		dtPgData = this.storage.getObject('dtPg12');

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

		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput6) {
			if (this.dtPg.resultUcInput6 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput6 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput9) {
			if (this.dtPg.resultUcInput9 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput9 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput11) {
			if (this.dtPg.resultUcInput11 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput11 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput14) {
			if (this.dtPg.resultUcInput14 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput14 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput17) {
			if (this.dtPg.resultUcInput17 == -1)
			{
				this.util.toast('보기의 항목을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput17 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput20) {
			let count = 0;
			if (this.dtPg.resultUcInput20[1] == true)
				count++;
			if (this.dtPg.resultUcInput20[2] == true)
				count++;
			if (this.dtPg.resultUcInput20[3] == true)
				count++;
			if (this.dtPg.resultUcInput20[4] == true)
				count++;
			if (this.dtPg.resultUcInput20[5] == true)
				count++;
			if (this.dtPg.resultUcInput20[6] == true)
				count++;
			if (this.dtPg.resultUcInput20[7] == true)
				count++;

			if (this.dtPg.resultUcInput14 != count)
			{
				this.util.toast('보기의 항목을 ' + String(this.dtPg.resultUcInput14) + '개 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput20 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcAlarm21) {
			if (this.dtPg.isUcAlarm21 == false) {
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
				this.dtPg.resultUcQuiz2[3] == false)
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

		if (this.item.ht_userdata == this.dtPg.sceneUcData5) {
			this.showUcData5();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput6) {
			this.showUcInput6();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput9) {
			this.showUcInput9();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput11) {
			this.showUcInput11();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput14) {
			this.showUcInput14();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput17) {
			this.showUcInput17();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput20) {
			this.showUcInput20();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcAlarm21) {
			this.showUcAlarm21();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput25) {
			this.showUcInput25();
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

	showUcData5()
	{
		console.log('showUcData5()');

		return;
	}

	showUcInput6()
	{
		console.log('showUcInput6()');

		return;
	}

	showUcInput9()
	{
		console.log('showUcInput9()');

		return;
	}

	showUcInput11()
	{
		console.log('showUcInput11()');

		return;
	}

	showUcInput14()
	{
		console.log('showUcInput14()');

		return;
	}

	showUcInput17()
	{
		console.log('showUcInput17()');

		return;
	}

	showUcInput20()
	{
		console.log('showUcInput20()');

		return;
	}

	showUcAlarm21()
	{
		console.log('showUcAlarm21()');
		return;
	}

	showUcInput25()
	{
		console.log('showUcInput25()');

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

	sendUcInput6()
	{
		console.log('sendUcInput6()');

		if (this.dtPg.resultUcInput6 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 항목을 선택하셨습니다.');
			this.dtPg.isUcInput6 = true;
			return;
		}
	}

	sendUcInput9()
	{
		console.log('sendUcInput9()');

		if (this.dtPg.resultUcInput9 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 항목을 선택하셨습니다.');
			this.dtPg.isUcInput9 = true;
			return;
		}
	}

	sendUcInput11()
	{
		console.log('sendUcInput11()');

		if (this.dtPg.resultUcInput11 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 항목을 선택하셨습니다.');
			this.dtPg.isUcInput11 = true;
			return;
		}
	}

	sendUcInput14()
	{
		console.log('sendUcInput14()');

		if (this.dtPg.resultUcInput14 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 항목을 선택하셨습니다.');
			this.dtPg.isUcInput14 = true;
			return;
		}
	}

	sendUcInput17()
	{
		console.log('sendUcInput17()');

		if (this.dtPg.resultUcInput17 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 항목을 선택하셨습니다.');
			this.dtPg.isUcInput17 = true;
			return;
		}
	}

	checkUcInput20(val)
	{
		let count = 0;

		if (this.dtPg.resultUcInput20[1])
			count += 1;
		if (this.dtPg.resultUcInput20[2])
			count += 1;
		if (this.dtPg.resultUcInput20[3])
			count += 1;
		if (this.dtPg.resultUcInput20[4])
			count += 1;
		if (this.dtPg.resultUcInput20[5])
			count += 1;
		if (this.dtPg.resultUcInput20[6])
			count += 1;
		if (this.dtPg.resultUcInput20[7])
			count += 1;

		if (count > this.dtPg.resultUcInput14) {
			this.util.alert(String(this.dtPg.resultUcInput14) + '개를 초과할 수 없습니다.');
			val.checked = false;
		}

		return;
	}

	sendUcInput20()
	{
		console.log('sendUcInput20()');

		let count = 0;
		if (this.dtPg.resultUcInput20[1] == true)
			count++;
		if (this.dtPg.resultUcInput20[2] == true)
			count++;
		if (this.dtPg.resultUcInput20[3] == true)
			count++;
		if (this.dtPg.resultUcInput20[4] == true)
			count++;
		if (this.dtPg.resultUcInput20[5] == true)
			count++;
		if (this.dtPg.resultUcInput20[6] == true)
			count++;
		if (this.dtPg.resultUcInput20[7] == true)
			count++;

		if (this.dtPg.resultUcInput14 != count)
		{
			this.util.toast('보기의 항목을 ' + String(this.dtPg.resultUcInput14) + '개 선택하세요.');
			return false;
		} else {
			this.util.toast('보기의 항목을 선택하셨습니다.');
			this.dtPg.isUcInput20 = true;
			return;
		}
	}

	sendUcAlarm21()
	{
		console.log("sendUcAlarm21");

		if (this.dtPg.isUcAlarm21 == false) {
			this.util.toast('실행할 시간을 입력하셨습니다.');
			this.dtPg.isUcAlarm21 = true;

			if (this.dtPg.resultUcAlarm21.ampm == '오전' && this.dtPg.resultUcAlarm21.hour >= 10) {
				this.dtPg.resultUcAlarm21Prev.ampm = '오전';
				this.dtPg.resultUcAlarm21Prev.hour = this.dtPg.resultUcAlarm21.hour - 3;
				this.dtPg.resultUcAlarm21Prev.min = this.dtPg.resultUcAlarm21.min;

				this.dtPg.resultUcAlarm21Next.ampm = '오후';
				this.dtPg.resultUcAlarm21Next.hour = this.dtPg.resultUcAlarm21.hour - 9;
				this.dtPg.resultUcAlarm21Next.min = this.dtPg.resultUcAlarm21.min;
			} else if (this.dtPg.resultUcAlarm21.ampm == '오전' && this.dtPg.resultUcAlarm21.hour >= 4 && this.dtPg.resultUcAlarm21.hour < 10) {
				this.dtPg.resultUcAlarm21Prev.ampm = '오전';
				this.dtPg.resultUcAlarm21Prev.hour = this.dtPg.resultUcAlarm21.hour - 3;
				this.dtPg.resultUcAlarm21Prev.min = this.dtPg.resultUcAlarm21.min;

				this.dtPg.resultUcAlarm21Next.ampm = '오전';
				this.dtPg.resultUcAlarm21Next.hour = this.dtPg.resultUcAlarm21.hour + 3;
				this.dtPg.resultUcAlarm21Next.min = this.dtPg.resultUcAlarm21.min;
			} else if (this.dtPg.resultUcAlarm21.ampm == '오전' && this.dtPg.resultUcAlarm21.hour >= 1 && this.dtPg.resultUcAlarm21.hour < 4) {
				this.dtPg.resultUcAlarm21Prev.ampm = '오후';
				this.dtPg.resultUcAlarm21Prev.hour = this.dtPg.resultUcAlarm21.hour + 9;
				this.dtPg.resultUcAlarm21Prev.min = this.dtPg.resultUcAlarm21.min;

				this.dtPg.resultUcAlarm21Next.ampm = '오전';
				this.dtPg.resultUcAlarm21Next.hour = this.dtPg.resultUcAlarm21.hour + 3;
				this.dtPg.resultUcAlarm21Next.min = this.dtPg.resultUcAlarm21.min;
			}

			console.log("dtPg.resultUcAlarm21Prev.ampm", this.dtPg.resultUcAlarm21Prev.ampm);
			console.log("dtPg.resultUcAlarm21Prev.hour", this.dtPg.resultUcAlarm21Prev.hour);
			console.log("dtPg.resultUcAlarm21Prev.min", this.dtPg.resultUcAlarm21Prev.min);

			console.log("dtPg.resultUcAlarm21.ampm", this.dtPg.resultUcAlarm21.ampm);
			console.log("dtPg.resultUcAlarm21.hour", this.dtPg.resultUcAlarm21.hour);
			console.log("dtPg.resultUcAlarm21.min", this.dtPg.resultUcAlarm21.min);

			console.log("dtPg.resultUcAlarm21Next.ampm", this.dtPg.resultUcAlarm21Next.ampm);
			console.log("dtPg.resultUcAlarm21Next.hour", this.dtPg.resultUcAlarm21Next.hour);
			console.log("dtPg.resultUcAlarm21Next.min", this.dtPg.resultUcAlarm21Next.min);

			return;
		}
	}

	sendUcInput25()
	{
		console.log('sendUcInput25()');

		if (this.dtPg.resultUcInput25 == -1)
		{
			this.util.toast('보기의 항목을 선택하세요.');
			return;
		} else {
			this.util.toast('보기의 항목을 선택하셨습니다.');
			this.dtPg.isUcInput25 = true;
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
			this.dtPg.resultUcQuiz2[3] == false)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcQuiz2[1] == this.dtPg.passUcQuiz2[1] &&
			this.dtPg.resultUcQuiz2[2] == this.dtPg.passUcQuiz2[2] &&
			this.dtPg.resultUcQuiz2[3] == this.dtPg.passUcQuiz2[3])
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
		if (this.dtPg.resultUcAlarm21.ampm == '오전') {
			this.dtPg.resultUcAlarm21.ampm = '오후';
		} else {
			this.dtPg.resultUcAlarm21.ampm = '오전';
		}
	}

	changeAmPmDown()
	{
		if (this.dtPg.resultUcAlarm21.ampm == '오전') {
			this.dtPg.resultUcAlarm21.ampm = '오후';
		} else {
			this.dtPg.resultUcAlarm21.ampm = '오전';
		}
	}

	changeHourUp()
	{
		if (this.dtPg.resultUcAlarm21.hour == 12) {
			this.dtPg.resultUcAlarm21.hour = 1;
		} else {
			this.dtPg.resultUcAlarm21.hour += 1;
		}
	}

	changeHourDown()
	{
		if (this.dtPg.resultUcAlarm21.hour == 1) {
			this.dtPg.resultUcAlarm21.hour = 12;
		} else {
			this.dtPg.resultUcAlarm21.hour -= 1;
		}
	}

	changeMinUp()
	{
		if (this.dtPg.resultUcAlarm21.min == 55) {
			this.dtPg.resultUcAlarm21.min = 0;
		} else {
			this.dtPg.resultUcAlarm21.min += 5;
		}
	}

	changeMinDown()
	{
		if (this.dtPg.resultUcAlarm21.min == 0) {
			this.dtPg.resultUcAlarm21.min = 55;
		} else {
			this.dtPg.resultUcAlarm21.min -= 5;
		}
	}

	ngAfterViewInit(){
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
