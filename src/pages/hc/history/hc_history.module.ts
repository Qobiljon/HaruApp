import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcHistoryPage } from './hc_history';

@NgModule({
  declarations: [
    HcHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(HcHistoryPage),
  ],
})
export class HcHistoryPageModule {}
