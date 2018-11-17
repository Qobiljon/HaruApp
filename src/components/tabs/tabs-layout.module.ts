import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsLayout } from './tabs-layout';

@NgModule({
    declarations: [
        TabsLayout,
    ],
    imports: [
        IonicPageModule.forChild(TabsLayout),
    ],
    exports: [
        TabsLayout
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TabsLayoutModule { }
