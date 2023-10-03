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
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
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
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
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
      imagen: 'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg'
    },
    {
      id: 3,
      imagen: 'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg'
    }
  ]

  productos: product[] = [
    {
      codigo: 'qwrw',
      description: 'assssdaf',
      id: 1,
      imagen: 'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg',
      name: 'tele',
      precio: 500,
      state: true,
      stock: 2
    },
    {
      codigo: 'jksd',
      description: 'assssdaf',
      id: 2,
      imagen: 'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg',
      name: 'camisa',
      precio: 500,
      state: true,
      stock: 5
    },
    {
      codigo: 'abcd',
      description: 'assssdaf',
      id: 3,
      imagen: 'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg',
      name: 'telefono',
      precio: 100,
      state: true,
      stock: 0
    },
    {
      codigo: 'qwrw',
      description: 'assssdaf',
      id: 4,
      imagen: 'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg',
      name: 'audifonos sony',
      precio: 750,
      state: true,
      stock: 10
    }
  ]
}
