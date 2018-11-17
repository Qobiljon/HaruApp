import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerComponent } from './timer';

@NgModule({
    declarations: [
        TimerComponent,
    ],
    imports: [
        IonicPageModule.forChild(TimerComponent),
    ],
    exports: [
        TimerComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TimerComponentModule { }
