import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  token: string;
  prefix: string;
  rol: string;
  constructor(private authService: AuthService, private router: Router) {
    this.token = localStorage.getItem('token');
    this.prefix = localStorage.getItem('prefix');
    this.rol = localStorage.getItem('role');

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          if (this.token.length == 0 || this.prefix.length == 0 || this.rol.length == 0) {
            this.router.navigate(['/ingresar']);
            return false;
          }
        }

        this.authService.carga();
        return true;
      })

    );
  }
}