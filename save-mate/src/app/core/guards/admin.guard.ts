import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { UserService } from '../services/user.service';
import { Role } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.afAuth.authState.pipe(
            take(1),
            map(user => {
              if(user) {
                /*const userRole = this.userService.getUser("").role;
                if(userRole === Role.Admin)
                  return true;*/
              }
              return false;
            })
          );
  }
  
}
