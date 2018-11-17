import { Http } from '@angular/http';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import 'rxjs/add/operator/map';
 
@Injectable()
export class UtilProvider {

	appName:string = 'harutoday';
	appVersionNumber:string = '1.2.1';
	appOS:string = 'android';

	constructor(public appVersion: AppVersion,
				public http: Http,
				public platform: Platform,
				public alertCtrl: AlertController,
				public toastCtrl: ToastController,
				public theInAppBrowser: InAppBrowser)
	{
		appVersion.getVersionNumber().then(ver => {
			this.appVersionNumber = ver;
		}).catch(function(error) {
			console.log(error);
		});

		if (this.platform.is('ios')) {
			this.appOS = 'ios';
		} else if (this.platform.is('android')) {
			this.appOS = 'android';
		}
	}

	getAppName()
	{
		return this.appName;
	}

	getAppVersion()
	{
		return this.appVersionNumber;
	}

	getAppOS()
	{
		return this.appOS;
	}

	alert(message) {
		let alert = this.alertCtrl.create();
		alert.setTitle('오늘하루');
		alert.setMessage(message);

		// alert.addButton('취소');

		alert.addButton({
			text: '확인',
			handler: () => {
				alert.dismiss();

				return false;
			}
		});

		alert.present();
	}

	closePopAlert(message, nav) {
		let alert = this.alertCtrl.create();
		alert.setTitle('오늘하루');
		alert.setMessage(message);

		// alert.addButton('취소');

		alert.addButton({
			text: '확인',
			handler: () => {
			
				nav.pop();
				alert.dismiss();

				return false;
			}
		});

		alert.present();
	}

	toast(message, delay=1000, postion='middle') {
		let toast = this.toastCtrl.create({
			message:  message,
			duration: delay,
			position: postion
		});
		toast.present();
	}

	openUrl(url) {
		const options : InAppBrowserOptions = {
			location : 'yes',//Or 'no' 
			hidden : 'no', //Or  'yes'
			clearcache : 'yes',
			clearsessioncache : 'yes',
			zoom : 'yes',//Android only ,shows browser zoom controls 
			hardwareback : 'yes',
			mediaPlaybackRequiresUserAction : 'no',
			shouldPauseOnSuspend : 'no', //Android only 
			closebuttoncaption : 'Close', //iOS only
			disallowoverscroll : 'no', //iOS only 
			toolbar : 'yes', //iOS only 
			enableViewportScale : 'no', //iOS only 
			allowInlineMediaPlayback : 'no',//iOS only 
			presentationstyle : 'pagesheet',//iOS only 
			fullscreen : 'yes',//Windows only    
		};

		this.platform.ready().then(() => {
			let target = "_system";
			this.theInAppBrowser.create(url, target, options);
		});
	}

	getMediaPath(s) {
		if (this.platform.is('android')) return "/android_asset/www/" + s;
		return s;
	}
}
