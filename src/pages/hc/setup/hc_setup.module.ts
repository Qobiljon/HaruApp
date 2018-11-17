import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcSetupPage } from './hc_setup';

@NgModule({
  declarations: [
    HcSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(HcSetupPage),
  ],
})
export class HcSetupPageModule {}
