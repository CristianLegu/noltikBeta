import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrl } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class EnviaMailService {

  constructor(private http: HttpClient) { }

  //Envia email con PDF adjunto
  enviaPDF(jwt: string, prefix: string, idpaciente: number, base64: string): Promise<any> {
    let pdf = {
      pdf: base64
    }
    //console.log(pdf);
    return new Promise((ok, error) => {
      this.http.post(ApiUrl + prefix + '/pacientes/' + idpaciente + '/enviar/', pdf,
        {
          headers: {
            //'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
          }
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
}
