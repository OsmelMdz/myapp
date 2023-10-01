import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgApexchartsModule } from "ng-apexcharts";
import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    NgApexchartsModule,
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
