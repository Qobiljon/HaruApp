import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcGiftPage } from './hc_gift';

@NgModule({
  declarations: [
    HcGiftPage,
  ],
  imports: [
    IonicPageModule.forChild(HcGiftPage)
  ],
})
export class HcGiftPageModule {}
