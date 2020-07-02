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
  obtenerEstudios(jwt: string, prefix: string, page: number, size: number, name: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http
        .get(ApiUrl + prefix + '/estudios',
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
  obtenerTotal(jwt: string, prefix: string, name: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + prefix + '/estudios/total',
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
  obtenerEstudio(jwt: string, prefix: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + prefix + '/estudios/' + id,
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
  crearEstudio(jwt: string, prefix: string, estudio: FormGroup): Promise<any> {
    return new Promise((ok, error) => {
      this.http.post(ApiUrl + prefix + '/estudios', estudio.value,
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

  modifica(jwt: string, prefix: string, mod: FormGroup, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.put(ApiUrl + prefix + '/estudios/' + id, mod.value,
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

  eliminar(jwt: string, prefix: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.delete(ApiUrl + prefix + '/estudios/' + id,
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

