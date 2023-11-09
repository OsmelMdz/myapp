import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductsService } from 'src/app/services/products.service';
import { priceValid } from './price.validator';
import { AlertsService } from 'src/app/services/alerts.service';
import { caducidadValid } from './caducidad.validator';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit {
  imgProduct = './assets/add.png';
  currentFile?: any[] = [];
  formProduct!: FormGroup;
  categorias: any[] = [];
  caduca: boolean = false;
  edit: boolean = false;
  productId = 0;

  constructor(
    private modalCtrl: ModalController,
    private compressImg: NgxImageCompressService,
    private fb: FormBuilder,
    private productServ: ProductsService,
    private categoryService: CategoriaService,
    private alertService: AlertsService,
    private nParams: NavParams) {
    let info = this.nParams.get('datakey');

    if (info) {
      this.edit = true;
      this.productId = info.id; // Asigna el ID del producto
      this.imgProduct = info.image;
      this.titulo = 'Editar Producto';
    }
    console.log(info);
    this.getCategorias();
    this.formProduct = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50),
      Validators.minLength(1)]],
      price: [0, Validators.required],
      price_sale: [0, Validators.required],
      stock: [0, Validators.required],
      expired: [null],
      image: [''],
      category_id: [0, Validators.required],
    }, {
      validators: [priceValid, caducidadValid]
    })
    this.formProduct.reset(info);
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  addCaducidad() {
    this.caduca = !this.caduca;
  }

  getCategorias() {
    this.categoryService.getCategories().subscribe((resp: any) => {
      this.categorias = resp;
    })
  }

  ngOnInit() { }

  validaCtrl(control: string) {
    return !!this.formProduct.get(control)?.errors && this.formProduct.get(control)?.touched
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

  titulo = 'Nuevo Producto';

  validarPrecio() {
    return !!this.formProduct?.errors?.['priceError'];
  }

  validarExpired() {
    return !!this.formProduct?.errors?.['expiredError'];
  }

  imageProduct(ev: any) {
    console.log(ev);
    this.compressImg.uploadFile().then(({ image, orientation }) => {
      this.generarURL(image);
      const blob = this.dataURItoBlob(image);
      this.currentFile![0] = blob;
    })
  }

  generarURL(image: any) { //solo genera la url para poder mostrarla
    const byteString = atob(image.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: '' });
    // Crear la URL de la imagen
    const imageUrl = URL.createObjectURL(blob);
    console.log(imageUrl);
    // Utilizar la URL de la imagen
    this.imgProduct = imageUrl;
    document.getElementById("imgProd")?.setAttribute(
      'src', imageUrl);
    //this.formGroup.get('image').patchValue(imageUrl)
  }

  dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString })
  }

  submit() {
    console.log(this.formProduct.errors);
    const formdata = new FormData();
    let data = this.formProduct.getRawValue();
    for (const dataKey in data) {
      formdata.append(dataKey, data[dataKey]);
    }
    if (this.currentFile) {
      formdata.append('image', this.currentFile[0]);
    }
    console.log('Formdata', formdata);
    if (this.edit) {
      console.log('Actualizar producto');
      this.productServ.newProduct(formdata).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          this.productServ.setNewProduct(resp);
          this.alertService.generateToast({
            duration: 2000,
            color: 'success',
            icon: 'checkmark-circle',
            message: 'Producto creado',
            position: 'top',
          });
          this.modalCtrl.dismiss();
          this.formProduct.reset();
        }
      });
    } else {
      this.productServ.updateProduct(formdata, this.productId).subscribe(
        (resp: any) => {
          console.log(resp);
          if (resp) {
            this.productServ.setNewProduct(resp);
            this.alertService.generateToast({
              duration: 2000,
              color: 'success',
              icon: 'checkmark-circle',
              message: 'Producto actualizado',
              position: 'top',
            });
            this.modalCtrl.dismiss();
            this.formProduct.reset();
          }
        }
      );
    }
  }

}
