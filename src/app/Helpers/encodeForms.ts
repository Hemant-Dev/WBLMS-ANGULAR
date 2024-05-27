import { FormGroup } from '@angular/forms';

export default class EncodeForms {
  static encodeAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      const encodedControl = TextEncoder;
    });
  }
}
