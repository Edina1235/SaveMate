import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(word: string | undefined | null): unknown {
    if(word === undefined || word === null) return '';
    return word.charAt(0).toUpperCase();
  }

}
