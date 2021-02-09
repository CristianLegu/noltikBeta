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

  validaCaptcha(token: String) {
    let apiGoogle = 'https://www.google.com/recaptcha/api/siteverify';
    return new Promise((ok, error) => {
      this.http.post(apiGoogle,
        {
          secret: '6LfiSlEaAAAAANcHc00zMYGDsJXFbdNvLaZg4zds',
          response: token
        }
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



  //
  //03AGdBq26ocscCPxpqUaBit9Tq0AlHxZS9ihrY9cP-F4gpWiC9bAnPqaeWdQPcQptsRkQpT3EetlaWjHD5_VgiitV4jt1Xftnwxdh99_q3i4pTxk_w3SY6goxg0IKYXdZbE9Ud1i1nxfpGWKgTi844harTCaLi_5RV0T12hh06P48A6UyknfCTdWIz-s-Oab9XQT1eWanO28o0NCrXgLMs_r2NA--alHlGH1yJIBL-LBDrxoWlGoNl98wq9TixLj6ScshuP-IVN3nHCDgcBGobHEUogvD6XgKerqHga8J2S8vBso6ry9gKTs-lu1IjloZZvivrcMs34BgnVAdde9sRXvTD_--wmsfHgJRYoDZde5s1JtA4ewlb3cvjSYFRs0dEVplvtvqntIqSFZheobj3SHew9qBFsobD0INvggjKBXU6S2wQMJQ273-8Wz-92hUpTxFmpxEbJREh


}
