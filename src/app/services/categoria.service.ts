import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private URL = 'http://localhost:8000/api'

  getNewCategory: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  newCategory(datos: any) {
    return this.http.post(`${this.URL}/nuevaCategoria`, datos);
  }

  getCategories() {
    return this.http.get(`${this.URL}/categorias`);
  }

  //* Emitters
  setNewCategory(category: any) {
    this.getNewCategory.emit(category);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.URL}/eliminarCategoria/${id}`);
  }


}
