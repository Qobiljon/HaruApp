import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcAlarmPage } from './hc_alarm';

@NgModule({
  declarations: [
    HcAlarmPage
  ],
  imports: [
    IonicPageModule.forChild(HcAlarmPage)
  ],
})
export class HcAlarmPageModule {}
