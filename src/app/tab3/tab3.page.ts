import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { AlertsService } from '../services/alerts.service';
import { SaleService } from '../services/sale.service';
import * as pdfMake from 'pdfmake/build/pdfmake';

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
  isLargeScreen: boolean = true;
  sales: Sale[] = [];
  products: Product[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  productosFiltrados: any[] = [];

  constructor(
    private _productService: ProductsService,
    private alertService: AlertsService,
    private _saleService: SaleService
  ) {
    this._productService.getNewProduct.subscribe(product => {
      if (product) {
        this.getProducts();
        this.products.push(product);
      }
    });
    this.getProducts();
    this._saleService.getNewSale.subscribe(sale => {
      if (sale) {
        this.getSale();
        this.sales.push(sale);
      }
    });
    this.getSale();
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Productos:', this.products);
    this.productosFiltrados = this.products.filter((producto: any) => {
      const productName = producto.name.toLowerCase();
      console.log('Nombre del producto:', productName);
            return productName.includes(searchTerm);
    });
    console.log('Productos Filtrados:', this.productosFiltrados);
  }

  onDateChange() {
    console.log('Fecha de inicio:', this.fechaInicio);
    console.log('Fecha de fin:', this.fechaFin);

    this.getProducts();
  }

  onSwiper(swiper: any) {
    console.log(swiper);
  }




  getProductName(product_id: number): string | undefined {
    const product = this.products.find(product => product.id === product_id);
    return product ? product.name : 'Nombre no encontrado';
  }

  getImageForSale(saleProductId: number): string {
    const product = this.products.find(product => product.id === saleProductId);
    return product ? product.image : 'https://ionicframework.com/docs/img/demos/card-media.png';
  }

  getProducts() {
    this.products = [];
    this._productService.getProduct().subscribe((resp: any) => {

      this.products = resp.filter((producto: any) => {
        const productoExpiredDate = new Date(producto.expired);
        const fechaInicioDate = this.fechaInicio ? new Date(this.fechaInicio) : null;
        const fechaFinDate = this.fechaFin ? new Date(this.fechaFin) : null;

        if (fechaInicioDate && productoExpiredDate < fechaInicioDate) {
          return false;
        }

        if (fechaFinDate && productoExpiredDate > fechaFinDate) {
          return false;
        }

        return true;
      });

      console.log('Producto(s) que expiran en:', this.fechaInicio, this.products);
      console.log('Producto(s) que expiran en:', this.fechaFin, this.products);
      this.products.reverse();
    });
    this._saleService.getSale().subscribe((ventas: any[]) => {
      this.sales = ventas.filter((venta: any) => {
        const ventaDate = new Date(venta.created_at);
        const fechaInicioDate = this.fechaInicio ? new Date(this.fechaInicio) : null;
        const fechaFinDate = this.fechaFin ? new Date(this.fechaFin) : null;

        if (fechaInicioDate && ventaDate < fechaInicioDate) {
          return false;
        }

        if (fechaFinDate && ventaDate > fechaFinDate) {
          return false;
        }

        return true;
      });

      console.log('Ventas realizadas desde:', this.fechaInicio, this.sales);
      console.log('Ventas realizadas hasta:', this.fechaFin, this.sales);
      this.sales.reverse();
    });
  }


  getProductById(productId: string) {
    this._productService.getProduct().subscribe((resp: any) => {
      console.log('Products', resp);
      const productById = resp.find((product: any) => product.id === productId);

      if (productById) {
        console.log('Product by ID', productById);
      } else {
        console.log('Product not found');
      }
    });
  }

  getSale() {
    this.sales = []
    this._saleService.getSale().subscribe((resp: any) => {
      console.log('Ventas:', resp);
      this.sales = resp;
      this.sales.reverse();
    });
  }





  /**DESCARGAR VENTAS EN PDF */
  generatePDF(sales: any) {
    try {
      const documentDefinition = {
        content: [
          { text: 'Reporte de productos', style: 'header' },
          '\n\n',
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto'],
              body: [
                ['Nombre del producto', 'amount', 'total'],
                ...sales.map((p: any) => [this.getProductName(p.product_id), p.amount, p.total]),
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
        },
      };
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      this.alertService.generateToast({
        duration: 2000,
        color: 'success',
        icon: 'checkmark-circle',
        message: 'Reporte realizado',
        position: 'bottom',
      });
      pdfDocGenerator.download('Reporte_de_productos.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      this.alertService.generateToast({
        duration: 2000,
        color: 'danger',
        icon: 'close-circle',
        message: 'Error al generar el reporte',
        position: 'bottom',
      });
    }
  }
}
