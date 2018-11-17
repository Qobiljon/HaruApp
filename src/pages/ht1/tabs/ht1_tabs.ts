import { Component } from '@angular/core';
import { NavController, NavParams, Events, IonicPage } from 'ionic-angular';
import { StorageProvider } from '../../../providers/ht1/storage/storage';

@IonicPage()
@Component({
  selector: 'ht1-page-tabs',
  templateUrl: 'ht1_tabs.html'
})
export class Ht1TabsPage {

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
    else if (pageName == 'list')
      tabIndex = 1;
    else if (pageName == 'favorites')
      tabIndex = 2;

    this.params.tabIndex = tabIndex;
    this.params.data = [
      { page: 'Ht1HomePage', title: "홈", icon: "home"},
      { page: 'Ht1ListPage', title: "오늘하루", icon: "list"},
      { page: 'Ht1FavoritesPage', title: "즐겨찾기", icon: "heart"},
    ];
    
    this.events.subscribe('tabs:changed', (page) => {
      if (page == 'Ht1HomePage') {
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
