import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashScreenLayoutModule } from '../../../components/splash-screen/splash-screen-layout.module';
import { Ht3SplashPage } from './ht3_splash';

@NgModule({
  declarations: [
    Ht3SplashPage,
  ],
  imports: [
    IonicPageModule.forChild(Ht3SplashPage),
    SplashScreenLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ht3SplashPageModule {}
