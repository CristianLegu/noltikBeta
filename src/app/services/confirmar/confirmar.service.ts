import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class ConfirmarService {

  constructor(
    private http: HttpClient
  ) { }

  setConfirma(token: string) {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'confirma-registro',
        {
          responseType: 'json',
          params: {
            'token': token
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
}
