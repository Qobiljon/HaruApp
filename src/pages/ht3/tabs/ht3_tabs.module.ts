import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsLayoutModule } from '../../../components/tabs/tabs-layout.module';
import { Ht3TabsPage } from './ht3_tabs';

@NgModule({
  declarations: [
    Ht3TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(Ht3TabsPage),
    TabsLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ht3TabsPageModule {}
