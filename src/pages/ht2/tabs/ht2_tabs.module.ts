import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsLayoutModule } from '../../../components/tabs/tabs-layout.module';
import { Ht2TabsPage } from './ht2_tabs';

@NgModule({
  declarations: [
    Ht2TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(Ht2TabsPage),
    TabsLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ht2TabsPageModule {}
