import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
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
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent  implements OnInit {
  productos: any[] = [];
  myproducts: any[] = [];

  products: Product[] = [];
  constructor(
    private _productService: ProductsService,private popCtrl: PopoverController, private modalCtrl: ModalController) {

    this.getProducts();
   }

   getProducts() {
    this.products = []
    this._productService.getProduct().subscribe((resp: any) => {
      console.log('Products', resp);
      this.products = resp;
      this.products.reverse();
    })
  }

  ngOnInit() {
    console.log(this.productos);
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


  selectProduct(p: any) {
    console.log("desde popover", p);
    this.popCtrl.dismiss({
      item: p
    })
  }

  async close(){
    await this.modalCtrl.dismiss();
  }

  titulo = 'Detalles del Producto';

}
