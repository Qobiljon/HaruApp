import { Component, ViewChild } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Content, NavController, ViewController, NavParams, Events, Platform, IonicPage } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Media, MediaObject } from '@ionic-native/media';
import { StatusBar } from '@ionic-native/status-bar';
import { StorageProvider } from '../../../providers/storage/storage';
import { UtilProvider } from '../../../providers/util/util';
import { ApiProvider } from '../../../providers/api/api';
import { Chart } from 'chart.js';
import { Ht1PgConfig } from '../config/pg.config';
import { Ht1Pg38Data } from './ht1_pg38.data';
import { Ht1Pg27Data } from '../pg27/ht1_pg27.data';

@IonicPage()
@Component({
  selector: 'ht1-page-pg38',
  templateUrl: 'ht1_pg38.html',
})
export class Ht1Pg38Page {

	/* Common */
	pgConfig = new Ht1PgConfig(38);
	end_zone_num = 4;

	@ViewChild(Content) content: Content;
	@ViewChild('lineCanvas') lineCanvas;

	itemTarget: any;
	item: any;

	file: MediaObject;
	soundTimer: any;
	chartTimer: any;
	
	/* User Custom */
	dtPg1st = new Ht1Pg27Data();
	dtPg = new Ht1Pg38Data();

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
		public media: Media,
		public alertCtrl: AlertController
	){
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Pg38Page');
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

		let dtPg1st = new Ht1Pg27Data();
		dtPg1st = this.storage.getObject('dtPg27');

		if (typeof dtPg1st !== 'undefined' && dtPg1st != null)
		{
			this.dtPg1st = dtPg1st;
		}

		let dtPgData = new Ht1Pg38Data();
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
 
		if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput7) {
			if (this.dtPg.resultUcInput7[1] == -1 ||
				this.dtPg.resultUcInput7[2] == -1 ||
				this.dtPg.resultUcInput7[3] == -1 ||
				this.dtPg.resultUcInput7[4] == -1)
			{
				this.util.toast('보기의 항목의 점수를 모두 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput7 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput13) {
			if (this.dtPg.resultUcInput13 == -1) {
				this.util.toast('보기의 답을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput13 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput19) {
			if (this.dtPg.resultUcInput19 == -1) {
				this.util.toast('보기의 답을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput19 == false) {
				this.util.alert('제출하기 버튼을 선택하세요.');
				return false;
			}
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput25) {
			if (this.dtPg.resultUcInput25 == -1) {
				this.util.toast('보기의 답을 선택하세요.');
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
		} else if (this.pgConfig.sceneNumber == this.dtPg.sceneUcInput34) {
			if (this.dtPg.resultUcInput34[1] == false &&
				this.dtPg.resultUcInput34[2] == false &&
				this.dtPg.resultUcInput34[3] == false &&
				this.dtPg.resultUcInput34[4] == false )
			{
				this.util.toast('보기의 답을 선택하세요.');
				return false;
			} else if (this.dtPg.isUcInput34 == false) {
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

		if (this.item.ht_userdata == this.dtPg.sceneUcInput7) {
			this.showUcInput7();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput13) {
			this.showUcInput13();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput19) {
			this.showUcInput19();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput25) {
			this.showUcInput25();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput33) {
			this.showUcInput33();
		} else if (this.item.ht_userdata == this.dtPg.sceneUcInput34) {
			this.showUcInput34();
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

	showUcInput7()
	{
		console.log('showUcInput7()');
		return;
	}

	showUcInput13()
	{
		console.log('showUcInput13()');
		return;
	}

	showUcInput19()
	{
		console.log('showUcInput19()');
		return;
	}

	showUcInput25()
	{
		console.log('showUcInput25()');
		return;
	}

	showUcInput33()
	{
		console.log('showUcInput33()');
		return;
	}

	showUcInput34()
	{
		console.log('showUcInput34()');
		return;
	}

	selectUcInput7(num) {

		let title = '잘못된 자동적 사고의 유형';

		let alert = this.alertCtrl.create();
		alert.setTitle(title);

		alert.addInput({
			type: 'radio',
			label: this.dtPg.textUcInput[1],
			value: '1',
			checked: false
		});

		alert.addInput({
			type: 'radio',
			label: this.dtPg.textUcInput[2],
			value: '2',
			checked: false
		});

		alert.addInput({
			type: 'radio',
			label: this.dtPg.textUcInput[3],
			value: '3',
			checked: false
		});

		alert.addInput({
			type: 'radio',
			label: this.dtPg.textUcInput[4],
			value: '4',
			checked: false
		});

		alert.addButton('취소');

		alert.addButton({
			text: '선택',
			handler: data => {
				this.dtPg.resultUcInput7[num] = Number(data);
			}
		});

		alert.present();
	}

	sendUcInput7()
	{
		console.log('sendUcInput7()');

		if (this.dtPg.resultUcInput7[1] == -1 ||
			this.dtPg.resultUcInput7[2] == -1 ||
			this.dtPg.resultUcInput7[3] == -1 ||
			this.dtPg.resultUcInput7[4] == -1)
		{
			this.util.toast('보기의 항목을 모두 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput7[1] == this.dtPg.passUcInput7[1] &&
			this.dtPg.resultUcInput7[2] == this.dtPg.passUcInput7[2] &&
			this.dtPg.resultUcInput7[3] == this.dtPg.passUcInput7[3] &&
			this.dtPg.resultUcInput7[4] == this.dtPg.passUcInput7[4])
		{
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput7 = true;
		} else {

			this.dtPg.countUcInput7--;

			if (this.dtPg.countUcInput7 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput7 = true;
				this.dtPg.resultUcInput7 = this.dtPg.passUcInput7;
			}

			return;
		}
	}

	sendUcInput13()
	{
		console.log('sendUcInput13()');

		if (this.dtPg.resultUcInput13 == -1)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput13 == this.dtPg.passUcInput13)
		{
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput13 = true;
		} else {

			this.dtPg.countUcInput13--;

			if (this.dtPg.countUcInput13 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput13 = true;
				this.dtPg.resultUcInput13 = this.dtPg.passUcInput13;
			}

			return;
		}
	}

	sendUcInput19()
	{
		console.log('sendUcInput19()');

		if (this.dtPg.resultUcInput19 == -1)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput19 == this.dtPg.passUcInput19)
		{
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput19 = true;
		} else {

			this.dtPg.countUcInput19--;

			if (this.dtPg.countUcInput19 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput19 = true;
				this.dtPg.resultUcInput19 = this.dtPg.passUcInput19;
			}

			return;
		}
	}

	sendUcInput25()
	{
		console.log('sendUcInput25()');

		if (this.dtPg.resultUcInput25 == -1)
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput25 == this.dtPg.passUcInput25)
		{
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput25 = true;
		} else {

			this.dtPg.countUcInput25--;

			if (this.dtPg.countUcInput25 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput25 = true;
				this.dtPg.resultUcInput25 = this.dtPg.passUcInput25;
			}

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
		} else if (this.dtPg.resultUcInput33 == this.dtPg.passUcInput33)
		{
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput33 = true;
		} else {

			this.dtPg.countUcInput33--;

			if (this.dtPg.countUcInput33 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput33 = true;
				this.dtPg.resultUcInput33 = this.dtPg.passUcInput33;
			}

			return;
		}
	}

	sendUcInput34()
	{
		console.log('sendUcInput34()');

		if (this.dtPg.resultUcInput34[1] == false &&
			this.dtPg.resultUcInput34[2] == false &&
			this.dtPg.resultUcInput34[3] == false &&
			this.dtPg.resultUcInput34[4] == false )
		{
			this.util.toast('보기의 답을 선택하세요.');
			return;
		} else if (this.dtPg.resultUcInput34[1] == this.dtPg.passUcInput34[1] &&
			this.dtPg.resultUcInput34[2] == this.dtPg.passUcInput34[2] &&
			this.dtPg.resultUcInput34[3] == this.dtPg.passUcInput34[3] &&
			this.dtPg.resultUcInput34[4] == this.dtPg.passUcInput34[4] )
		{
			this.util.alert('잘 하셨습니다.');
			this.dtPg.isUcInput34 = true;
		} else {
			this.dtPg.countUcInput34--;

			if (this.dtPg.countUcInput34 >= 0) {
				this.util.alert('다시 한 번 생각해보세요.');
			} else {
				this.util.alert('다시 한 번 생각해보세요. 응답 횟수를 초과하였습니다.');
				this.dtPg.isUcInput34 = true;
				this.dtPg.resultUcInput34 = this.dtPg.passUcInput34;
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

		let requestData = {"mode": "harutoday_read", "id": userInfo.id, "key": userInfo.key, "code": this.itemTarget.mcode, "num": this.itemTarget.pnum, "quizpoint": this.pgConfig.pointQuiz, "zone_num": this.end_zone_num};

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
