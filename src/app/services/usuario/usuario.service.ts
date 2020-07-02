import { Injectable } from '@angular/core';
import { ApiUrl } from '../../globals';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormGroup, } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  token: string;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }



  setAlta(jwt: string, prefix: string, user: FormGroup): Promise<any> {
    if (user.valid) {
      return new Promise((ok, error) => {
        this.http.post(ApiUrl + prefix + '/usuarios', user.value,
          {
            headers: {
              'Authorization': 'Bearer ' + jwt
            }
          })
          .toPromise()
          .then(response => {
            ok(response);
          })
          .catch(err => {
            error(err);
          })
      });
    }
    else {
    }
  }

  //Modifica
  modifica(jwt: string, prefix: string, mod: FormGroup, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.put(ApiUrl + prefix + '/usuarios/' + id, mod.getRawValue(),//value,
        {
          headers: { 'Authorization': 'Bearer ' + jwt }
        })
        .toPromise()
        .then(response => {
          ok(response);
        })
        .catch(err => {
          error(err);
        })
    });
  }


  obtenerLista(jwt: string, prefix: string, page: number, size: number, name: string): Promise<any> {

    return new Promise((ok, error) => {
      this.http
        .get(ApiUrl + prefix + '/usuarios',
          {
            headers: { 'Authorization': 'Bearer ' + jwt },
            responseType: 'json',
            params: {
              'page': '' + page,
              'size': '' + size,
              'name': name
            }
          })
        .toPromise()
        .then(response => {
          ok(response);
        })
        .catch(err => {
          error(err);
        })
    });
  }

  //Elimina
  eliminar(jwt: string, prefix: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.delete(ApiUrl + prefix + '/usuarios/' + id,
        {
          headers: { 'Authorization': 'Bearer ' + jwt }
        })
        .toPromise()
        .then(response => {
          ok(response);
        })
        .catch(err => {
          error(err);
        })
    });
  }


  obtenerTotal(jwt: string, prefix: string, name: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + prefix + '/usuarios/total',
        {
          headers: { 'Authorization': 'Bearer ' + jwt },
          params: { 'name': name }
        })
        .toPromise()
        .then(response => {
          ok(response);
        })
        .catch(err => {
          error(err);
        })
    });
  }

  obtenerUsuario(jwt: string, prefix: string, id: any): Promise<any> {

    return new Promise((ok, error) => {
      this.http
        .get(ApiUrl + prefix + '/usuarios/' + id,
          {
            headers: { 'Authorization': 'Bearer ' + jwt },
            responseType: 'json'
          })
        .toPromise()
        .then(response => {
          ok(response);
        })
        .catch(err => {

          error(err);
        })
    });
  }

}
