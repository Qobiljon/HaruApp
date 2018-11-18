import { Component } from '@angular/core';
import { NavController, NavParams, Events, IonicPage } from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'ht3-page-tabs',
  templateUrl: 'ht3_tabs.html'
})
export class Ht3TabsPage {

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
      { page: 'Ht3HomePage', title: "홈", icon: "home"},
      { page: 'Ht3ListPage', title: "오늘하루", icon: "list"},
      { page: 'Ht3FavoritesPage', title: "즐겨찾기", icon: "heart"},
    ];

    this.events.subscribe('tabs:changed', (page) => {
      if (page == 'Ht3HomePage') {
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
