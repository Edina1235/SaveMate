import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSpace'
})
export class ThousandSpacePipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    if (value == null || value === undefined) return '';

    return value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

}
