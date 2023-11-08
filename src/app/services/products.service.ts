import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private URL = 'http://localhost:8000/api';

  getNewProduct: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  //* Nuevo Producto */
  newProduct(datos: any){
    return this.http.post(`${this.URL}/nuevoProducto`, datos)
  }
  //* Obtener Producto */
  getProduct(){
    return this.http.get(`${this.URL}/productos`)
  }

  setNewProduct(product:any){
    this.getNewProduct.emit(product);
  }
  //* Eliminar Producto pero solo desactivando el state de 1 a 0 */
  deleteProductById(id: number) {
    return this.http.delete(`${this.URL}/eliminarProducto/${id}`)
  }
  //* Actualizar Producto */
  updateProduct(datos: any, id: number) {
    return this.http.post(`${this.URL}/actualizarProducto/${id}`, datos)
  }
}
