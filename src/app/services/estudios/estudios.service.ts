import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from 'src/app/globals';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {

  constructor(private http: HttpClient) { }

  //Obtener listado estudios
  obtenerEstudios(jwt: string, page: number, size: number, name: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http
        .get(ApiUrl + 'estudios',
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

  //Obtener total de estudios
  obtenerTotal(jwt: string, name: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'estudios/total',
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

  //Obtener estudio
  obtenerEstudio(jwt: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'estudios/' + id,
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

  //Guardar
  crearEstudio(jwt: string, estudio: FormGroup): Promise<any> {
    return new Promise((ok, error) => {
      this.http.post(ApiUrl + 'estudios', estudio.value,
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
      this.http.put(ApiUrl + 'estudios/' + id, mod.value,
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

  eliminar(jwt: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.delete(ApiUrl + 'estudios/' + id,
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

