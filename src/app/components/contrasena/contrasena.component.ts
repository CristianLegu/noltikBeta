import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../common/dialog/dialog.component";
import { ContrasenaService } from "../../services/contrasena/contrasena.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { startWith, tap } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { CambiarPasswordParams } from '../../common/interface';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.component.html',
  styleUrls: ['./contrasena.component.scss']
})

export class ContrasenaComponent implements OnInit {

  mensaje: string;
  token: string;
  prefix: string;
  actRoute: string;
  load: boolean = false;
  isAllOk: boolean = true;
  ok: any;
  noMatch: boolean = false;

  constructor(
    private contrasenaService: ContrasenaService,
    private contrasenaN: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    //private http: HttpHeaders,
  ) {
    //this.token = this.route.snapshot.params["token"];
    //this.token = localStorage.getItem('token');
    this.actRoute = this.route.snapshot.params["token"];
  }

  newPass = this.contrasenaN.group({
    passNuevo: ["", [Validators.required]],
    passNuevoCoincide: ["", [Validators.required]],
  });

  ngOnInit() {
    this.actRoute = this.route.snapshot.params["token"];
  }

  guardarContra() {
      this.load = true;
      this.contrasenaService.updateContrasena(this.actRoute, this.newPass)//this.newPass.get("newpass").value, this.newPass.get("confpass").value)
        .then(ok => {
          this.load = false;
          //this.mensaje = ok.mensaje;
          this.router.navigateByUrl("/successMessage"); 
        })
        .catch(err => {
          console.log(err);
          //this.mensaje = err.error.mensaje;
          //this.openDialog(this.mensaje);
          this.load = false;
        });
  }

  //Mensaje Snackbar
  mensajeSnack(msj: String) {

    this._snackBar.open('' + msj, 'Aceptar', {
      duration: 3000
    });
  }

  openDialog(mensaje: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: { mensaje: mensaje }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(["/ingresar"]);
    });
  }
}
