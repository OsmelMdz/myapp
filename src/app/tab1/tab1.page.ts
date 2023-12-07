import { Component, OnDestroy, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
register(); //Se debe importar en cada componente que se vayan a usar
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

import { SaleService } from '../services/sale.service';
import { ModalController, NavController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

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
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnDestroy{
  isLargeScreen: boolean = true;
  sales: Sale[] = [];
  products: Product[] = [];
  originalVentas: any[] = [];
  filtrosventas: Product[] = [];
  productosFiltrados: any[] = [];
  imgProduct: string = '';
  chartOptions!: ChartOptions;
  @ViewChild("chart") chart: ChartComponent | undefined;
  private _subscription: any;

  constructor(
    private _productService: ProductsService,
    private _saleService: SaleService,
    private navController: NavController,
    private modalCtrl: ModalController
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
    this._saleService.getProductMasVendido().subscribe((resp: any) => {
      this.filtrosventas = resp;
    })

    this._saleService.getSale().subscribe((resp: any) => {
      this.sales = resp;
      this.sales.reverse();
    })
    this.getSale();


    this._productService.getNewProduct.subscribe(product => {
      if (product) {
        this.getProducts();
        this.products.push(product);
      }
    });
    this.getProducts();

    this.obtenerDatosDeVentas();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  obtenerDatosDeVentas() {
    this._saleService.getSale().subscribe(
      (datosVentas: any[]) => {
        const datosAgrupados = this.agruparPorProducto(datosVentas);
        this.chartOptions = {
          series: [
            {
              name: "Ventas",
              data: datosAgrupados.map(venta => venta.amount)
            }
          ],
          chart: {
            height: 350,
            type: "bar"
          },
          title: {
            text: "Ventas Mensuales"
          },
          xaxis: {
            categories: datosAgrupados.map((venta, index) => `${this.getProductName(venta.product_id)}`)
          }
        };
      },
      error => {
        console.error('Error al obtener datos de ventas:', error);
      }
    );
  }

  agruparPorProducto(datosVentas: any[]): any[] {
    const datosAgrupados = [];
    const mapaAgrupado = new Map();

    datosVentas.forEach(venta => {
      const product_id = venta.product_id;
      if (mapaAgrupado.has(product_id)) {
        mapaAgrupado.get(product_id).amount += venta.amount;
      } else {
        mapaAgrupado.set(product_id, { ...venta });
      }
    });
    for (const [key, value] of mapaAgrupado) {
      datosAgrupados.push(value);
    }
    return datosAgrupados;
  }

  getProductName(product_id: number): string | undefined {
    const product = this.products.find(product => product.id === product_id);
    return product ? product.name : 'Nombre no encontrado';
  }

  getProducts() {
    this.products = []
    this._productService.getProduct().subscribe((resp: any) => {
      console.log('GetProductos:', resp);
      this.products = resp;
      this.products.reverse();
    })
  }

  getSale() {
    this.sales = []
    this._saleService.getSale().subscribe((resp: any) => {
      console.log('GetVentas:', resp);
      this.sales = resp;
      this.sales.reverse();
    })
  }

  getPmasV() {
    this.filtrosventas = []
    this._saleService.getProductMasVendido().subscribe((resp: any) => {
      console.log('GetProductosMasVendidos:', resp);
      this.filtrosventas = resp;
    })
  }

}
