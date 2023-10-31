import { AbstractControl, ValidationErrors } from "@angular/forms";

export function priceValid(ctrl: AbstractControl): ValidationErrors | null {
  const price = ctrl?.get('price')?.value;
  const priceV = ctrl?.get('price_sale')?.value;
  if (priceV <= price) {
    //console.log('no es valido');
    return ({ 'priceError': true });
  }
  return null;
}
