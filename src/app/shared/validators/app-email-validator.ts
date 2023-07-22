import { ValidatorFn } from "@angular/forms";

export function appEmailValidator(): ValidatorFn {
  const regExp = new RegExp(`[^@]{5,}@(gmail\.com|abv\.bg)$`);

  return (control) => {
    return control.value === "" || regExp.test(control.value)
      ? null
      : { appEmailValidator: true };
  };
}
