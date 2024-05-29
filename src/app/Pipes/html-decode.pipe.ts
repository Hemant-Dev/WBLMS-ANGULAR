import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlDecode',
})
export class HtmlDecodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
}
