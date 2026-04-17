import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {

    return this.afAuth.authState.pipe(
          take(1),
          switchMap(user => {
            if (!user) {
              this.router.navigateByUrl('/login');
              return of(false);
            }
    
            return this.userService.getUser(user.uid).pipe(
              map(user => {
                if (user) {
    
                  if ((user as User).topSpendingCategories.length === 0) {
                    return true;
                  }
                }
    
                this.router.navigateByUrl('/');
                return false;
              })
            );
          })
        );
      }
}
