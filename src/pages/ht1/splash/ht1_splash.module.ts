import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashScreenLayoutModule } from '../../../components/splash-screen/splash-screen-layout.module';
import { Ht1SplashPage } from './ht1_splash';

@NgModule({
  declarations: [
    Ht1SplashPage,
  ],
  imports: [
    IonicPageModule.forChild(Ht1SplashPage),
    SplashScreenLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ht1SplashPageModule {}
