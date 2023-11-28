import { AbstractControl, ValidationErrors } from "@angular/forms";

export function priceVenta(ctrl: AbstractControl): ValidationErrors | null {
  const stock = ctrl?.get('stock')?.value;
  if (stock <= 0) {
    //console.log('no es valido');
    return ({ 'priceError': true });
  }
  return null;
}
