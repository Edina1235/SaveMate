import { Component } from '@angular/core';
import { AppUrl } from '../../enums/app-url.enum';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public showFooter: boolean = true;
  public AppUrl = AppUrl;
}
