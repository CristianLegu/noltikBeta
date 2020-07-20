import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ApiUrl } from '../../globals';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(
    private http: HttpClient
  ) { }

  setRegistro(registro: FormGroup) {
    return new Promise((ok, error) => {
      this.http.post(ApiUrl + 'registro', registro.value//,
        //{
          /*headers: {
            //'Authorization': 'Bearer ' + jwt
          }*/
       // }
       )
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
