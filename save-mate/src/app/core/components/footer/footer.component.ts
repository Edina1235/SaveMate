import { Component, OnInit } from '@angular/core';
import { AppUrl } from '../../enums/app-url.enum';
import { map, switchMap } from 'rxjs';
import { Role, User } from '../../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public showFooter: boolean = true;
  public AppUrl = AppUrl;
  public isAdminShow: boolean = false;

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService) {}

  ngOnInit(): void {
      this.afAuth.authState.pipe(
        switchMap(user => this.userService.getUser(user!.uid)),
        map(user => (user as User).role === Role.Admin)
      ).subscribe({next: (isAdmin) => {
        this.isAdminShow = isAdmin;
      }, error: (err) => {
        console.error("Error fetching user data: ", err);
      }});
  }
}
