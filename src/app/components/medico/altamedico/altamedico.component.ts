import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { Medico, DialogDataEliminar } from "src/app/common/interface";
import { DialogComponent } from "src/app/common/dialog/dialog.component";
import { DialogeliminarComponent } from "src/app/common/dialogeliminar/dialogeliminar.component";
import { MatDialog } from '@angular/material/dialog';
import { MedicosService } from 'src/app/services/medicos/medicos.service';
import { SidenavComponent } from 'src/app/sidenav/sidenav.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: "app-altamedico",
  templateUrl: "./altamedico.component.html",
  styleUrls: ["./altamedico.component.scss"]
})
export class AltamedicoComponent implements OnInit {
  //Variables
  load: boolean = false;
  mensajeBienvenida: string;
  actRoute: string;
  buttonTel = true;
  mensaje: string;

  //Estructura para dialog eliminar
  dataEliminar: DialogDataEliminar = { id: "", jwt: "", mensaje: "", tipo: "", prefix: "" };

  //íconos
  faPlusSquare = faPlusSquare;

  //Estructura Médico
  medico: Medico;

  //Storage
  jwt: string;
  pref: string;
  rol: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private fbHosp: FormBuilder,
    private medicoService: MedicosService,
    private dialog: MatDialog,
    private authService: AuthService,
    private sidenav: SidenavComponent = new SidenavComponent(router, authService)
  ) {
    this.actRoute = this.activateRoute.snapshot.params["id"];
  }

  //FormGroup Médico
  altaMedico = this.fb.group({
    nombre: ["", [Validators.required]],
    area: ["",],
    domicilio: ["", []],
    ciudad: ["", []],
    estado: ["", []],
    email: ["", []],
    telefonos: this.fb.array([this.fb.control("")]),
    infoHosp: this.fbHosp.group({
      nombre: ["", []],
      direccion: ["", []],
      telefono: ["", []],
      ciudad: ["", []],
      estado: ["", []]
    })
  });

  ngOnInit(): void {
    this.load = true;
    this.jwt = localStorage.getItem("token");
    this.pref = localStorage.getItem("prefix");
    this.rol = localStorage.getItem("role");

    if (this.actRoute != '0') {
      this.medicoService.obtenerMedico(this.jwt, this.pref, this.actRoute)
        .then(ok => {
          this.medico = ok.body;

          this.fillForm(this.medico);

          this.load = false;
        })
        .catch(error => {
          if (error.status != 401) {
            this.openDialog(error.message);
          }
          this.load = false;
          this.router.navigate(["/medicos"]);
        })
    }
    else {
      this.mensajeBienvenida = 'Crear Médico';
      this.load = false;
    }
  }

  guardar() {

    this.load = true;
    if (this.actRoute != "0") {
      this.medicoService.modifica(this.jwt, this.pref, this.altaMedico, this.actRoute)
        .then(ok => {
          this.load = false;
          this.mensaje = ok.mensaje;
          this.openDialog(this.mensaje);
          this.ruta();
        }).catch(error => {
          this.mensaje = error.error.mensaje;//error.error.message;
          this.openDialog(this.mensaje);
          this.load = false;
        });
    }
    else {
      this.medicoService.crearMedico(this.jwt, this.pref, this.altaMedico)
        .then(ok => {
          this.load = false;
          this.mensaje = ok.mensaje;
          this.openDialog(this.mensaje);
          this.ruta();
        })
        .catch(err => {
          this.load = false;
          this.mensaje = err.error.mensaje;
          this.openDialog(this.mensaje);
        });
    }

  }

  //Botón flecha atrás
  ruta() {
    this.router.navigate(["/medicos"]);
  }

  //Botón eliminar Médico
  eliminar() {
    this.load = true;
    this.openDialogEliminar();
  }

  //Forma arreglo de teléfonos
  get telefonos() {
    return this.altaMedico.get("telefonos") as FormArray;
  }

  agregarTel() {
    if (this.telefonos.length <= 2) {
      this.telefonos.push(this.fb.control(""));
      if (this.telefonos.length > 2) {
        this.buttonTel = false;
      }
    }
  }

  quitarTel(index: number) {
    if (index != 0) this.telefonos.removeAt(index);
    if (this.telefonos.length <= 2) {
      this.buttonTel = true;
    }
  }

  openDialog(mensaje: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px",
      data: { mensaje: mensaje }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.router.navigate(["/noltik/medicos"]);
    });
  }

  //Pasa los valores al form de médico
  fillForm(medico: any) {
    if (this.sidenav.innerWidth > 920) {
      this.mensajeBienvenida = medico.nombre
    }
    else {
      this.mensajeBienvenida = medico.nombre.substr(0, 36);
    }

    //Si los teléfonos se obtienen vacíos, se manda un arreglo vacío
    if (medico.telefonos == null) {
      medico.telefonos = [];
    }

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

    //Pasa los valores de los teléfonos
    medico.telefonos.forEach((x, index) => {
      if (index == 0) {
        this.telefonos.at(index).setValue(x.telefono);
      }
      else {
        this.agregarTel();
        this.telefonos.at(index).setValue(x.telefono);
      }
    });

  }

  //Dialog para eliminar
  openDialogEliminar(): void {
    this.load = false;
    this.dataEliminar.mensaje =
      "¿Desea eliminar al médico " + this.medico.nombre + "? ";
    this.dataEliminar.id = this.actRoute;
    this.dataEliminar.jwt = this.jwt;
    this.dataEliminar.prefix = this.pref;
    this.dataEliminar.tipo = "medicos";

    const dialogRef = this.dialog.open(DialogeliminarComponent, {
      width: "350px",
      data: { mensaje: this.dataEliminar.mensaje, datos: this.dataEliminar }
    });
  }

}
