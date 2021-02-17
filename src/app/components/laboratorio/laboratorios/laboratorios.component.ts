import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { DialogDataEliminar, Laboratorio } from "src/app/common/interface";
import { DialogComponent } from "src/app/common/dialog/dialog.component";
import { MatDialog } from '@angular/material/dialog';
import { LaboratorioService } from '../../../services/laboratorio/laboratorio.service';
import { HttpClient } from '@angular/common/http';
import { InfoMembrete } from '../../../common/interface';
import { logoGen } from "src/app/globals";
import { AuthService } from "src/app/services/auth/auth.service";

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
    private authService: AuthService,
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
    if (this.pref.length == 0) {
      this.openDialog('Error al procesar datos', 401);
      return;
    }

    this.labService.obtenerLab(this.jwt, this.pref, this.actRoute)
      .then(ok => {
        this.lab = ok.body;
        console.log(this.lab);
        this.base64Data = this.lab.imgByte;
        if (this.base64Data != null) {
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        } else {
          this.retrievedImage = logoGen;
        }
        this.fillForm(this.lab);
        this.load = false;
      })
      .catch(error => {
        if (error.status != 401) {
          this.openDialog(error.message);
        }
        this.load = false;
      })
  }

  guardar() {
    this.load = true;
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


  openDialog(mensaje: string, status?: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { mensaje: mensaje }
    });

    if (status == 401) {
      dialogRef.afterClosed().subscribe(result => {
        this.authService.logout();
        this.router.navigate(["/ingresar"]);
      });
    } else {
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  public onFileChanged(event) {
    let pattern = /image-*/;
    if (event.target.files[0].type.match(pattern)) {
      //Select File
      this.selectedFile = event.target.files[0];
      this.resizeImage(this.selectedFile, 300, 161).then(blob => {
        let img: any = document.getElementById('logo');
        img.src = URL.createObjectURL(blob);
        let file = new File([blob], event.target.files[0].name);
        this.selectedFile = file;
        this.fileName = file.name;

      }, err => {
        this.openDialog("Error: " + err)
      });
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

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
        }

        let newWidth;
        let newHeight;

        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }

        let canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        let context = canvas.getContext('2d');

        context.drawImage(image, 0, 0, newWidth, newHeight);

        canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
    });
  }

}
