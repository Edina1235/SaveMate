import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-monogram',
  templateUrl: './monogram.component.html',
  styleUrls: ['./monogram.component.scss']
})
export class MonogramComponent {
  @Input() firstName: string = "Edina";
  @Input() lastName: string = "Tóth";
  @Input() fontsize?: string;
}
