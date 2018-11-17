import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcLoginPage } from './hc_login';

@NgModule({
  declarations: [
    HcLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(HcLoginPage),
  ],
})
export class HcLoginPageModule {}
