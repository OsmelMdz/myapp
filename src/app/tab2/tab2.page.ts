import { Component, HostListener } from '@angular/core';
import { AlertController, ModalController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { NewProductComponent } from '../components/new-product/new-product.component';
import { ViewProductComponent } from '../components/view-product/view-product.component';
import { NewSaleComponent } from '../components/new-sale/new-sale.component';
import { NewCategoryComponent } from '../components/new-category/new-category.component';
import { CategoriaService } from 'src/app/services/categoria.service';
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
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
[x: string]: any;

  productosFiltrados: any[] = [];
  originalProducts: any[] = [];
  info: any;
  titulo = 'Mis productos';
  categories: any[] = [];
  products: Product[] = [];
  vermas = true;
  filtrocategories: any[] = [];
  isLargeScreen: boolean = true; // Inicialmente asumimos que la pantalla es grande
  salesFiltrados: any[] = [];
  originalVentas: any[] = [];
  filtrosventas: any[] = [];
  sales: Sale[] = [];
  cantidad: number = 0;
  chip: any[] = [];
  busquedaRealizada: boolean = false;
  selectedProduct: any = null;
  stock: Product[] = []; // Este valor debe ser dinámico según tu lógica de negocio
  productId = 0;
  price_sale: number = 0;
  busquedaP: any[] = [];
  profuctoslist: Product[] = [];

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
    private _saleService: SaleService,
  ) {
    this._saleService.getNewSale.subscribe(sale => {
      if (sale) {
        const updatedProductIndex = this.products.findIndex(product => product.id === sale.product.id);

        if (updatedProductIndex !== -1) {
          this.products[updatedProductIndex].stock = sale.product.stock;
        } else {
          this.products.push(sale.product);
        }
      }
    });
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
      console.log('GetCategorias:', res);
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

  filtrarporcat(category: any) {
    this.productosFiltrados = this.originalProducts.filter((prod) => prod.category_id === category.id);
    this.products = this.productosFiltrados;
    console.log('Productos filtrados:', this.productosFiltrados);
  }

  getProducts() {
    this.products = []
    this._productService.getProduct().subscribe((resp: any) => {
      console.log('GetProductos:', resp);
      this.profuctoslist = resp;
      this.products = resp;
      this.products.reverse();
      this.originalProducts = resp;
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

  eliminarfiltro(){
    //this.categories = [];
    this.getProducts();
  }

  eliminarCategoria(id: number) {
    const observable = this._categoryService.deleteCategory(id);
    observable.subscribe((response) => {
      console.log('Categoria eliminada correctamente');
      this.alertsService.generateToast({
        duration: 2000, color: 'success', icon: 'checkmark-circle', message: 'Categoria eliminada', position: 'top'
      });
      this.getCategorias();
    }, (error) => {
      console.log('No se pudo eliminar la categoria');
      this.alertsService.generateToast({
        duration: 2000, color: 'danger', icon: 'warning', message: 'No se pudo eliminar la categoria', position: 'top'
      });
    });
  }

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
      initialBreakpoint: .5,
      backdropDismiss: false,
    });
    await modal.present();
  }

  async openNewCategory() {
    const modal = await this.modalCtrl.create({
      component: NewCategoryComponent,
      mode: 'ios',
      initialBreakpoint: .5,
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

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Productos:', this.products);
    this.busquedaP = this.products.filter((producto: any) => {
      const productName = producto.name.toLowerCase();
      console.log('Nombre del producto:', productName);
      return productName.includes(searchTerm);

    });
    console.log('Productos Filtrados:', this.busquedaP);
  }

  getProductName(product_id: number): string | undefined {
    const product = this.products.find(product => product.id === product_id);
    return product ? product.name : 'Nombre no encontrado';
  }

}
