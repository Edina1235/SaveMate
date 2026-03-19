import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(word: string): unknown {
    return word.charAt(0).toUpperCase();
  }

}
