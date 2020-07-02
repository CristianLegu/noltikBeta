import { Injectable } from '@angular/core';
import { ApiUrl } from '../../globals';
import { HttpClient } from '@angular/common/http';
import { FormGroup, } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AnalisisService {

  constructor(
    private http: HttpClient
  ) { }

  getLista(jwt: string, prefix: string, page: number, size: number, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + prefix + '/pacientes/' + id + '/analisis',
        {
          headers: { 'Authorization': 'Bearer ' + jwt },
          responseType: 'json',
          params: {
            'page': '' + page,
            'size': '' + size,
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

  obtenerTotal(jwt: string, prefix: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + prefix + '/pacientes/' + id + '/analisis/total',
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

  getUnAnalisis(jwt: string, prefix: string, idp: any, ida: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + prefix + '/pacientes/' + idp + '/analisis/' + ida,
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

  crear(jwt: string, prefix: string, idp: any, analisis: any, timeZone: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http.post(ApiUrl + prefix + '/pacientes/' + idp + '/analisis/', analisis,
        {
          headers: {
            'Authorization': 'Bearer ' + jwt,
            'time-zone': timeZone
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

  modificar(jwt: string, prefix: string, idp: any, ida: any, analisis: any, timeZone: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http.put(ApiUrl + prefix + '/pacientes/' + idp + '/analisis/' + ida,
        analisis,
        {
          headers: {
            'Authorization': 'Bearer ' + jwt,
            'time-zone': timeZone
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

  eliminar(jwt: string, prefix: string, idp: any, ida: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.delete(ApiUrl + prefix + '/pacientes/' + idp + '/analisis/' + ida,
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

  /*
  obtenerTotalEstudio(jwt: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'estudios/total',
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

  buscarEstudio(jwt: string, page: number, size: number, nombre: string): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'estudios',
        {
          headers: { 'Authorization': 'Bearer ' + jwt },
          params: {
            'name': nombre,
            'page': '' + page,
            'size': '' + size,
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
  }*/
}
