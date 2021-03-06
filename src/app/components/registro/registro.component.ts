import { Component, OnInit, VERSION } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';



import { DialogComponent } from 'src/app/common/dialog/dialog.component';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro/registro.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {


  public version = VERSION.full;
  registro: FormGroup;
  actRoute: string;
  hide = true;
  hide2 = true;
  fileName = "";
  prefix = "";
  mensaje: string;
  load: boolean = false;
  isAllOk: boolean = true;
  aceptaTerminos: boolean = false;
  captcha: boolean = false;
  password2: String;
  recaptcha: String;
  prefijo_aux: String;
  user_aux: String;
  ok: any;
  noMatch: boolean = false;

  constructor(
    private registroService: RegistroService,
    private regs: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {

    this.registro = this.regs.group({
      nombreLab: ["", [Validators.required]],
      prefijo: ["", [Validators.required]],
      contrasena: ["", [Validators.required, Validators.minLength(8)]],
      emailuser: ["", [Validators.required, Validators.email]],
      nombre: ["", [Validators.required]],
      nombreusuario: ["", [Validators.required]],
      rol: "ROLE_ADMIN",
      token: "",
    });

  }


  ngOnInit() {
  }

  guardar() {
    if (this.validaErrores()) {

      this.load = true;
      this.registro.patchValue({
        token: this.recaptcha
      })
      //Concatenar prefijo y usuario
      this.prefijo_aux = this.registro.value.prefijo + '_';
      this.user_aux = this.prefijo_aux + this.registro.value.nombreusuario;

      this.registro.value.nombreusuario = this.user_aux;

      this.registroService.setRegistro(this.registro)
        .then(resp => {
          this.ok = resp;
          //this.mensaje = this.ok.mensaje;
          this.mensaje = 'Registro creado con éxito. Se envió un correo a ' + this.registro.value.emailuser
            + '. Para poder iniciar, debes activar tu cuenta';
          this.load = false;
          this.openDialog(this.mensaje, this.ok.statusCodeValue);

        })
        .catch(err => {
          this.mensaje = err.error.mensaje;
          this.openDialog(this.mensaje);
          this.load = false;
        });

    }
  }

  /*get telefonos() {
    return this.registro.get("telefonos") as FormArray;
  }

  agregarTel() {
    if (this.telefonos.length <= 2) {
      this.telefonos.push(this.regs.control(""));
    }
  }

  quitarTel(index: number) {
    if (index != 0) this.telefonos.removeAt(index);
  }*/

  //Valida Errores
  validaErrores() {

    //Valida que el formulario sea válido
    if (!this.registro.valid) {
      this.mensajeSnack('Complete todos los campos');
      return false;
    }

    //Valida que las contraseñas coincidan
    if (this.registro.value.contrasena != this.password2) {
      this.mensajeSnack('Las contraseñas no coinciden');
      this.noMatch = true;
      return false;
    }

    //Valida que la contraseña cumpla con los requisitos
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*.?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    if (!this.registro.value.contrasena.match(regex)) {
      this.mensajeSnack('La contraseña debe contener al menos 8 caracteres,' + '\n' +
        'al menos una letra mayúscula, al menos una letra minúscula,' +
        'al menos un número, al menos 1 caracter especial y no contener espacios en blanco.');
      this.noMatch = true;
      return false;
    }

    //Valida que el captcha esté correcto
    if (this.recaptcha == null) {
      this.mensajeSnack('El Captcha es obligatorio');
      return false;
    }

    //En caso de que todo esté Ok, retorna true
    return true;
  }

  //Dialog
  openDialog(mensaje: string, status?: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { mensaje: mensaje }
    });
    dialogRef.afterClosed().subscribe(() => {
      if (status === 200) {
        this.router.navigate(["/ingresar"]);
      }
    });
  }

  //Mensaje Snackbar
  mensajeSnack(msj: String) {

    this._snackBar.open('' + msj, 'Aceptar', {
      duration: 15000
    });
  }


  OnChange(source: string, $event) {

    //Si el evento es porque caducó el captcha
    if ($event === null) {
      this.captcha = false;
      this.aceptaTerminos = false;
    }
    //Si el evento es por click en los términos o captcha
    else {
      if (source == 'captcha' && this.recaptcha != null) {
        this.captcha = true;
      }
      else {
        //Si se recibe el evento del checkbox
        if ($event.checked == true) {
          this.aceptaTerminos = true;
        }
        else {
          this.aceptaTerminos = false;
        }
      }
    }

    //Validar que se cumpla todo para habilitar botón de guardar
    if (this.aceptaTerminos && this.captcha) {
      this.isAllOk = false;
    }
    else {
      this.isAllOk = true;
    }

  }

}
