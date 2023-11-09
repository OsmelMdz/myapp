import { Component, HostListener } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { NewProductComponent } from '../components/new-product/new-product.component';
import { ViewProductComponent } from '../components/view-product/view-product.component';
import { NewSaleComponent } from '../components/new-sale/new-sale.component';
import { NewCategoryComponent } from '../components/new-category/new-category.component';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductsService } from '../services/products.service';
import { AlertsService } from '../services/alerts.service';
import { FilterProductsComponent } from '../components/filter-products/filter-products.component';

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
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  titulo = 'Mis productos';
  categories: any[] = [];
  products: Product[] = [];
  vermas = true;
  filtrocategories: any[] = [];

  isLargeScreen: boolean = true; // Inicialmente asumimos que la pantalla es grande

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize(); // Verificar el tamaño de la pantalla al cargar el componente
  }

  checkScreenSize() {
    // Obtener el ancho de la ventana
    const windowWidth = window.innerWidth;

    // Definir isLargeScreen en función del ancho de la ventana
    this.isLargeScreen = windowWidth >= 768; // Puedes ajustar el valor según tus necesidades
  }

  constructor(
    private modalCtrl: ModalController,
    private _categoryService: CategoriaService,
    private _productService: ProductsService,
    private alertsService: AlertsService,
    private alertController: AlertController,
    private popCtrl: PopoverController
  ) {
    this._categoryService.getNewCategory.subscribe(category => {
      if (category) {
        this.categories.push(category);
      }
    });
    this._productService.getNewProduct.subscribe(product => {
      if (product) {
        this.getProducts();
        this.products.push(product);
      }
    });
    this.getProducts();
    this.getCategorias();
  }

  onSearchChange(e: any) {
    console.log(e.detail.value);
    this.presentPopover(e.detail.value);
  }

  async presentPopover(data: any) {
    const pop = await this.popCtrl.create({
      component: FilterProductsComponent,
      event: data,
      side: 'right',
      componentProps: {
        productos: data
      }
    });
    await pop.present();
  }



  verMas() {
    this.vermas = false;
    this.categories = this.filtrocategories;
  }

  verMenos() {
    this.vermas = true
    this.categories = this.categories.slice(0, 4);
  }

  getCategorias() {
    this.categories = []
    this._categoryService.getCategories().subscribe((res: any) => {
      console.log('Categoria', res);
      this.filtrocategories = res;
      this.categories = res;
      this.categories = this.categories.slice(0, 4);
    });
  }

  async deleteProduct(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar producto',
      message: '¿Estás seguro de que quieres eliminar este producto?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Si',
          cssClass: 'alert-button-confirm',
          handler: () => {
            const observable = this._productService.deleteProductById(id);
            observable.subscribe((response) => {
              console.log('Producto eliminado correctamente');
              this.alertsService.generateToast({
                duration: 2000, color: 'success', icon: 'checkmark-circle', message: 'Producto eliminado', position: 'top'
              });
              this.getProducts();
            }, (error) => {
              console.log('No se pudo eliminar el producto');
              this.alertsService.generateToast({
                duration: 2000, color: 'danger', icon: 'warning', message: 'No se pudo eliminar el producto', position: 'top'
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }

  /* deleteProduct(id: number) {
    const observable = this._productService.deleteProductById(id);
    observable.subscribe((response) => {
      console.log('Producto eliminado correctamente');
      this.alertsService.generateToast({
        duration: 2000, color: 'success', icon: 'checkmark-circle', message: 'Producto eliminado', position: 'top'
      });
      this.getProducts();
    }, (error) => {
      console.log('No se pudo eliminar el producto');
      this.alertsService.generateToast({
        duration: 2000, color: 'danger', icon: 'warning', message: 'No se pudo eliminar el producto', position: 'top'
      });
    });
  } */


  getProducts() {
    this.products = []
    this._productService.getProduct().subscribe((resp: any) => {
      console.log('Products', resp);
      this.products = resp;
      this.products.reverse();
    })
  }

  categorias = ['Abarrotes', 'Frutas y verduras', 'Limpieza', 'Vinos y licores', 'Especias', 'Golosinas']




  async openNewProduct() {
    const modal = await this.modalCtrl.create({
      component: NewProductComponent,
      mode: 'ios'
    });
    await modal.present();
  }

  async openViewProduct() {
    const modal = await this.modalCtrl.create({
      component: ViewProductComponent,
      mode: 'ios'
    });
    await modal.present();
  }

  async openNewSale() {
    const modal = await this.modalCtrl.create({
      component: NewSaleComponent,
      mode: 'ios',
      initialBreakpoint: .4,
      backdropDismiss: false,
    });
    await modal.present();
  }

  async openNewCategory() {
    const modal = await this.modalCtrl.create({
      component: NewCategoryComponent,
      mode: 'ios',
      initialBreakpoint: .4,
      backdropDismiss: false,
    });
    await modal.present();
  }

  async openEditProduct(prod: any) {
    const modal = await this.modalCtrl.create({
      component: NewProductComponent,
      mode: 'ios',
      componentProps: { datakey: prod },
    });
    await modal.present();
  }

  onClick() {
    console.log('Holaaaa');
  }

}
