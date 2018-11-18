import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SplashScreenLayoutModule } from "../../components/splash-screen/splash-screen-layout.module";
import { SplashPage } from "./splash";

@NgModule({
  declarations: [SplashPage],
  imports: [IonicPageModule.forChild(SplashPage), SplashScreenLayoutModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SplashPageModule {}
