import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ApiUrl } from 'src/app/globals';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  constructor(
    private http: HttpClient
  ) { }

  obtenerMedicos(jwt: string, page: number, size: number, name: string): Promise<any> {

    return new Promise((ok, error) => {
      this.http
        .get(ApiUrl + 'medicos',
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

  obtenerMedico(jwt: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'medicos/' + id,
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
      this.http.get(ApiUrl + 'medicos/total',
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

  //Guardar
  crearMedico(jwt: string, medico: FormGroup): Promise<any> {
    return new Promise((ok, error) => {
      this.http.post(ApiUrl + 'medicos', medico.value,
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

  //Modifica
  modifica(jwt: string, mod: FormGroup, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.put(ApiUrl + 'medicos/' + id, mod.value,
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

  //Elimina
  eliminar(jwt: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.delete(ApiUrl + 'medicos/' + id,
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
}
