import { Injectable } from '@angular/core';
import { ApiUrl } from '../../globals';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ContrasenaService {

  constructor(
    private http: HttpClient,
    //private options: HttpHeaders, //= new HttpHeaders ({ 'Content-Type': 'application/json' }),
  ) { }

  updateContrasena(jwt: string, mod:FormGroup ): Promise<any> { //newpass: string, confpass: string
    let params = new HttpParams();
    params = params.append('token', jwt);

    //console.log(mod.value);

    let uri = `${ApiUrl}usuarios/update-password`;//ApiUrl +  'usuarios/' +  'update-password';
    return new Promise((ok, error) => {
      this.http.put(uri, mod.value,//{params: params},
      {
        responseType: 'json',
        params: {
          'token': jwt
        }
      })
      /*{
        newpass: newpass,
        confpass: confpass
      })*/
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
