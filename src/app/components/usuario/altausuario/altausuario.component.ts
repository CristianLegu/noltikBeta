import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../common/dialog/dialog.component';
import { UsuarioService } from '../../../services/usuario/usuario.service'
import { ActivatedRoute } from '@angular/router';
import { Usuario, Rol, DialogDataEliminar } from '../../../common/interface';//'app/common/interface';
import { DialogeliminarComponent } from '../../../common/dialogeliminar/dialogeliminar.component';//'src/app/common/dialogeliminar/dialogeliminar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SidenavComponent } from 'src/app/sidenav/sidenav.component';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

export class MyErrorStateMatcherEmail implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-altausuario',
  templateUrl: './altausuario.component.html',
  styleUrls: ['./altausuario.component.scss']
})
export class AltausuarioComponent implements OnInit, OnDestroy {

  mensaje: string;
  matcher = new MyErrorStateMatcher();
  matcherEmail = new MyErrorStateMatcherEmail();
  altauser: FormGroup;
  actRoute: string;
  load: boolean = false;
  jwt: string;
  prefix: string;
  usuario: Usuario;
  mensajeBienvenida: string;
  selected: string;

  //Prefijo a mostrar
  prefijo: string;


  //Oculta campos de Contraseña
  ocultar: boolean = true;

  dataEliminar: DialogDataEliminar = { id: '', jwt: '', prefix: '', mensaje: '', tipo: '' };
  valida = [Validators.required, Validators.minLength(6)];

  habilitaNU: boolean = false;
  rol: string;
  UserPerm: boolean;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
     
  ) {

    this.actRoute = this.activatedRoute.snapshot.params['id'];

    if (this.actRoute != '0') {
      this.valida = [Validators.minLength(6)];
    }
    //FormGroup
    this.altauser = this.fb.group({
      nombre: ['', [Validators.required]],
      nombreusuario: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      contrasena: ['', this.valida],
      confirmcontrasena: [''],
      email: ['', [Validators.required, Validators.email]],
      rol: ['ROLE_USER', [Validators.required]],
    },
      {
        //validator: this.checkPasswords
      }
    );

  }

  //Arreglo roles
  roles: Rol[] = [
    { value: 'ROLE_USER', viewValue: 'USUARIO' },
    { value: 'ROLE_ADMIN', viewValue: 'ADMINISTRADOR' }
  ];

  color = 'accent';

  ngOnDestroy() {
    this.altauser.patchValue({
      nombre: '',
      nombreusuario: '',
      email: '',
      rol: '',
      contrasena: ''
    });
  }

  ngOnInit() {
     
    this.load = true;
    this.jwt = localStorage.getItem('token');
    this.prefix = localStorage.getItem('prefix');

    //Valida que sea un usuario válido
    if (this.actRoute != '0') {

      //Valida Rol
      this.rol = localStorage.getItem('role');
      if (this.rol == 'ROLE_ADMIN') {
        this.UserPerm = true;
      }

      this.usuarioService.obtenerUsuario(this.jwt, this.prefix, this.actRoute).then(ok => {
        this.usuario = ok.body;
        this.load = false;
        this.habilitaNU = true;
        this.pasarValores(this.usuario);
        this.ocultar = false;
      }).catch(error => {
        this.load = false;
        this.mensaje = error.error.message;
        this.openDialog(this.mensaje);
      });
    }
    else {
      this.load = false;
      this.prefijo = this.prefix.concat('_');
      this.mensajeBienvenida = 'Dar de alta usuario';
    }

  }

  pasarValores(usuario: any) {

    this.mensajeBienvenida = usuario.nombre;

    this.selected = usuario.rol

    //Split el usuario para separar prefijo del nombre
    /*let user = usuario.nombreusuario;
    let userSplit;
    userSplit = user.split("_", 2);

    this.prefijo = userSplit[0];
    usuario.nombreusuario = user.replace(this.prefijo + '_', '');

    this.prefijo = this.prefijo.concat('_');*/

    //Si es un usuario admin, no puede ser eliminado
    if (usuario.rol == 'ROLE_ADMIN') {
      this.UserPerm = false;
    }

    this.altauser.patchValue({
      nombre: usuario.nombre,
      nombreusuario: usuario.nombreusuario,
      email: usuario.email,
      rol: usuario.rol,

      contrasena: ''
    })

    this.altauser.get('nombreusuario').disable();
    //this.altauser.get('rol').disable();

  }

  guardar() {
     
    this.load = true;
    if (this.altauser.valid) {

      if (this.actRoute == '0') {

        if (this.altauser.value.contrasena != this.altauser.value.confirmcontrasena) {
          this.load = false;
          this.openSnackBar("Las contraseñas no coinciden, favor de revisar", "Aceptar");
        }
        else {

          //Concatenar prefijo con usuario
          let usuario;
          usuario = this.altauser.value.nombreusuario;
          usuario = this.prefix.concat('_', usuario);

          this.altauser.value.nombreusuario = usuario;


          this.usuarioService.setAlta(this.jwt, this.prefix, this.altauser)
            .then(ok => {
              // console.log(ok);
              this.load = false;
              this.mensaje = ok.mensaje;//"El usuario se creó correctamente";
              this.openDialog(this.mensaje);
            })
            .catch(err => {
              // console.log(err);
              let mensaje: string;
              mensaje = err.error.mensaje;
              this.openDialog(mensaje, err.status);
              this.load = false;
            });
        }
      }
      else {
        if (this.altauser.value.contrasena != this.altauser.value.confirmcontrasena) {
          this.openSnackBar("Las contraseñas no coinciden, favor de revisar", "Aceptar");
        }
        else {
          this.prefijo = "";
          this.usuarioService.modifica(this.jwt, this.prefix, this.altauser, this.actRoute)
            .then(ok => {
              this.load = false;
              this.mensaje = ok.mensaje//"El usuario se actualizó correctamente";
              this.openDialog(this.mensaje);
            })
            .catch(error => {
              // console.log(error);
              let mensaje: string;
              mensaje = error.error.mensaje;
              this.openDialog(mensaje, error.status);
              this.load = false;
            });

        }
      }

    }
    else {
      this.load = false;
      this.openSnackBar("Favor de llenar los campos obligatiorios", "Aceptar");
    }

  }

  eliminar() {
     
    this.load = true;
    this.openDialogEliminar();
  }

  openDialogEliminar(): void {
    this.load = false;
    this.dataEliminar.mensaje = '¿Desea eliminar al usuario ' + this.usuario.nombre + '?';
    this.dataEliminar.id = this.actRoute;
    this.dataEliminar.jwt = this.jwt;
    this.dataEliminar.prefix = this.prefix;
    this.dataEliminar.tipo = 'usuarios'


    const dialogRef = this.dialog.open(DialogeliminarComponent, {
      width: '350px',
      data: {
        mensaje: this.dataEliminar.mensaje,
        datos: this.dataEliminar
      }

    });

  }

  openDialog(mensaje: string, status?: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: { mensaje: mensaje }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (status != "409") {
        this.router.navigate(["/usuarios"]);
      }
    });
    /*
        if (this.altauser.get('nombreUsuario').touched) {
          this.authService.logout();
          this.router.navigateByUrl('/ingresar');
        } else {
        }
     */
  }

  get optionConfirm() {
    return this.altauser.get('contrasena') as FormControl;
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('contrasena').value;
    let confirmPass = group.get('confirmcontrasena').value;

    return null//pass === confirmPass ? null : { notSame: true }
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ruta() {
     
    this.altauser.patchValue({
      nombre: '',
      nombreusuario: '',
      email: '',
      rol: '',
      contrasena: ''
    });
    this.router.navigate(["/usuarios"]);
  }

}
