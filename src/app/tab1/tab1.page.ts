import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
register(); //Se debe importar en cada componente que se vayan a usar


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

  constructor() { }

  titulo = 'Sistema de Inventario';

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
