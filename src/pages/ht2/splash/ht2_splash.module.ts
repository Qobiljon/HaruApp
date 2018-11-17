import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashScreenLayoutModule } from '../../../components/splash-screen/splash-screen-layout.module';
import { Ht2SplashPage } from './ht2_splash';

@NgModule({
  declarations: [
    Ht2SplashPage,
  ],
  imports: [
    IonicPageModule.forChild(Ht2SplashPage),
    SplashScreenLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ht2SplashPageModule {}
