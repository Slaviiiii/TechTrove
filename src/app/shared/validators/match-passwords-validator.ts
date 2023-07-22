import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchPasswordValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get(controlName)?.value;
    const passwordToCompare = control.parent?.get(matchingControlName)?.value;
    if (password && passwordToCompare && password !== passwordToCompare) {
      return { matchPasswords: true };
    }
    return null;
  };
}
