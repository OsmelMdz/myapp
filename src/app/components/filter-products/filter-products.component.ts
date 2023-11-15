import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.scss'],
})
export class FilterProductsComponent implements OnInit {
  productos: any[] = [];
  myproducts: any[] = [];
  constructor(private popCtrl: PopoverController) { }

  ngOnInit() {
    console.log(this.productos);
  }

  selectProduct(p: any) {
    console.log("desde popover", p);
    this.popCtrl.dismiss({
      item: p
    })
  }

}
