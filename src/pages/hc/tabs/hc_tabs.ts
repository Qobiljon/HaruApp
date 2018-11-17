import { Component } from '@angular/core';
import { NavController, NavParams, Events, IonicPage } from 'ionic-angular';
import { StorageProvider } from '../../../providers/hc/storage/storage';

@IonicPage()
@Component({
  selector: 'hc-page-tabs',
  templateUrl: 'hc_tabs.html'
})
export class HcTabsPage {

  params: any = {};

  constructor(public navCtrl: NavController,
    public storage: StorageProvider,
    public events: Events,
    public navParams: NavParams)
  {
    let pageName: string = this.navParams.get("pageName");
    let tabIndex: number = 0;

    if (pageName == 'home')
      tabIndex = 0;
    else if (pageName == 'harucard')
      tabIndex = 1;
    else if (pageName == 'favorites')
      tabIndex = 2;

    this.params.tabIndex = tabIndex;
    this.params.data = [
      { page: 'HcHomePage', title: "홈", icon: "home"},
      { page: 'HcHaruCardPage', title: "하루카드", icon: "albums"},
      { page: 'HcFavoritesPage', title: "즐겨찾기", icon: "heart"},
    ];

    this.events.subscribe('tabs:changed', (page) => {
      if (page == 'HcHomePage') {
        this.events.publish('playBgm:changed', 'true');
      } else {
        this.events.publish('playBgm:changed', 'false');
      }
      return;
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter()');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}
