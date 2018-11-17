import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsLayoutModule } from '../../../components/tabs/tabs-layout.module';
import { Ht1TabsPage } from './ht1_tabs';

@NgModule({
  declarations: [
    Ht1TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(Ht1TabsPage),
    TabsLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ht1TabsPageModule {}
