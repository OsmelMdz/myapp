import { AbstractControl, ValidationErrors } from "@angular/forms";
import * as moment from 'moment';


export function caducidadValid(ctrl: AbstractControl): ValidationErrors | null {
  const caducidad = ctrl?.get('expired')?.value;
  console.log('Caducidad',caducidad);

  const fechaCaducidad = moment(caducidad);
  const hoy = moment().format();
  const fechaAnterior = fechaCaducidad.isBefore(hoy);
  console.log('Fecha Anterior: ', fechaAnterior);
  if(fechaAnterior){
    return ({'expiredError':true});
  }
  return (null);
}
