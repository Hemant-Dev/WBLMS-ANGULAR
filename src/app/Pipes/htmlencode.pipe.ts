import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hTMLEncode',
})
export class HTMLEncodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
