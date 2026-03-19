import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-monogram',
  templateUrl: './monogram.component.html',
  styleUrls: ['./monogram.component.scss']
})
export class MonogramComponent implements OnInit {
  @Input() firstName: string = "Edina";
  @Input() lastName: string = "Tóth";
  @Input() fontsize?: string;

  ngOnInit(): void {
      console.log(this.fontsize, this.lastName, this.firstName);
  }
}
