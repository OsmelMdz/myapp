import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewProductComponent } from './new-product/new-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { HeaderComponent } from './header/header.component';
import { NewSaleComponent } from './new-sale/new-sale.component';



@NgModule({
  declarations: [
    NewProductComponent, ViewProductComponent, HeaderComponent, NewSaleComponent
  ],
  imports: [
    CommonModule, IonicModule, FormsModule, ReactiveFormsModule
  ],
  exports: [
    NewProductComponent, ViewProductComponent, HeaderComponent, NewSaleComponent
  ]
})
export class ComponentsModule { }
