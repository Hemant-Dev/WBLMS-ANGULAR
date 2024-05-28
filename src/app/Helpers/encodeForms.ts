import { FormGroup } from '@angular/forms';
import { HTMLEncodePipe } from '../Pipes/htmlencode.pipe';

export class EncodeForms {
  static encodeAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field)?.value;
      const encodedControl = this.htmlEncode(control);
      formGroup.patchValue({
        field: this.htmlEncode(control),
      });
      console.log(formGroup.value);
    });
  }
  static htmlEncode(value: string) {
    if (!value) return value;
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  static htmlDecode(value: string): string {
    if (!value) return value;
    return value
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
}
