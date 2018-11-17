import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcFavoritesPage } from './hc_favorites';

@NgModule({
  declarations: [
    HcFavoritesPage,
  ],
  imports: [
    IonicPageModule.forChild(HcFavoritesPage),
  ],
})
export class HcFavoritesPageModule {}
