import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerComponentModule } from '../../../components/timer/timer.module';
import { Ht3Pg20Page } from './ht3_pg20';

@NgModule({
  declarations: [
    Ht3Pg20Page
  ],
  imports: [
    IonicPageModule.forChild(Ht3Pg20Page),
    TimerComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ht3Pg20PageModule {}
