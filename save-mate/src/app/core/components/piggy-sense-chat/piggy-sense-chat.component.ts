import { Component } from '@angular/core';
import { AppUrl } from '../../enums/app-url.enum';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

@Component({
  selector: 'app-piggy-sense-chat',
  templateUrl: './piggy-sense-chat.component.html',
  styleUrls: ['./piggy-sense-chat.component.scss']
})
export class PiggySenseChatComponent {
  public showChat = true;
  public AppUrl = AppUrl;

  constructor(private router: Router,
              private dialog: MatDialog
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        const hiddenRoutes = [AppUrl.Questions];
        this.showChat = !hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }
}
