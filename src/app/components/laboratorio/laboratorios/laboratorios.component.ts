import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { DialogDataEliminar, Laboratorio } from "src/app/common/interface";
import { DialogComponent } from "src/app/common/dialog/dialog.component";
import { MatDialog } from '@angular/material/dialog';
import { LaboratorioService } from '../../../services/laboratorio/laboratorio.service';
import { ApiUrl, logoGen } from '../../../globals';
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
  mensaje: string;
  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  fileName: string;

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
    private labService: LaboratorioService,
    private http: HttpClient,
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
    tipo_imagen: ["", []],
    img_byte: ["", []]
  });

  ngOnInit(): void {
    this.load = true;
    this.jwt = localStorage.getItem("token");
    this.pref = localStorage.getItem("prefix");
    this.rol = localStorage.getItem("role");

    //console.log(this.actRoute);
    this.labService.obtenerLab(this.jwt, this.pref, this.actRoute)
      .then(ok => {
        this.lab = ok.body;
        this.base64Data = this.lab.imgByte;
        if (this.base64Data != null) {
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        } else {
          this.retrievedImage = logoGen;
        }
        this.fillForm(this.lab);
        //this.getImage(this.pref);
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

  guardar() {
    this.load = true;
    //this.cargarimagen();
    this.labService.modificaLab(this.jwt, this.pref, this.actLab, this.selectedFile)
      .then(ok => {
        this.load = false;
        this.mensaje = ok.mensaje;
        this.openDialog(this.mensaje);
        this.selectedFile = null;
      }).catch(error => {
        this.mensaje = error.error.mensaje;
        this.openDialog(this.mensaje);
        this.load = false;
      });
  }

  fillForm(lab: Laboratorio) {
    this.actLab.patchValue({
      nombre: lab.nombre,
      domicilio: lab.domicilio,
      ciudad: lab.ciudad,
      estado: lab.estado,
      telefonos: lab.telefonos,
      email: lab.email,
      bodyMail: lab.bodyMail,
      imgByte: lab.imgByte,
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
    });
  }

  public onFileChanged(event) {
    let pattern = /image-*/;
    if (event.target.files[0].type.match(pattern)) {
      //Select File
      this.selectedFile = event.target.files[0];

      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = function (event) {
        let img: any = document.getElementById('logo');
        img.src = event.target.result;
      }
      reader.readAsDataURL(file);
      this.fileName = this.selectedFile.name;
    }
    else {
      let imagen: any = document.getElementById("file-upload");
      imagen.value = "";
      let logo: any = document.getElementById("logo");
      logo.src = this.retrievedImage;
      this.selectedFile = null;
      this.fileName = "";
      this.openDialog("Sólamente archivos de imagen válidos");
    }

  }

  getImage(prefix: string) {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.http.get(ApiUrl + 'lab/' + prefix)
      .subscribe(
        res => {
          console.log("Res image");
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
