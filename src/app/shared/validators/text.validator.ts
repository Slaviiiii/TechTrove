import { AbstractControl, ValidatorFn } from "@angular/forms";

export function textValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const textPattern = /^[a-zA-Z\s]*$/;
    const valid = textPattern.test(control.value);
    return valid ? null : { text: true };
  };
}
