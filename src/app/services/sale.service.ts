import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs=pdfFonts.pdfMake.vfs;


@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private URL = 'http://localhost:8000/api';

  getNewSale: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  newSale(datos: any): Observable<any> {
    return this.http.post(`${this.URL}/nuevaVenta`, datos);
  }

  //* Obtener Venta */
  getSale(): Observable<any> {
    return this.http.get(`${this.URL}/ventas`);
  }

  //*Emmitters
  setNewSale(sale: any) {
    this.getNewSale.emit(sale);
  }

  getProductMasVendido(): Observable<any> {
    return this.http.get(`${this.URL}/productosmasvendidos`);
  }

}
