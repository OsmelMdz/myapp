import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, ToastController } from '@ionic/angular';
import { FilterProductsComponent } from '../filter-products/filter-products.component';
import { ProductsService } from 'src/app/services/products.service';
interface Product {
  id: number;
  name: string;
  price: number;
  price_sale: number;
  stock: number;
  expide: string;
  image: string;
  category_id: number;
  state: boolean;
}
@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss'],
})
export class NewSaleComponent implements OnInit {
  products: Product[] = [];
  chip: any[] = [];
  busquedaRealizada: boolean = false;
  selectedProduct: any = null;
  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private popCtrl: PopoverController,
    private _productService: ProductsService
  ) {
    this._productService.getNewProduct.subscribe(product => {
      (prod: any) => {
        this.products = prod;
      }
    });
    this.getProducts();
  }

  ngOnInit() { }

  async close() {
    await this.modalCtrl.dismiss();
  }

  getProducts() {
    this.products = []
    this._productService.getProduct().subscribe((resp: any) => {
      console.log('Products', resp);
      this.products = resp;
      this.products.reverse();
    })
  }

  async onSearchChange(e: any) {
    const busqueda = e.detail.value;

    if (!busqueda || busqueda.trim() === '') {
      console.log('Búsqueda vacía');
      const toast = await this.toastCtrl.create({
        message: 'Búsqueda vacía',
        color: 'warning',
        icon: 'help',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      return;
    }

  if (this.chip.some(item => item.name.toLowerCase() === busqueda.toLowerCase())) {
    console.log('El producto ya está en el chip. No se permite buscar más.');
    return;
  }

    const filtrados: any[] = this.products.filter(
      prod => prod.name.toLowerCase().includes(
        busqueda.toLowerCase()));

    this.presentPopover(filtrados);
    this.selectedProduct = filtrados[0];
    this.busquedaRealizada = true;

    const searchbar: any = document.querySelector('ion-searchbar');
    if (searchbar) {
      searchbar.disabled = true;
    }
  }

  resetSearch() {
    this.busquedaRealizada = false;
    this.selectedProduct = null;
    const searchbar: any = document.querySelector('ion-searchbar');
    if (searchbar) {
      searchbar.disabled = false;
    }
  }

  async presentPopover(data: any) {
    if (data.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Lo sentimos, el producto no existe.',
        color: 'danger',
        icon: 'ban',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      return;
    }
    const pop = await this.popCtrl.create({
      component: FilterProductsComponent,
      event: data,
      side: 'right',
      componentProps: {
        productos: data
      }
    });
    await pop.present();
    const info = await pop.onWillDismiss();
    if (info) {
      console.log('si llego la info', info);
      this.chip.push(info.data.item.name);
      const toast = await this.toastCtrl.create({
        message: 'Producto encontrado.',
        color: 'success',
        icon: 'checkmark',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  titulo = 'Nueva Venta';

}
