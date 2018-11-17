import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashScreenLayout } from './splash-screen-layout';

@NgModule({
    declarations: [
        SplashScreenLayout,
    ],
    imports: [
        IonicPageModule.forChild(SplashScreenLayout),
    ],
    exports: [
        SplashScreenLayout
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SplashScreenLayoutModule { }