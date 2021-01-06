import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { DialogDataEliminar, Laboratorio } from "src/app/common/interface";
import { DialogComponent } from "src/app/common/dialog/dialog.component";
import { DialogeliminarComponent } from "src/app/common/dialogeliminar/dialogeliminar.component";
import { MatDialog } from '@angular/material/dialog';
import { SidenavComponent } from 'src/app/sidenav/sidenav.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LaboratorioService } from '../../../services/laboratorio/laboratorio.service';
import { ApiUrl } from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { InfoMembrete } from '../../../common/interface';

@Component({
  selector: 'app-laboratorios',
  templateUrl: './laboratorios.component.html',
  styleUrls: ['./laboratorios.component.scss']
})
export class LaboratoriosComponent implements OnInit {
  load: boolean = false;
  mensajeBienvenida: string;
  actRoute: string;
  buttonTel = true;
  mensaje: string;
  selectedFile:File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  public respuestaImagenEnviada;
  public resultadoCarga;

  //Estructura para dialog eliminar
  dataEliminar: DialogDataEliminar = { id: "", jwt: "", mensaje: "", tipo: "", prefix: "" };

  //íconos
  faPlusSquare = faPlusSquare;

  //Estructura Médico
  lab: Laboratorio;

  infoM: InfoMembrete;

  //Storage
  jwt: string;
  pref: string;
  rol: string;
  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    //private fbHosp: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private labService: LaboratorioService,
    private http: HttpClient,
    private sidenav: SidenavComponent = new SidenavComponent(router, authService)
  ) {
    this.actRoute = this.activateRoute.snapshot.params["id"];
   }

  //FormGroup Médico
  actLab = this.fb.group({
    nombre: ["", []],
    domicilio: ["", []],
    ciudad: ["", []],
    estado: ["", []],
    email: ["", []],
    telefonos: ["", []], //this.fb.array([this.fb.control("")])
    bodyMail: ["", []],
    infoMembrete: this.fb.group({
      cedulaProfesional: ["", []],
      cedulaEspecialidad: ["", []],
    }),
  });

  imageFG = this.fb.group({
    nombre_imagen: ["", []],
    tipo_imagen: ["",[]],
    img_byte: ["", []]
  });

  ngOnInit(): void {
    this.load = true;
    this.jwt = localStorage.getItem("token");
    this.pref = localStorage.getItem("prefix");
    this.rol = localStorage.getItem("role");

    if (this.actRoute != '0') {
      //console.log(this.actRoute);
      this.labService.obtenerLab(this.jwt, this.pref, this.actRoute)
        .then(ok => {
          this.lab = ok.body;
          console.log(this.lab);
          this.fillForm(this.lab);
          this.getImage(this.pref);
          this.load = false;
        })
        .catch(error => {
          console.log(error);
          if (error.status != 401) {
            this.openDialog(error.message);
          }
          this.load = false;
          //this.router.navigate(["/medicos"]);
        })
    }

  }

  guardar() {
    this.load = true;
    console.log(this.actRoute);
    //this.cargarimagen();
    if (this.actRoute != "0") {
      this.labService.modificaLab(this.jwt, this.pref, this.actLab, this.actRoute, this.selectedFile)
        .then(ok => {
          this.load = false;
          this.mensaje = ok.mensaje;
          this.openDialog(this.mensaje);
          //this.ruta();
        }).catch(error => {
          this.mensaje = error.error.mensaje;
          this.openDialog(this.mensaje);
          this.load = false;
        });
    }
  }

  //Botón flecha atrás
  ruta() {
    this.router.navigate(["/pacientes"]);
  }

  fillForm(lab: Laboratorio) {
    this.actLab.patchValue({
      nombre: lab.nombre,
      domicilio: lab.domicilio,
      ciudad: lab.ciudad,
      estado: lab.estado,
      telefonos: lab.telefonos,
      email:lab.email,
      bodyMail: lab.bodyMail,
      infoMembrete: {
        cedulaProfesional: lab.infoMembrete.cedulaProfesional,
        cedulaEspecialidad: lab.infoMembrete.cedulaEspecialidad
      }
    });
  }


  openDialog(mensaje: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { mensaje: mensaje }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.router.navigate(["/noltik/medicos"]);
    });
  }

  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  getImage(prefix:string) {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.http.get(ApiUrl + 'lab/' + prefix )
      .subscribe(
        res => {
          console.log(res)

          this.retrieveResonse = res;
          //console.log(this.retrieveResonse);
          this.base64Data = this.retrieveResonse.body.imgByte;

          //console.log(this.base64Data);

          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
          
        }
      );
  }
}
