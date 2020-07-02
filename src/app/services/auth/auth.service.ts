import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiUrl } from '../../globals';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  mensaje: string;
  
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  
  token: any;

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string): Promise<any> {
    //Por ahora aquí haremos el login, no sé si se vaya a cambiar a otro servicio
 
    return new Promise((ok, error) => {
      this.http.post(ApiUrl + 'login',
        {
          username: username,
          password: password
        },
        {
          responseType: 'json'
        })
        .toPromise()
        .then(response => {
          ok(response);
          this.token = response;
          this.jwtSave(this.token.token);
          this.prefijoSave(this.token.prefix);
          this.roleSave(this.token.role);
          this.loggedIn.next(true);
        })
        .catch(err => {
          error(err);
        })
    });
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('token');
  }

  carga() {
    this.loggedIn.next(true);
  }

  jwtSave(token: string){
    localStorage.setItem('token', token);

  }

  prefijoSave(prefijo: string) {
    localStorage.setItem('prefix', prefijo);
  }

  roleSave(rol: string){
    localStorage.setItem('role', rol);
  }
}
