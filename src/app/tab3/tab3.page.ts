import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CategoriaService } from '../services/categoria.service';
import { ProductsService } from '../services/products.service';
import { AlertsService } from '../services/alerts.service';
import { SaleService } from '../services/sale.service';

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

interface Sale {
  id: number;
  product_id: number;
  quantity: number;
  total: number;
  amount: number;
}


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  getProductImage(arg0: number) {
    throw new Error('Method not implemented.');
  }

  titulo = 'Mis productos';
  categories: any[] = [];
  vermas = true;
  filtrocategories: any[] = [];
  isLargeScreen: boolean = true;
  sales: Sale[] = [];
  products: Product[] = [];


  constructor(
    private modalCtrl: ModalController,
    private _categoryService: CategoriaService,
    private _productService: ProductsService,
    private alertsService: AlertsService,
    private alertController: AlertController,
    private _saleService: SaleService
  ) {
    this._saleService.getNewSale.subscribe(sale => {
      if (sale) {
        // Actualiza el producto existente en la lista con la nueva información de stock
        const updatedProductIndex = this.products.findIndex(product => product.id === sale.product.id);

        if (updatedProductIndex !== -1) {
          this.products[updatedProductIndex].stock = sale.product.stock;
        } else {
          // Si no se encuentra el producto en la lista, puedes agregarlo
          this.products.push(sale.product);
        }
      }
    });
    this._productService.getNewProduct.subscribe(product => {
      if (product) {
        this.getProducts();
        this.products.push(product);
      }
    });
    this.getSale();
    this.getProducts();
  }

  onSearchChange() {
  }

  getProductName(product_id: number): string | undefined {
    const product = this.products.find(product => product.id === product_id);
    return product ? product.name : 'Nombre no encontrado';
  }

  getImageForSale(saleProductId: number): string {
    const product = this.products.find(product => product.id === saleProductId);
    return product ? product.image : 'https://ionicframework.com/docs/img/demos/card-media.png';
  }

  getSale() {
    this.sales = []
    this._saleService.getSale().subscribe((resp: any) => {
      console.log('Sales', resp);
      this.sales = resp;
      this.sales.reverse();
    })
  }

  getProducts() {
    this.products = []
    this._productService.getProduct().subscribe((resp: any) => {
      console.log('Products', resp);
      this.products = resp;
      this.products.reverse();
    })
  }

  getProductById(productId: string) {
    this._productService.getProduct().subscribe((resp: any) => {
      console.log('Products', resp);

      // Buscar el producto por ID en la respuesta
      const productById = resp.find((product: any) => product.id === productId);

      if (productById) {
        console.log('Product by ID', productById);
        // Aquí puedes realizar las acciones que desees con el producto encontrado
      } else {
        console.log('Product not found');
        // Puedes manejar el caso en que el producto no sea encontrado
      }
    });
  }


}
