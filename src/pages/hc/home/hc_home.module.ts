import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcHomePage } from './hc_home';

@NgModule({
  declarations: [
    HcHomePage,
  ],
  imports: [
    IonicPageModule.forChild(HcHomePage),
  ],
})
export class HcHomePageModule {}
