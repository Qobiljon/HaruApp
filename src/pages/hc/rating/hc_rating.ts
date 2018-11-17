import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { StorageProvider } from '../../../providers/hc/storage/storage';
import { ApiProvider } from '../../../providers/hc/api/api';

@IonicPage()
@Component({
  selector: 'hc-page-rating',
  templateUrl: 'hc_rating.html',
})
export class HcRatingPage {

  brightness: number = 10;
  saturation: number = 0;
  rating: number = 5;
  structure: any = {lower: 33, upper: 60};

  todayCount: number = 1;

  todayDate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
  responseData: any = {};

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public storage: StorageProvider)
  {
    let haruCardDateInfo = this.storage.getHaruCardDateInfo();

    if (haruCardDateInfo != null)
    {
      console.log('haruCardDateInfo', haruCardDateInfo);
      this.todayCount = haruCardDateInfo.today_count;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

  onChange(ev: any) {
    console.log('Changed', ev);
  }

  closeRatingModal() {
    let data = { 'mode': 'close' };
    this.viewCtrl.dismiss(data);
  }

  sendRatingModal(rating) {

    let userInfo = this.storage.getUserInfo();

    let requestData = {"mode": "harucard_rating", "id": userInfo.id, "key": userInfo.key, "rating": rating};

    console.log('sendRatingModal requestData', requestData);

    this.api.postData('harucard_rating', requestData).then((data) => {

      let responseData:any = data;

      console.log('sendRatingModal responseData', responseData);

      if (responseData.mode == 'harucard_rating' && responseData.code == 'ok')
      {
        // 기분평가 설정
        this.storage.setHaruCardRatingInfo(responseData.result.rating_items);
        this.storage.setLastRatingDate(responseData.result.last_rating_date);

        let data = { 'mode': 'send', 'rating': this.rating };
        this.viewCtrl.dismiss(data);
      }
    }, (err) => {
      // Error log
      console.log('error sendRatingModal');
    });
  }
}
