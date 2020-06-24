import { Injectable } from '@angular/core';
import { ApiUrl } from '../../globals';
import { HttpClient } from '@angular/common/http';
import { FormGroup, } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  setAlta(jwt: string, alta: FormGroup): Promise<any> {

    return new Promise((ok, error) => {
      this.http.post(ApiUrl + 'pacientes', alta.value,
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

  modifica(jwt: string, mod: FormGroup, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.put(ApiUrl + 'pacientes/' + id, mod.getRawValue(),//value,
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

  getpacientes(jwt: string, page: number, size: number, name: string): Promise<any> {

    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'pacientes',
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

  getPaciente(jwt: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'pacientes/' + id,
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

  obtenerTotal(jwt: string, name: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'pacientes/total',
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

  eliminar(jwt: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.delete(ApiUrl + 'pacientes/' + id,
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
  /*
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 2000,
      });
    }
  */
}
