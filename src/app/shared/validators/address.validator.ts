import { AbstractControl, ValidatorFn } from "@angular/forms";

export function addressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const addressPattern = /^[^,]{3,}, \s*[^,]{3,}, \s*\d{4,5}$/;
    const valid = addressPattern.test(control.value);
    return valid ? null : { pattern: true };
  };
}
