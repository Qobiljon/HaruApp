import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class StorageProvider {

  public storage = localStorage;

  constructor(public events: Events) {
    console.log('Hello Storage Provider');
  }

  eventHaruCardBookmark(num, title, bookmark) {
    console.log('이벤트 : 하루카드 북마크 변경');
    this.events.publish('eventHaruCardBookmark:changed', num, title, bookmark);
  }

  eventHaruTodayBookmark(num, title, bookmark) {
    console.log('이벤트 : 오늘하루 북마크 변경');
    this.events.publish('eventHaruTodayBookmark:changed', num, title, bookmark);
  }

  eventHaruCardRead(num, last_read_date, point) {
    console.log('이벤트 : 하루카드 읽기 변경');
    this.events.publish('eventHaruCardRead:changed', num, last_read_date, point);
  }

  eventHaruTodayRead(num, last_read_date, point) {
    console.log('이벤트 : 오늘하루 읽기 변경');
    this.events.publish('eventHaruTodayRead:changed', num, last_read_date, point);
  }

  eventPostHaruCardInfo(read, testDate, title, ratingJoined, ratingPoint, totalPoint) {
    console.log('이벤트 : 하루카드 정보 조회');
    this.events.publish('postHaruCardInfo:changed', read, testDate, title, ratingJoined, ratingPoint, totalPoint);
  }

  eventPostHaruTodayInfo(read, testDate, title, ratingJoined, ratingPoint, totalPoint) {
    console.log('이벤트 : 오늘하루 정보 조회');
    this.events.publish('postHaruTodayInfo:changed', read, testDate, title, ratingJoined, ratingPoint, totalPoint);
  }

  public get(key) {
    return this.storage.getItem(key);
  }

  public set(key, value) {
    this.storage.setItem(key, value);
  }

  public getObject(key) {
    let value = this.get(key);

    let returnValue;
    if (value) {
      returnValue = JSON.parse(value);
    } else {
      returnValue = null;
    }

    return returnValue;
  }

  public setObject(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public remove(key) {
    this.storage.removeItem(key);
  }

  getLocalNotifications() {
    return this.get('localNotifications');
  }

  setLocalNotifications(msg) {
    this.set('localNotifications', msg);
  }

  getAppPart() {
    return this.get('appPart');
  }

  setAppPart(part) {
    this.set('appPart', part);
  }

  getAppPartName() {
    if (this.get('appPart') == '1') {
      return '[ 우울·불안 ]'
    } else if (this.get('appPart') == '2') {
      return '[ 수면 ]'
    } else if (this.get('appPart') == '3') {
      return '[ 통증 ]'
    } else {
      return '[ 우울·불안 / 수면 / 통증 ]';
    }
  }

  setLogout() {
    this.remove('appPart');
    this.remove('selectHaruCardItem');
    this.remove('localNotifications');
    this.remove('userInfo');
    this.remove('alarmInfo');
    this.remove('haruCardDateInfo');
    this.remove('haruCardList');
    this.remove('lastRatingDate');
    this.remove('lastReadDate');
    this.remove('lastRatingGraphData');
    this.remove('lastRatingGraphNum');
    this.remove('lastBookmarkDate');
    this.remove('haruCardBookmarkInfo');
    this.remove('haruCardReadInfo');
    this.remove('haruCardRatingInfo');
    this.remove('lastRatingDate');
    this.remove('lastReadDate');
    this.remove('lastBookmarkDate');
    this.remove('playBgm');
    this.remove('giftItem');

    // 사용자데이터 삭제
    this.remove('dtPg01');
    this.remove('dtPg02');
    this.remove('dtPg03');
    this.remove('dtPg04');
    this.remove('dtPg05');
    this.remove('dtPg06');
    this.remove('dtPg07');
    this.remove('dtPg08');
    this.remove('dtPg09');
    this.remove('dtPg10');
    this.remove('dtPg11');
    this.remove('dtPg12');
    this.remove('dtPg13');
    this.remove('dtPg14');
    this.remove('dtPg15');
    this.remove('dtPg16');
    this.remove('dtPg17');
    this.remove('dtPg18');
    this.remove('dtPg19');
    this.remove('dtPg20');
    this.remove('dtPg21');
    this.remove('dtPg22');
    this.remove('dtPg23');
    this.remove('dtPg24');
    this.remove('dtPg25');
    this.remove('dtPg26');
    this.remove('dtPg27');
    this.remove('dtPg28');
    this.remove('dtPg29');
    this.remove('dtPg30');
    this.remove('dtPg31');
    this.remove('dtPg32');
    this.remove('dtPg33');
    this.remove('dtPg34');
    this.remove('dtPg35');
    this.remove('dtPg36');
    this.remove('dtPg37');
    this.remove('dtPg38');
    this.remove('dtPg39');
    this.remove('dtPg40');
    this.remove('dtPg41');
    this.remove('dtPg42');
    this.remove('dtPg43');
    this.remove('dtPg44');
    this.remove('dtPg45');
    this.remove('dtPg46');
    this.remove('dtPg47');
    this.remove('dtPg48');
  }

  setLogin(userInfo) {
    this.setObject('userInfo', userInfo);
    this.changeUserInfo();
  }

  isLoggedIn() {
    let userInfo = this.getObject('userInfo');

    if (typeof userInfo !== 'undefined' && userInfo != null) {
      return true;
    }
    else {
      return false;
    }
  }

  getUserInfo() {
    let userInfo = this.getObject('userInfo');

    if (typeof userInfo !== 'undefined' && userInfo != null) {
      return userInfo;
    }
    else {
      return null;
    }
  }

  changeUserInfo() {
    let userInfo = this.getObject('userInfo');

    if (typeof userInfo !== 'undefined' && userInfo !== null) {
      this.events.publish('userInfo:changed', userInfo);
    }
  }

  setSelectHaruCardItem(item) {
    this.setObject('selectHaruCardItem', item);
  }

  setSelectHaruTodayItem(item) {
    this.setObject('selectHaruTodayItem', item);
  }

  clearSelectHaruCardItem() {
    this.remove('selectHaruCardItem');
  }

  clearSelectHaruTodayItem() {
    this.remove('selectHaruTodayItem');
  }

  getSelectHaruCardItem() {
    let selectHaruCardItem = this.getObject('selectHaruCardItem');

    if (typeof selectHaruCardItem !== 'undefined' && selectHaruCardItem != null) {
      return selectHaruCardItem;
    }
    else {
      return null;
    }
  }

  getSelectHaruTodayItem() {
    let selectHaruTodayItem = this.getObject('selectHaruTodayItem');

    if (typeof selectHaruTodayItem !== 'undefined' && selectHaruTodayItem != null) {
      return selectHaruTodayItem;
    }
    else {
      return null;
    }
  }

  setVolumeState(volumeState) {
    this.setObject('volumeState', volumeState);
    this.changeVolumeState();
  }

  getVolumeState() {
    let volumeState = this.getObject('volumeState');

    if (typeof volumeState !== 'undefined' && volumeState != null) {
      return volumeState;
    }
    else {
      return '1';
    }
  }

  changeVolumeState() {
    let volumeState = this.getObject('volumeState');

    if (typeof volumeState !== 'undefined' && volumeState !== null) {
      this.events.publish('volumeState:changed', volumeState);
    }
  }

  setAlarmInfo(alarmUse, alarmMode, alarmHour, alarmMin) {
    var alarmInfo = {
      alarmUse: false,
      alarmMode: '오전',
      alarmHour: '10',
      alarmMin: '00',
    };

    alarmInfo.alarmUse = alarmUse;
    alarmInfo.alarmMode = alarmMode;
    alarmInfo.alarmHour = alarmHour;
    alarmInfo.alarmMin = alarmMin;

    this.setObject('alarmInfo', alarmInfo);
    this.events.publish('alarmInfo:changed', alarmUse, alarmMode, alarmHour, alarmMin);
  }

  getAlarmInfo() {
    let alarmInfo = this.getObject('alarmInfo');

    if (typeof alarmInfo !== 'undefined' && alarmInfo != null) {
      return alarmInfo;
    }
    else {
      return null;
    }
  }

  setPlayBgm(status) {
    this.set('playBgm', status);
    this.changePlayBgm(status);
  }

  getPlayBgm() {
    return this.get('playBgm');
  }

  changePlayBgm(status) {
    this.events.publish('playBgm:changed', status);
  }

  setHaruCardDateInfo(items) {
    this.setObject('haruCardDateInfo', items);
    this.changeHaruCardDateInfo();
  }

  setHaruTodayDateInfo(items) {
    this.setObject('haruTodayDateInfo', items);
    this.changeHaruTodayDateInfo();
  }

  getHaruCardDateInfo() {
    let haruCardDateInfo = this.getObject('haruCardDateInfo');

    if (typeof haruCardDateInfo !== 'undefined' && haruCardDateInfo != null) {
      return haruCardDateInfo;
    }
    else {
      return null;
    }
  }

  getHaruTodayDateInfo() {
    let haruTodayDateInfo = this.getObject('haruTodayDateInfo');

    if (typeof haruTodayDateInfo !== 'undefined' && haruTodayDateInfo != null) {
      return haruTodayDateInfo;
    }
    else {
      return null;
    }
  }

  changeHaruCardDateInfo() {
    let haruCardDateInfo = this.getObject('haruCardDateInfo');

    if (typeof haruCardDateInfo !== 'undefined' && haruCardDateInfo !== null) {
      this.events.publish('haruCardDateInfo:changed', haruCardDateInfo);
    }
  }

  changeHaruTodayDateInfo() {
    let haruTodayDateInfo = this.getObject('haruTodayDateInfo');

    if (typeof haruTodayDateInfo !== 'undefined' && haruTodayDateInfo !== null) {
      this.events.publish('haruTodayDateInfo:changed', haruTodayDateInfo);
    }
  }

  setHaruCardList(items) {
    this.setObject('haruCardList', items);
    this.changeHaruCardList();
  }

  setHaruTodayMenu(items) {
    this.setObject('haruTodayMenu', items);
    this.changeHaruTodayMenu();
  }

  getHaruCardList() {
    let haruCardList = this.getObject('haruCardList');

    if (typeof haruCardList !== 'undefined' && haruCardList != null) {
      return haruCardList;
    }
    else {
      return null;
    }
  }

  getHaruTodayMenu() {
    let haruTodayMenu = this.getObject('haruTodayMenu');

    if (typeof haruTodayMenu !== 'undefined' && haruTodayMenu != null) {
      return haruTodayMenu;
    }
    else {
      return null;
    }
  }

  changeHaruCardList() {
    let haruCardList = this.getObject('haruCardList');

    if (typeof haruCardList !== 'undefined' && haruCardList !== null) {
      this.events.publish('haruCardList:changed', haruCardList);
    }
  }

  changeHaruTodayMenu() {
    let haruTodayMenu = this.getObject('haruTodayMenu');

    if (typeof haruTodayMenu !== 'undefined' && haruTodayMenu !== null) {
      this.events.publish('haruTodayMenu:changed', haruTodayMenu);
    }
  }

  setHaruTodayDataList(items) {
    this.setObject('haruTodayDataList', items);
    this.changeHaruTodayDataList();
  }

  getHaruTodayDataList() {
    let haruTodayDataList = this.getObject('haruTodayDataList');

    if (typeof haruTodayDataList !== 'undefined' && haruTodayDataList != null) {
      return haruTodayDataList;
    }
    else {
      return null;
    }
  }

  changeHaruTodayDataList() {
    let haruTodayDataList = this.getObject('haruTodayDataList');

    if (typeof haruTodayDataList !== 'undefined' && haruTodayDataList !== null) {
      this.events.publish('haruTodayDataList:changed', haruTodayDataList);
    }
  }

  getTotalPoint() {
    return this.get('totalPoint');
  }

  setTotalPoint(total_point) {
    this.set('totalPoint', total_point);

  }

  getCurrentRatingPoint() {
    let point: number = 0;

    if (this.getHaruCardRatingInfo() != null) {
      let haruCardRatingInfo: any = this.getHaruCardRatingInfo();
      if (haruCardRatingInfo != null) {
        point = Number(haruCardRatingInfo[this.getHaruCardDateInfo().today_count]);
      }
    }

    return point;
  }
	/*
	getCurrentRatingPoint()
	{
		let point:number = 0;

		if (this.getHaruTodayRatingInfo() != null)
		{
			let haruTodayRatingInfo:any = this.getHaruTodayRatingInfo();
			if (haruTodayRatingInfo != null)
			{
				point = Number(haruTodayRatingInfo[this.getHaruTodayDateInfo().today_count]);
			}
		}

		return point;
	}
	*/

  hasRatingJoined() {
    let todayDate: string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);

    return (this.getLastRatingDate() == todayDate)
  }

  getLastRatingDate() {
    return this.get('lastRatingDate');
  }

  setLastRatingDate(last_date) {
    this.set('lastRatingDate', last_date);
    this.changeLastRatingDate();
  }

  changeLastRatingDate() {
    let lastRatingDate = this.get('lastRatingDate');

    if (typeof lastRatingDate !== 'undefined' && lastRatingDate !== null) {
      this.events.publish('lastRatingDate:changed', lastRatingDate);
    }
  }

  getLastRatingGraphData() {
    let lastRatingGraphData = this.getObject('lastRatingGraphData');

    if (typeof lastRatingGraphData !== 'undefined' && lastRatingGraphData != null) {
      return lastRatingGraphData;
    }
    else {
      return null;
    }
  }

  setLastRatingGraphData(items) {
    this.setObject('lastRatingGraphData', items);
    this.changeLastRatingGraphData();
  }

  changeLastRatingGraphData() {
    let lastRatingGraphData = this.getObject('lastRatingGraphData');

    if (typeof lastRatingGraphData !== 'undefined' && lastRatingGraphData !== null) {
      this.events.publish('lastRatingGraphData:changed', lastRatingGraphData);
    }
  }

  getLastRatingGraphNum() {
    let lastRatingGraphNum = this.getObject('lastRatingGraphNum');

    if (typeof lastRatingGraphNum !== 'undefined' && lastRatingGraphNum != null) {
      return lastRatingGraphNum;
    }
    else {
      return null;
    }
  }

  setLastRatingGraphNum(items) {
    this.setObject('lastRatingGraphNum', items);
    this.changeLastRatingGraphNum();
  }

  changeLastRatingGraphNum() {
    let lastRatingGraphNum = this.getObject('lastRatingGraphNum');

    if (typeof lastRatingGraphNum !== 'undefined' && lastRatingGraphNum !== null) {
      this.events.publish('lastRatingGraphNum:changed', lastRatingGraphNum);
    }
  }

  getLastRatingGraphFullData() {
    let lastRatingGraphFullData = this.getObject('lastRatingGraphFullData');

    if (typeof lastRatingGraphFullData !== 'undefined' && lastRatingGraphFullData != null) {
      return lastRatingGraphFullData;
    }
    else {
      return null;
    }
  }

  setLastRatingGraphFullData(items) {
    this.setObject('lastRatingGraphFullData', items);
    this.changeLastRatingGraphFullData();
  }

  changeLastRatingGraphFullData() {
    let lastRatingGraphFullData = this.getObject('lastRatingGraphFullData');

    if (typeof lastRatingGraphFullData !== 'undefined' && lastRatingGraphFullData !== null) {
      this.events.publish('lastRatingGraphFullData:changed', lastRatingGraphFullData);
    }
  }

  getLastRatingGraphFullNum() {
    let lastRatingGraphFullNum = this.getObject('lastRatingGraphFullNum');

    if (typeof lastRatingGraphFullNum !== 'undefined' && lastRatingGraphFullNum != null) {
      return lastRatingGraphFullNum;
    }
    else {
      return null;
    }
  }

  setLastRatingGraphFullNum(items) {
    this.setObject('lastRatingGraphFullNum', items);
    this.changeLastRatingGraphFullNum();
  }

  changeLastRatingGraphFullNum() {
    let lastRatingGraphFullNum = this.getObject('lastRatingGraphFullNum');

    if (typeof lastRatingGraphFullNum !== 'undefined' && lastRatingGraphFullNum !== null) {
      this.events.publish('lastRatingGraphFullNum:changed', lastRatingGraphFullNum);
    }
  }

  setHaruCardRatingInfo(items) {
    this.setObject('haruCardRatingInfo', items);
    this.changeHaruCardRatingInfo();
  }

  setHaruTodayRatingInfo(items) {
    this.setObject('haruTodayRatingInfo', items);
    this.changeHaruTodayRatingInfo();
  }

  getHaruCardRatingInfo() {
    let haruCardRatingInfo = this.getObject('haruCardRatingInfo');

    if (typeof haruCardRatingInfo !== 'undefined' && haruCardRatingInfo != null) {
      return haruCardRatingInfo;
    }
    else {
      return null;
    }
  }

  getHaruTodayRatingInfo() {
    let haruTodayRatingInfo = this.getObject('haruTodayRatingInfo');

    if (typeof haruTodayRatingInfo !== 'undefined' && haruTodayRatingInfo != null) {
      return haruTodayRatingInfo;
    }
    else {
      return null;
    }
  }

  isExistHaruCardRatingInfo(num) {
    let find: boolean = false;

    let haruCardRatingInfo = this.getHaruCardRatingInfo();

    if (haruCardRatingInfo != null && haruCardRatingInfo[num] == "1")
      find = true;

    return find;
  }

  isExistHaruTodayRatingInfo(num) {
    let find: boolean = false;

    let haruTodayRatingInfo = this.getHaruTodayRatingInfo();

    if (haruTodayRatingInfo != null && haruTodayRatingInfo[num] == "1")
      find = true;

    return find;
  }

  changeHaruCardRatingInfo() {
    let haruCardRatingInfo = this.getObject('haruCardRatingInfo');

    if (typeof haruCardRatingInfo !== 'undefined' && haruCardRatingInfo !== null) {
      this.events.publish('haruCardRatingInfo:changed', haruCardRatingInfo);
    }
  }

  changeHaruTodayRatingInfo() {
    let haruTodayRatingInfo = this.getObject('haruTodayRatingInfo');

    if (typeof haruTodayRatingInfo !== 'undefined' && haruTodayRatingInfo !== null) {
      this.events.publish('haruTodayRatingInfo:changed', haruTodayRatingInfo);
    }
  }

  getLastReadDate() {
    return this.get('lastReadDate');
  }

  setLastReadDate(last_date) {
    this.set('lastReadDate', last_date);
    this.changeLastReadDate();
  }

  changeLastReadDate() {
    let lastReadDate = this.get('lastReadDate');

    if (typeof lastReadDate !== 'undefined' && lastReadDate !== null) {
      this.events.publish('lastReadDate:changed', lastReadDate);
    }
  }

  getLastBookmarkDate() {
    return this.get('lastBookmarkDate');
  }

  setLastBookmarkDate(last_date) {
    this.set('lastBookmarkDate', last_date);
    this.changeLastBookmarkDate();
  }

  changeLastBookmarkDate() {
    let lastBookmarkDate = this.get('lastBookmarkDate');

    if (typeof lastBookmarkDate !== 'undefined' && lastBookmarkDate !== null) {
      this.events.publish('lastBookmarkDate:changed', lastBookmarkDate);
    }
  }

  hasCurrentBookmark() {
    if (this.getHaruCardBookmarkInfo() != null) {
      let haruCardBookmarkInfo: any = this.getHaruCardBookmarkInfo();
      if (haruCardBookmarkInfo != null) {
        return (haruCardBookmarkInfo[this.getHaruCardDateInfo().today_count] == 1);
      }
    }

    return false;
  }
	/*
	hasCurrentBookmark()
	{
		if (this.getHaruTodayBookmarkInfo() != null)
		{
			let haruTodayBookmarkInfo:any = this.getHaruTodayBookmarkInfo();
			if (haruTodayBookmarkInfo != null)
			{
				return (haruTodayBookmarkInfo[this.getHaruTodayDateInfo().today_count] == 1);
			}
		}

		return false;
	}
	*/

  setHaruCardBookmarkInfo(items) {
    this.setObject('haruCardBookmarkInfo', items);
  }

  setHaruTodayBookmarkInfo(items) {
    this.setObject('haruTodayBookmarkInfo', items);
  }

  getHaruCardBookmarkInfo() {
    let haruCardBookmarkInfo = this.getObject('haruCardBookmarkInfo');

    if (typeof haruCardBookmarkInfo !== 'undefined' && haruCardBookmarkInfo != null) {
      return haruCardBookmarkInfo;
    }
    else {
      return null;
    }
  }

  getHaruTodayBookmarkInfo() {
    let haruTodayBookmarkInfo = this.getObject('haruTodayBookmarkInfo');

    if (typeof haruTodayBookmarkInfo !== 'undefined' && haruTodayBookmarkInfo != null) {
      return haruTodayBookmarkInfo;
    }
    else {
      return null;
    }
  }

  setHaruCardReadInfo(items) {
    this.setObject('haruCardReadInfo', items);
  }

  setHaruTodayReadInfo(items) {
    this.setObject('haruTodayReadInfo', items);
  }

  getHaruCardReadInfo() {
    let haruCardReadInfo = this.getObject('haruCardReadInfo');

    if (typeof haruCardReadInfo !== 'undefined' && haruCardReadInfo != null) {
      return haruCardReadInfo;
    }
    else {
      return null;
    }
  }

  getHaruTodayReadInfo() {
    let haruTodayReadInfo = this.getObject('haruTodayReadInfo');

    if (typeof haruTodayReadInfo !== 'undefined' && haruTodayReadInfo != null) {
      return haruTodayReadInfo;
    }
    else {
      return null;
    }
  }

  isExistHaruCardReadInfo(num) {
    let find: boolean = false;

    let haruCardReadInfo = this.getHaruCardReadInfo();

    if (haruCardReadInfo != null && haruCardReadInfo[num] == "1")
      find = true;

    return find;
  }

  isExistHaruTodayReadInfo(num) {
    let find: boolean = false;

    let haruTodayReadInfo = this.getHaruTodayReadInfo();

    if (haruTodayReadInfo != null && haruTodayReadInfo[num] == "1")
      find = true;

    return find;
  }

  setGiftItem(items) {
    this.setObject('giftItem', items);
  }

  getGiftItem() {
    let giftItem = this.getObject('giftItem');

    if (typeof giftItem !== 'undefined' && giftItem != null) {
      return giftItem;
    }
    else {
      return null;
    }
  }
}
