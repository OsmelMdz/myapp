import { Component, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
register(); //Se debe importar en cada componente que se vayan a usar
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

interface productSlide {
  id: number,
  imagen: string,
}

interface product {
  id: number,
  precio: number,
  name: string,
  stock: number,
  description: string,
  state: boolean,
  imagen: string,
  codigo: string,
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 50]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Ventas"
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep","Oct"]
      }
    };
  }





  masVendidos: productSlide[] = [
    {
      id: 1,
      imagen: 'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg'
    },
    {
      id: 2,
      imagen: 'https://www.telcel.com/medias/iPhone15GreenDual-515Wx515H.png?context=bWFzdGVyfGltYWdlc3wyMzE4MjJ8aW1hZ2UvcG5nfGltYWdlcy9oODUvaDJhLzg5MTY2MzA3NjU1OTgucG5nfGI5NDgzYTY0NGVkODBkNTgxMzg2YzBkMDUzZmQ5MjAxNDYxOTc5M2JiZjEzNjQ1ZGU0ZWIyYmM5NmFlMzA3YTk'
    },
    {
      id: 3,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_776741-MLA46980851700_082021-F.webp'
    }
  ]

  productos: product[] = [
    {
      codigo: 'qwrw',
      description: 'assssdaf',
      id: 1,
      imagen: 'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg',
      name: 'smartTV',
      precio: 500,
      state: true,
      stock: 2
    },
    {
      codigo: 'jksd',
      description: '15',
      id: 2,
      imagen: 'https://www.telcel.com/medias/iPhone15BlackDual-515Wx515H.png?context=bWFzdGVyfGltYWdlc3wyMDQ5MTR8aW1hZ2UvcG5nfGltYWdlcy9oODYvaDFmLzg5MTY2MzA2MzQ1MjYucG5nfDY5NGVmYWY2MjliNGEzYTcwNzY5NjZlNzM2ZmFhMDU0MjRjMjA4YzAyZDlkMjg4NWFlNWQzNzk3YTg1ODNhN2Q',
      name: 'iphone',
      precio: 500,
      state: true,
      stock: 5
    },
    {
      codigo: 'abcd',
      description: 'sony',
      id: 3,
      imagen: 'https://www.sony.com.mx/image/4658a5b0d99da9d0dbecc7a7edaccdca?fmt=png-alpha&wid=720',
      name: 'Audifonos',
      precio: 100,
      state: true,
      stock: 0
    },
    {
      codigo: 'qwrw',
      description: '2500 ml',
      id: 4,
      imagen: 'https://panoli.mx/cdn/shop/products/7441003500907-1-scaled_1788x.jpg?v=1639607192',
      name: 'Coca-Cola',
      precio: 750,
      state: true,
      stock: 10
    }
  ]
}
