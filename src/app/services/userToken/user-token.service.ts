import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from 'src/app/globals';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserTokenService {

  constructor(
    private http: HttpClient
  ) { }

  setConfirma(username: string) {
    return new Promise((ok, error) => {
      this.http.post(ApiUrl + 'usuarios/req-pass/' + username,
        {
        })
        .toPromise()
        .then(response => {
          //console.log(response);
          ok(response);
        })
        .catch(err => {
          error(err);
        })
    });
  }

  reenvioRegistroToken(usuarioCorreo: string) {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'reenvio-registro',
        {
          params: { 'usuariocorreo': usuarioCorreo }
        }
      ).toPromise()
        .then(response => ok(response))
        .catch(e => error(e))
    });
  }
}
