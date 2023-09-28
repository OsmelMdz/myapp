import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
register(); //Se debe importar en cada componente que se vayan a usar


interface productSlide {
  id: number,
  imagen: string,
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {}

  swiperSlideChanged(e: any) {
    console.log('Changed', e);
  }

  titulo = 'Sistema de Inventario';

  masVendidos:productSlide[] = [
    {
      id: 1,
      imagen:'https://www.lg.com/mx/images/televisores/md07548054/gallery/DZ-06_v1.jpg'
    },
    {
      id: 2,
      imagen:'https://elcomercio.pe/resizer/znfxKJ7_V7ZwfYvp-WXIq_c_vf4=/1200x900/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/4WZRKAOCFBFVVOAMMWMMOUXYNQ.jpg'
    },
    {
      id: 3,
      imagen:'https://www.sony.com.mx/image/4658a5b0d99da9d0dbecc7a7edaccdca?fmt=png-alpha&wid=720'
    }
  ]

}
