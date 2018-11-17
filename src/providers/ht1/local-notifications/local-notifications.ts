import {Injectable} from '@angular/core';
import { Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { StorageProvider } from '../storage/storage';

@Injectable()
export class LocalNotificationsProvider {

	notifyTime: any;
	notifications: any[] = [];
	days: any[];

	chosenHours:number = 0;
	chosenMinutes:number = 0;
	chosenSeconds:number = 0;

	alarmUse:boolean;
	alarmMode:string;
	alarmHour:string;
	alarmMin:string;

	constructor(public platform: Platform, public localNotifications: LocalNotifications, public storage: StorageProvider)
	{
		console.log('Hello LocalNotifications Provider');

		// this.notifyTime = moment().locale('ko').format('a hh:mm');

		let alarmInfo = storage.getAlarmInfo();

		if (alarmInfo != null)
		{
			this.alarmUse = alarmInfo.alarmUse;
			this.alarmMode = alarmInfo.alarmMode;
			this.alarmHour = alarmInfo.alarmHour;
			this.alarmMin = alarmInfo.alarmMin;
		} else {
			this.alarmUse = false;
			this.alarmMode = '오전';
			this.alarmHour = '10';
			this.alarmMin = '00';
		}
	}

	onChangeUse(mode) {
		this.alarmUse = mode;
		console.log('mode :', mode);
	}

	onChangeMode(mode) {
		this.alarmMode = mode;
		console.log('mode :', mode);
	}

	onChangeHour(mode) {
		this.alarmHour = mode;
		console.log('hour :', mode);
	}

	onChangeMin(mode) {
		this.alarmMin = mode;
		console.log('min :', mode);
	}

	public cancelAll() {
		this.localNotifications.cancelAll();
	}

	public addNotifications() {

		this.storage.setAlarmInfo(this.alarmUse, this.alarmMode, this.alarmHour, this.alarmMin);

		this.cancelAll();

		let currentDate = new Date();
		let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.

		this.days = [
			{title: '월', dayCode: 1, checked: true},
			{title: '화', dayCode: 2, checked: true},
			{title: '수', dayCode: 3, checked: true},
			{title: '목', dayCode: 4, checked: true},
			{title: '금', dayCode: 5, checked: true},
			{title: '토', dayCode: 6, checked: false},
			{title: '일', dayCode: 7, checked: false},
		];

		this.chosenHours = Number(this.alarmHour);
		this.chosenMinutes = Number(this.alarmMin);

		if (this.alarmMode == '오후')
		{
			this.chosenHours += 12;
		}

		if (this.alarmUse === true)
		{
			for(let day of this.days) {
				if (day.checked) {

					let firstNotificationTime = new Date(new Date().getTime());
					console.log('set LocalNotifications Provider before : ', firstNotificationTime);

					let dayDifference = day.dayCode - currentDay;

					if (dayDifference < 0){
						dayDifference = dayDifference + 7; // for cases where the day is in the following week
					}

					firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
					firstNotificationTime.setHours(this.chosenHours);
					firstNotificationTime.setMinutes(this.chosenMinutes);
					firstNotificationTime.setSeconds(this.chosenSeconds);

					console.log('set LocalNotifications Provider after : ', firstNotificationTime);


					let notification = {
						id: day.dayCode,
						title: '[오늘하루] 정신건강 자기관리 프로그램',
						text: '오늘하루 알림이 도착했습니다.',
						data: { harucard: '오늘하루 알림이 도착했습니다.' },
						at: new Date(firstNotificationTime),
						every: 'week'
					};

					this.localNotifications.schedule(notification);
				}
			}
		}
	}
} 