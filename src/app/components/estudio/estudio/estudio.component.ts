import { Component, OnInit } from "@angular/core";
import { Estudio, DialogDataEliminar } from "src/app/common/interface";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { EstudiosService } from "src/app/services/estudios/estudios.service";
import { DialogComponent } from "../../../common/dialog/dialog.component";
import { DialogeliminarComponent } from "src/app/common/dialogeliminar/dialogeliminar.component";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: "app-estudio",
  templateUrl: "./estudio.component.html",
  styleUrls: ["./estudio.component.scss"]
})
export class EstudioComponent implements OnInit {
  //Data element para Form
  data = {
    json_estudio: [
      {
        subtitulo: "",
        items: [
          {
            prueba: "",
            unidades: "",
            referencia: ""
          }
        ]
      }
    ]
  };

  actRoute: string;
  jwt: string;
  prefix: string = "";
  mensajeBienvenida: string;
  load: boolean = false;
  estudio: Estudio;
  color = "accent";
  faPlus = faPlus;
  altaEstudio: FormGroup;
  mensaje: string;
  dataEliminar: DialogDataEliminar = { id: "", jwt: "", prefix: "", mensaje: "", tipo: "" };

  //Variables Rol
  UserPerm: boolean;
  rol: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private estudioService: EstudiosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {
    this.actRoute = this.activatedRoute.snapshot.params["id"];

    //FormBuilder
    this.altaEstudio = this.fb.group({
      nombre: ["", [Validators.required]],
      json_estudio: this.fb.array([])
    });
    this.setSubtitulos();
  }

  ngOnInit() {
    this.load = true;
    this.jwt = localStorage.getItem("token");
    this.prefix = localStorage.getItem('prefix');

    if (this.prefix != null && this.prefix.length == 0) {
      this.openDialog('Error al procesar datos', 401);
      return;
    }

    if (this.actRoute != "0") {

      //Valida Rol
      this.rol = localStorage.getItem('role');
      if (this.rol == 'ROLE_ADMIN') {
        this.UserPerm = true;
      }

      this.estudioService.obtenerEstudio(this.jwt, this.prefix, this.actRoute)
        .then(ok => {
          this.estudio = ok.body;
          this.load = false;
          this.pasarValores(this.estudio);
        })
        .catch(error => {
          let mensaje: string;
          if (error.status === 401) {
            mensaje = 'Sin autorización';
          }
          else {
            mensaje = error.message;
          }
          this.load = false;
          this.openDialog(mensaje, error.status);
        });
    } else {
      this.mensajeBienvenida = "Dar de alta Estudio";
      this.load = false;
    }
  }

  pasarValores(estudio: any) {
    this.mensajeBienvenida = this.estudio.nombre;
    this.altaEstudio.patchValue({
      nombre: estudio.nombre
    });

    //VALIDAR JSON
    if (estudio.json_estudio != null) {

      estudio.json_estudio.forEach(x => {
        let control = <FormArray>this.altaEstudio.controls.json_estudio;
        control.push(
          this.fb.group({
            subtitulo: [x.subtitulo],
            //ITEMS
            items: this.setItemsCrud(x.items)
            //ITEMS
          })
        );
      });
    }

  }

  //Realiza el seteo de los items cuando lee registro
  setItemsCrud(x) {
    let arr = new FormArray([]);
    x.forEach(y => {
      arr.push(
        this.fb.group({
          prueba: y.prueba,
          unidades: y.unidades,
          referencia: y.referencia
        })
      );
    });
    return arr;
  }

  //Realiza el seteo de subtitulos
  setSubtitulos() {
    if (this.actRoute == "0") {
      let control = <FormArray>this.altaEstudio.controls.json_estudio;
      this.data.json_estudio.forEach(x => {
        control.push(
          this.fb.group({
            subtitulo: x.subtitulo,
            items: this.setItems(x)
          })
        );
      });
    }
  }

  //Realiza el seteo de los items
  setItems(x) {
    let arr = new FormArray([]);
    x.items.forEach(y => {
      arr.push(
        this.fb.group({
          prueba: y.prueba,
          unidades: y.unidades,
          referencia: y.referencia
        })
      );
    });
    return arr;
  }

  //Agrega subtitulo
  addSubtitulo() {
    let control = <FormArray>this.altaEstudio.controls.json_estudio;
    control.push(
      this.fb.group({
        subtitulo: [""],
        items: this.fb.array([
          this.fb.group({
            prueba: [""],
            unidades: [""],
            referencia: [""]
          })
        ])
      })
    );
  }

  //Elimina subtitulos
  deleteSubtitulo(index) {
    let control = <FormArray>this.altaEstudio.controls.json_estudio;
    control.removeAt(index);
  }

  //Agrega items
  addItems(control) {
    control.push(
      this.fb.group({
        prueba: [""],
        unidades: [""],
        referencia: [""]
      })
    );
  }

  //Elimina items
  deleteItem(control, index) {
    control.removeAt(index);
  }

  guardar() {
    this.load = true;
    if (this.altaEstudio.valid) {
      if (this.actRoute == "0") {
        this.estudioService
          .crearEstudio(this.jwt, this.prefix, this.altaEstudio)
          .then(ok => {
            this.load = false;
            this.mensaje = ok.mensaje;//"El estudio se guardó correctamente";
            this.openDialog(this.mensaje);
          })
          .catch(error => {
            let mensaje: string;
            this.load = false;
            mensaje = error.error.mensaje;
            this.openDialog(mensaje);
          });
      } else {
        this.estudioService
          .modifica(this.jwt, this.prefix, this.altaEstudio, this.actRoute)
          .then(ok => {
            this.load = false;
            this.mensaje = ok.mensaje;// "El estudio se actualizó correctamente";
            this.openDialog(this.mensaje);
          })
          .catch(error => {
            let mensaje: string;
            this.load = false;
            mensaje = error.error.mensaje;
            this.openDialog(mensaje);
          });
      }
    } else {
      this.openSnackBar("Complete los campos obligatorios", "Aceptar");
    }
  }

  eliminar() {
    this.load = true;
    this.openDialogEliminar();
  }

  openDialogEliminar(): void {
    this.load = false;
    this.dataEliminar.mensaje =
      "¿Desea eliminar el estudio " + this.estudio.nombre + "?";
    this.dataEliminar.id = this.actRoute;
    this.dataEliminar.jwt = this.jwt;
    this.dataEliminar.prefix = this.prefix;
    this.dataEliminar.tipo = "estudios";

    const dialogRef = this.dialog.open(DialogeliminarComponent, {
      width: "350px",
      data: { mensaje: this.dataEliminar.mensaje, datos: this.dataEliminar }
    });
  }

  openDialog(mensaje: string, status?: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px",
      data: { mensaje: mensaje }
    });
    if (status == 401) {
      dialogRef.afterClosed().subscribe(result => {
        this.authService.logout();
        this.router.navigate(["/ingresar"]);
      });
    }
    else {
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(["/estudios"]);
      });
    }

  }

  ruta_usuario() {
    this.router.navigate(["/estudios"]);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
    this.load = false;
  }
}
