import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../globals';
import { stringify } from 'querystring';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  constructor(private http: HttpClient) { 
  }
  selectedFile:File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;

  //Obtener lab
  obtenerLab(jwt: string, prefix: string, id: any): Promise<any> {
    return new Promise((ok, error) => {
      this.http.get(ApiUrl + 'lab/' + prefix,
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
  //Modifica
  modificaLab(jwt: string, prefix: string, mod: FormGroup, id: any, file:File): Promise<any> {
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', new Blob([file]), file.name);
    uploadImageData.append('laboratorio',JSON.stringify(mod.value));
    console.log(mod.value);
    //console.log(uploadImageData);
    return new Promise((ok, error) => {
      this.http.put(ApiUrl + 'lab/' + prefix, uploadImageData,
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

  /*public onUpload(prefix:string): Promise<any>{
    console.log(this.selectedFile);
    const uploadImageData = new FormData();
    //uploadImageData.append('imageFile', selectedFile, selectedFile.name);
    uploadImageData.append('imageFile', new Blob([this.selectedFile]),this.selectedFile.name)
    return new Promise((ok, error) => {
      this.http.put(ApiUrl + 'lab/' + prefix, mod.value, uploadImageData, {observe : 'response'})
        .toPromise()
        .then(response => {
          ok(response);
        })
        .catch(err => {
          error(err);
        })
    });
  }*/

  getImage(prefix:string) {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.http.get(ApiUrl + 'lab/' + prefix )
      .subscribe(
        res => {
          console.log(res)
          this.retrieveResonse = res;
          console.log(this.retrieveResonse);
          this.base64Data = this.retrieveResonse.body.imgByte;

          console.log(this.base64Data);

          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
          
        }
      );
  }
}
