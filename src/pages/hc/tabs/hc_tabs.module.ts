import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsLayoutModule } from '../../../components/tabs/tabs-layout.module';
import { HcTabsPage } from './hc_tabs';

@NgModule({
  declarations: [
    HcTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(HcTabsPage),
    TabsLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPageModule {}
