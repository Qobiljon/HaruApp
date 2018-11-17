import { Component, ViewChild } from '@angular/core';
import { Content, ModalController, NavController, NavParams, Platform, App, Tabs, Searchbar, IonicPage } from 'ionic-angular';
import { UtilProvider } from '../../../providers/hc/util/util';
import { StorageProvider } from '../../../providers/hc/storage/storage';
import { ApiProvider } from '../../../providers/hc/api/api';
import { HaruCardDataProvider } from '../../../providers/hc/harucard-data/harucard-data';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@IonicPage()
@Component({
  selector: 'hc-page-harucard',
  templateUrl: 'hc_harucard.html',
})
export class HcHaruCardPage {

	@ViewChild(Content) content: Content;

	selectedItem: any;

 	todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
 	todayWeekDay:number = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).getDay();

	searchTerm: string = '';

	item: any;
	items: Array<{num: number, no: number, targetdate: string, targetday: string, img: string, code: string, category: string, title: string, bookmark:boolean, read:boolean}> = [];
	isMarked: boolean = false;

	title: string = '하루카드 목록';

	viewMode: boolean = false;

	@ViewChild('searchbar') searchbar:Searchbar;

	constructor(
		public app: App,
		public tabs: Tabs,
		public modalCtrl: ModalController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public platform: Platform,
		public sharingVar: SocialSharing,
		public util: UtilProvider,
		public storage: StorageProvider,
		public haruCardData: HaruCardDataProvider,
		public photoViewer: PhotoViewer,
		public api: ApiProvider)
	{
		this.tabs = this.navCtrl.parent;
  	}

	presentImage(img, title) {
		this.util.toast(title, 1000, 'bottom');
		this.photoViewer.show(img, title, {share: true});
	}

	setSearchbar() {
		this.searchbar.setFocus();
	}

	otherShare(category, title, code){
		this.sharingVar.share("[하루카드] " + category + " - " + title , null,null/*File*/,"http://49.247.192.84/haru/harucard?code=" + code)
			.then(()=>{
				this.util.toast('하루카드를 공유하였습니다.', 2000, 'middle');
			},
			()=>{
				this.util.toast('하루카드 공유를 실패하였습니다.', 2000, 'middle');
		})
	}

	itemTapped(event, item) {

		if (this.storage.hasRatingJoined() || this.todayWeekDay >= 6)
		{
			console.log('itemTapped', item);
			/*
			this.navCtrl.push('HaruCardPage', {
				item: item
			});
			*/
			// 아이템을 등록하고 탭으로 이동한다.
			this.storage.setSelectHaruCardItem(item);	
			this.ionViewDidLoad();
		}
		else
		{
			let ratingModal = this.modalCtrl.create('HcRatingPage');

			ratingModal.onDidDismiss(data => {
				if (data.mode == 'close') {
					console.log('close rating');
				} else {
					console.log('send rating : ', data);
				}
			});

			ratingModal.present();
		}
	}

	itemMarked(event, item) {
		console.log('itemMarked', item);
		this.loadHaruCardBookmark(item.hc_code, item.num, item.hc_title);
	}

	goHaruCardList()
	{
		this.platform.ready().then( () => {
			this.ionViewDidLoad();
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HaruCardPage');

		this.selectedItem = this.navParams.get('item');

		let item = this.storage.getSelectHaruCardItem();

		if (item != null)
		{
			// 아이템을 선택 했을때
			this.storage.clearSelectHaruCardItem();

			this.selectedItem = item;
			this.viewMode = true;
		} else {
			this.viewMode = false;
		}

		if (this.selectedItem != null)
		{
			console.log('하루카드 : 뷰 모드');
			this.title = '하루카드';

			this.isMarked = this.selectedItem.bookmark;

			let haruCardList = this.storage.getHaruCardList();

			for (let item of haruCardList)
			{
				if (item.hc_code == this.selectedItem.code)
				{
					console.log('하루카드 북마크', item);

					this.item = item;
					break;
				}
			}

			// 하루카드 읽기 조회
			this.loadHaruCardView(this.selectedItem.code, this.selectedItem.num);

		} else {
			this.selectedItem = null;
			this.item = null;

			console.log('하루카드 : 리스트 모드');
			this.title = '하루카드 목록';

			this.setFilteredItems();
		}

		/*
		for (let item of this.items) {
			console.log('하루카드 북마크', item.num);
			console.log('하루카드 북마크', item.bookmark);
		}
		*/
	}

	setFilteredItems() {
		this.items = this.haruCardData.filterItems(this.searchTerm);
	}

	loadHaruCardBookmark(code, num, title){

		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harucard_bookmark", "code": code, "num":num, "id": userInfo.id, "key": userInfo.key};

		this.api.postData('harucard_bookmark', requestData)
		.then((data) => {
			let responseData:any = data;

			console.log('requestData : ', requestData);
			console.log('responseData : ', responseData);
			if (responseData.mode == 'harucard_bookmark' && responseData.code == 'ok')
			{
				// 북마크 설정
				this.storage.setHaruCardBookmarkInfo(responseData.result.bookmark_items);

				this.isMarked = (responseData.result.bookmark) ? true : false;

				// 북마크 이벤트
				this.storage.eventHaruCardBookmark(num, title, responseData.result.bookmark);
			}
		}, (err) => {
			// Error log
			console.log('error loadHaruCardView');
		});
	}

	loadHaruCardView(code, num){

		let userInfo = this.storage.getUserInfo();

		let requestData = {"mode": "harucard_read", "code": code, "num":num, "id": userInfo.id, "key": userInfo.key};

		this.api.postData('harucard_read', requestData)
		.then((data) => {

			let responseData:any = data;

			console.log('loadHaruCardView requestData : ', requestData);
			console.log('loadHaruCardView responseData : ', responseData);
			if (responseData.mode == 'harucard_read' && responseData.code == 'ok')
			{
				// 하루카드 읽기 설정
				this.storage.setTotalPoint(responseData.result.total_point);
				this.storage.setHaruCardReadInfo(responseData.result.read_items);

				// 하루카드 읽기 이벤트
				this.storage.eventHaruCardRead(num, responseData.result.last_read_date, responseData.result.point);

				this.content.scrollToTop();
			}
		}, (err) => {
			// Error log
			console.log('error loadHaruCardView');
		});
	}

	openUrl(url) {
		this.util.openUrl(url);
	}
}
