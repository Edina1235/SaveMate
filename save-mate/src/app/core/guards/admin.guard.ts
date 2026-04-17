import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { UserService } from '../services/user.service';
import { Role, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService,
              private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
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
              const role = (user as User).role;

              if (role === Role.Admin) {
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
