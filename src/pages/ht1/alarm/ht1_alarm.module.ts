import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ht1AlarmPage } from './ht1_alarm';

@NgModule({
  declarations: [
    Ht1AlarmPage,
  ],
  imports: [
    IonicPageModule.forChild(AlarmPage)
  ],
})
export class Ht1AlarmPageModule {}
