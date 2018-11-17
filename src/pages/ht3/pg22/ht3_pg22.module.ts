import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerComponentModule } from '../../../components/timer/timer.module';
import { Ht3Pg22Page } from './ht3_pg22';

@NgModule({
  declarations: [
    Ht3Pg22Page
  ],
  imports: [
    IonicPageModule.forChild(Ht3Pg22Page),
    TimerComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ht3Pg22PageModule {}
