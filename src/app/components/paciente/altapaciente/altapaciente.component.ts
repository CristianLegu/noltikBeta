import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Sexo, DialogDataEliminar } from "../../../common/interface";
import { DialogComponent } from "../../../common/dialog/dialog.component";
import { PacienteService } from "../../../services/paciente/paciente.service";
import { ActivatedRoute } from "@angular/router";
import { Patient } from "../../../common/interface";
import { DialogeliminarComponent } from "../../../common/dialogeliminar/dialogeliminar.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { faPlusSquare, faFileInvoice } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-altapaciente",
  templateUrl: "./altapaciente.component.html",
  styleUrls: ["./altapaciente.component.scss"]
})
export class AltapacienteComponent implements OnInit {

  actRoute: string;
  jwt: string;
  prefix: string;
  mensajeBienvenida: string;
  paciente: Patient;
  load: boolean = false;
  selected: string;
  dataEliminar: DialogDataEliminar = { id: "", jwt: "", prefix: "", mensaje: "", tipo: "" };
  faPlusSquare = faPlusSquare;
  faFileInvoice = faFileInvoice;
  rol: string;
  UserPerm: boolean;

  constructor(
    private router: Router,
    private altapaciente: PacienteService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private fb2: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.actRoute = this.activatedRoute.snapshot.params["id"];
  }

  color = "accent";
  buttonRFC = true;
  buttonRFCQuitar = true;
  buttongen = true;
  mensaje: string;

  gen: Sexo[] = [
    { value: "se-0", viewValue: "Sin Especificar" },
    { value: "H", viewValue: "Hombre" },
    { value: "M", viewValue: "Mujer" }
  ];

  altapac = this.fb.group({
    nombre: ["", [Validators.required]],
    direccion: [""],
    ciudad: [""],
    estado: [""],
    codigopostal: [""],
    nacimiento: [""], //, disabled: true
    sexo: ["", [Validators.required]],
    telefonos: this.fb.array([this.fb.control("")]),
    tiposangre: [""],
    email: [""],
    rfcjson: this.fb2.group({
      rfc: ["", [Validators.minLength(12), Validators.maxLength(13)]],
      razon: ["", [Validators.minLength(10)]],
      fiscal: ["", [Validators.minLength(10)]]
    })
  });

  ngOnInit() {
    this.load = true;
    this.jwt = localStorage.getItem("token");
    this.prefix = localStorage.getItem('prefix');
    if (this.actRoute != "0") {

      //Valida Rol
      this.rol = localStorage.getItem('role');
      if (this.rol == 'ROLE_ADMIN') {
        this.UserPerm = true;
      }

      this.altapaciente
        .getPaciente(this.jwt, this.prefix, this.actRoute)
        .then(ok => {
          console.log(ok);
          this.paciente = ok.body;
          this.load = false;
          this.pasarValores(this.paciente);
        })
        .catch(error => {
          this.load = false;
          this.mensaje = error.error.mensaje;//error.message;
          this.openDialog();
        });
    } else {
      this.load = false;

      this.mensajeBienvenida = "Dar de alta paciente";
    }
  }

  pasarValores(paciente: any) {
    if (this.actRoute != "0") {
      this.mensajeBienvenida = "Paciente " + paciente.nombre;
      if (paciente.rfcjson != null) {
        this.agregarRfc();
        this.buttonRFCQuitar = false;
      }
    }
    // console.log(paciente.genero)
    if (paciente.sexo == "M") {
      this.selected = "M";
    }
    else {
      this.selected = "H";
    }

    this.buttongen = false;

    if (paciente.rfcjson == null) paciente.rfcjson = "";

    if (paciente.telefonos == null) paciente.telefonos = [];

    this.altapac.patchValue({
      nombre: paciente.nombre,
      direccion: paciente.direccion,
      ciudad: paciente.ciudad,
      estado: paciente.estado,
      codigopostal: paciente.codigopostal,
      nacimiento: new Date(paciente.nacimiento),
      sexo: paciente.sexo,
      tiposangre: paciente.tiposangre,
      email: paciente.email,
      rfcjson: paciente.rfcjson
    });

    paciente.telefonos.forEach((x, index) => {
      if (index == 0) this.telefonos.at(index).setValue(x.telefono);
      else {
        this.agregarTel();
        this.telefonos.at(index).setValue(x.telefono);
      }
    });


    /*this.altapac.get('genero').disable();
    this.altapac.get('rfcjson').disable();
    this.altapac.get('tiposangre').disable();*/
  }

  get telefonos() {
    return this.altapac.get("telefonos") as FormArray;
  }

  agregarTel() {
    if (this.telefonos.length <= 2) {
      this.telefonos.push(this.fb.control(""));
    }
  }

  quitarTel(index: number) {
    if (index != 0) this.telefonos.removeAt(index);
  }

  agregarRfc() {
    this.buttonRFC = false;
  }

  quitarRfc() {
    this.buttonRFC = true;
  }

  guardar() {
    this.load = true;
    if (this.actRoute != "0") {
      console.log(this.altapac);
      this.altapaciente
        .modifica(this.jwt, this.prefix, this.altapac, this.actRoute)
        .then(ok => {
          this.load = false;
          this.mensaje = ok.mensaje;//"El paciente se actualizó correctamente";
          this.openDialog();
        })
        .catch(error => {
          this.mensaje = error.error.mensaje;//error.error.message;
          this.openDialog();
          this.load = false;
        });
    } else {
      if (this.altapac.valid) {
        //console.log(this.altapac)
        this.altapaciente
          .setAlta(this.jwt, this.prefix, this.altapac)
          .then(ok => {
            this.mensaje = ok.mensaje;//"El paciente se creó correctamente";
            this.load = false;
            this.openDialog();
          })
          .catch(err => {
            this.load = false;
            this.mensaje = err.error.mensaje;//err.error.message;
            this.openDialog();
          });
      } else {
        this.load = false;
        this.openSnackBar(
          "Favor de llenar los campos obligatiorios",
          "Aceptar"
        );
      }
    }
  }

  eliminar() {
    this.load = true;
    this.openDialogEliminar();
  }

  openDialogEliminar(): void {
    this.load = false;
    this.dataEliminar.mensaje =
      "¿Desea eliminar el paciente " + this.paciente.nombre + "?";
    this.dataEliminar.id = this.actRoute;
    this.dataEliminar.jwt = this.jwt;
    this.dataEliminar.prefix = this.prefix;
    this.dataEliminar.tipo = "pacientes";

    const dialogRef = this.dialog.open(DialogeliminarComponent, {
      width: "350px",
      data: { mensaje: this.dataEliminar.mensaje, datos: this.dataEliminar }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { mensaje: this.mensaje }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(["/pacientes"]);
    });
  }

  ruta_usuario() {
    this.router.navigate(["/pacientes"]);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }


}
