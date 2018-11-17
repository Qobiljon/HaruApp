import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { UtilProvider } from '../../../providers/ht2/util/util';
import { StorageProvider } from '../../../providers/ht2/storage/storage';
import { ApiProvider } from '../../../providers/ht2/api/api';
import { LocalNotificationsProvider } from '../../../providers/ht2/local-notifications/local-notifications';

@IonicPage()
@Component({
  selector: 'ht2-page-login',
  templateUrl: 'ht2_login.html',
})
export class Ht2LoginPage {

	@Input() data: any;
	@Input() events: any;

	userInfo:any;
	public member_id: string;
	public member_pw: string;
	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public platform: Platform,
		public util: UtilProvider,
		public storage: StorageProvider,
		public api: ApiProvider,
		public localNotifications: LocalNotificationsProvider,
		public alertCtrl: AlertController)
	{
		let pageName: string = navParams.get("pageName");

		if (pageName == 'logout')
		{
            // 로컬 알림 설정 삭제
            this.localNotifications.cancelAll();

            storage.setLogout();
		}
	}

	onEvent = (event: string): void => {
		if (this.events[event]) {
			this.events[event]({
				'member_id' : this.member_id,
				'member_pw' : this.member_pw
			});
		}

		console.log(event);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	sendLogin(member_id, member_pw) {

		let requestData = {"mode": "login", "member_id": member_id, "member_pw": member_pw, "app_name": this.util.getAppName(), "app_os": this.util.getAppOS(), "app_version": this.util.getAppVersion()};

		this.api.postData('login', requestData).then((data) => {

			let responseData:any = data;

			if (responseData.mode == 'login' && responseData.code == 'ok') {
				this.storage.setLogin(responseData.result);
				this.navCtrl.setRoot('TabsPage');
			} else {
				this.util.toast('로그인 아이디와 비밀번호 입력값이 올바르지 않습니다.', 1000, 'middle');
			}
		}, (err) => {
			// Error log
			console.log('error login');
		});
	}

	openUrl(url) {
		this.util.openUrl(url);
	}
}
