import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashScreenLayoutModule } from '../../../components/splash-screen/splash-screen-layout.module';
import { HcSplashPage } from './hc_splash';

@NgModule({
  declarations: [
    HcSplashPage,
  ],
  imports: [
    IonicPageModule.forChild(HcSplashPage),
    SplashScreenLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HcSplashPageModule {}
