import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcHistoryPage } from './history';

@NgModule({
  declarations: [
    HcHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(HcHistoryPage),
  ],
})
export class HcHistoryPageModule {}
