import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { faPhone, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { MedicosService } from "src/app/services/medicos/medicos.service";
import { Medico, DialogDataEliminar } from "src/app/common/interface";
import { DialogComponent } from "src/app/common/dialog/dialog.component";
import { DialogeliminarComponent } from "src/app/common/dialogeliminar/dialogeliminar.component";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: "app-altamedico",
  templateUrl: "./altamedico.component.html",
  styleUrls: ["./altamedico.component.scss"]
})
export class AltamedicoComponent implements OnInit {
  //Variables
  actRoute: string;
  jwt: string;
  prefix: string;
  mensajeBienvenida: string;
  load: boolean = false;
  faPhone = faPhone;
  medico: Medico;
  faPlusSquare = faPlusSquare;
  mensaje: string;
  dataEliminar: DialogDataEliminar = { id: "", jwt: "", prefix: '', mensaje: "", tipo: "" };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private fbTel: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private medicoService: MedicosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.actRoute = this.activatedRoute.snapshot.params["id"];
  }

  color = "accent";

  //FormGroup Médico
  altaMedico = this.fb.group({
    area: ["", [Validators.required]],
    nombre: ["", [Validators.required]],
    domicilio: ["", []],
    ciudad: ["", []],
    estado: ["", []],
    email: ["", []],
    telefonos: this.fb.array([this.fb.control("")]),
    infoHosp: this.fbTel.group({
      nombre: ["", []],
      direccion: ["", []],
      telefono: ["", []],
      ciudad: ["", []],
      estado: ["", []]
    })
  });

  ngOnInit() {
    this.load = true;
    this.jwt = localStorage.getItem("token");
    this.prefix = localStorage.getItem('prefix');
    if (this.actRoute != "0") {
      this.medicoService
        .obtenerMedico(this.jwt, this.prefix, this.actRoute)
        .then(ok => {
          this.medico = ok.body;
          this.load = false;
          this.pasarValores(this.medico);
        })
        .catch(error => {
          let mensaje: string;
          this.load = false;
          mensaje = error.error.mensaje;//error.error.message;
          this.openDialog(mensaje);
        });
    } else {
      this.mensajeBienvenida = "Dar de alta Médico";
      this.load = false;
    }
  }

  ruta_usuario() {
    this.router.navigate(["/medicos"]);
  }

  guardar() {
    this.load = true;
    if (this.altaMedico.valid) {
      if (this.actRoute == "0") {
        this.medicoService
          .crearMedico(this.jwt, this.prefix, this.altaMedico)
          .then(ok => {
            this.load = false;
            this.mensaje = ok.mensaje;//"El médico se guardó correctamente";
            this.openDialog(this.mensaje);
          })
          .catch(error => {
            let mensaje: string;
            this.load = false;
            mensaje = error.error.mensaje;//error.error.message;
            this.openDialog(mensaje);
          });
      } else {
        this.medicoService
          .modifica(this.jwt, this.prefix, this.altaMedico, this.actRoute)
          .then(ok => {
            this.load = false;
            this.mensaje = ok.mensaje;//"El médico se actualizó correctamente";
            this.openDialog(this.mensaje);
          })
          .catch(error => {
            let mensaje: string;
            this.load = false;
            mensaje = error.error.mensaje;//error.error.message;
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
      "¿Desea eliminar al médico " + this.medico.nombre + "?";
    this.dataEliminar.id = this.actRoute;
    this.dataEliminar.jwt = this.jwt;
    this.dataEliminar.tipo = "medicos";

    const dialogRef = this.dialog.open(DialogeliminarComponent, {
      width: "350px",
      data: { mensaje: this.dataEliminar }
    });
  }

  pasarValores(medico: any) {
    this.mensajeBienvenida = "Médico " + medico.nombre;
    if (medico.telefonos == null) medico.telefonos = [];

    this.altaMedico.patchValue({
      area: medico.area,
      nombre: medico.nombre,
      domicilio: medico.domicilio,
      ciudad: medico.ciudad,
      estado: medico.estado,
      email: medico.email,
      telefonos: medico.telefonos,
      infoHosp: medico.infoHosp
    });

    medico.telefonos.forEach((x, index) => {
      if (index == 0) this.telefonos.at(index).setValue(x.telefono);
      else {
        this.agregarTel();
        this.telefonos.at(index).setValue(x.telefono);
      }
    });
  }

  get telefonos() {
    return this.altaMedico.get("telefonos") as FormArray;
  }

  agregarTel() {
    if (this.telefonos.length <= 2) {
      this.telefonos.push(this.fb.control(""));
    }
  }

  quitarTel(index: number) {
    if (index != 0) this.telefonos.removeAt(index);
  }

  openDialog(m: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { mensaje: m }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(["/medicos"]);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
    this.load = false;
  }
}
