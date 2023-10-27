import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
})
export class NewCategoryComponent implements OnInit {

  formCategory!: FormGroup;
  colores = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];
  nombreCategoria: string = '';
  colorCategoria: string = 'primary';
  estadoCategoria: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private _categoryService: CategoriaService,
    private fb: FormBuilder,
    private alertService: AlertsService
  ) {
    this.formCategory = this.fb.group({
      name: [null, Validators.required],
      color: [null, Validators.required]
    });
  }

  ngOnInit() { }

  async close() {
    await this.modalCtrl.dismiss();
  }

  Validators(control: string) {
    return !!this.formCategory.get(control)?.errors && this.formCategory.get(control)?.touched;
  }

  titulo = 'Nueva Categoría';

  submit() {
    console.log(this.formCategory.value);
    if (this.formCategory.invalid){
      this.formCategory.markAllAsTouched();
      return
    }

    const data = this.formCategory.value;
    this._categoryService.newCategory(data).subscribe(res => {
      console.log(res);
      if(res){
        //* Seteamos el emmitter
        this._categoryService.setNewCategory(res);
        this.alertService.generateToast({
          duration:800,  color: 'success', icon: 'checkmark-circle', message: 'Categoria creada', position: 'top'
          });
          this.formCategory.reset();
      }
    });
  }
}
