import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { FilterProductsComponent } from '../filter-products/filter-products.component';
import { ProductsService } from 'src/app/services/products.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { priceVenta } from './priceventa.validator';
import { AlertsService } from 'src/app/services/alerts.service';
import { SaleService } from 'src/app/services/sale.service';
import { catchError } from 'rxjs/operators';
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
  cantidad: number = 0;
  chip: any[] = [];
  products: Product[] = [];
  busquedaRealizada: boolean = false;
  selectedProduct: any = null;
  formProduct!: FormGroup;
  formSale!: FormGroup;
  stock: Product[] = []; // Este valor debe ser dinámico según tu lógica de negocio
  productId = 0;
  price_sale: number = 0;
  info: any;
  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private popCtrl: PopoverController,
    private _productService: ProductsService,
    private fb: FormBuilder,
    private alertService: AlertsService,
    private nParams: NavParams,
    private saleS: SaleService
  ) {

    let info = this.nParams.get('datakey');


    if (info) {
      this.productId = info.id;
      this.price_sale = info.price_sale;
    }
    this.saleS.getNewSale.subscribe((sale: any) => {
      this.products = sale;
    });
    this.getProducts();
    this.formSale = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      total: [0],
      profit: [0],
      product_id: [0, Validators.required],
    }, {
      validators: [priceVenta]
    });


  }


  validarChip() {
    return !!this.formProduct?.errors?.['chipError'];
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

    if (filtrados.length > 0) {
      this.info = filtrados[0];
      this.selectedProduct = this.info;
      this.busquedaRealizada = true;

      const searchbar: any = document.querySelector('ion-searchbar');
      if (searchbar) {
        searchbar.disabled = true;
      }
    } else {
      this.info = null;
    }
    this.presentPopover(filtrados);
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
      this.chip.push(info.data.item);
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

  compra() {
    const sale = this.formSale.value;
    console.log(sale);
    if (!this.info || this.formSale.invalid) {
      this.formSale.markAllAsTouched();
      return;
    }
    console.log('Información del Producto:', this.info);
    this.saleS.newSale({
      amount: sale.amount,
      total: sale.total,
      profit: sale.profit,
      product_id: this.info.id
    })
    .pipe(
      catchError(error => {
        console.error('Error en la llamada al servicio:', error);
        this.alertService.generateToast({
          duration: 2000,
          color: 'danger',
          icon: 'alert-circle',
          message: 'Error al realizar la venta. Por favor, inténtalo de nuevo.',
          position: 'top',
        });
        return [];
      })
    )
    .subscribe(res => {
      console.log(res);
      if (res) {
        this._productService.setNewProduct(res);
        this.alertService.generateToast({
          duration: 2000,
          color: 'success',
          icon: 'checkmark-circle',
          message: 'Venta realizada',
          position: 'top',
        });
        this.close();
        this.modalCtrl.dismiss();
        this.formSale.reset();
      }
    });
  }
}
