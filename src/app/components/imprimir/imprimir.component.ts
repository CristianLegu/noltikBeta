import { Component, OnInit } from "@angular/core";
import * as jsPDF from "jspdf";
import { ActivatedRoute, Router } from "@angular/router";
import { AnalisisService } from "../../services/analisis/analisis.service";
import { HttpClient } from '@angular/common/http';

import { Analisis } from "src/app/common/interface";
import { DialogmembreteComponent } from "src/app/common/dialogmembrete/dialogmembrete.component";
import { MatDialog } from '@angular/material/dialog';
import { DatosLaboratorio } from "src/app/common/interface";

@Component({
  selector: "app-imprimir",
  templateUrl: "./imprimir.component.html",
  styleUrls: ["./imprimir.component.scss"]
})
export class ImprimirComponent implements OnInit {
  jwt: string;
  prefix: string;
  actID: number;
  actString: string;
  actRoute: Array<string> = [];
  analisisImp: Array<Analisis> = [];
  paciente: string;
  fecha: string;
  doc = new jsPDF();
  mensaje: string = "¿Desea que el reporte tenga membrete?";
  decision: string;
  membrete_cadena: string = "";
  domicilio: string = "";
  ciudad: string = "";
  correo: string = "";
  lab: DatosLaboratorio;
  sangria: number;
  altura: number;
  load: boolean = false;
  alturaItems: number;

  //retrievedImage: string;
  //base64Data: any;
  //retrieveResonse: any;

  constructor(
    private serviceA: AnalisisService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient
  ) {
    this.actString = this.activatedRoute.snapshot.params["an"];
    this.actID = this.activatedRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.jwt = localStorage.getItem("token");
    this.prefix = localStorage.getItem('prefix');
    if (this.prefix.length == 0) {
      this.router.navigate(["/ingresar"]);
      return;
    }
    this.actRoute = JSON.parse("[" + this.actString + "]");
    /* for (var i = 0; i < this.actRoute.length; i++) {
       this.serviceA
         .getUnAnalisis(this.jwt, this.prefix, this.actID, this.actRoute[i])
         .then(ok => {
           this.analisisImp.push(ok.body);
         })
         .catch(error => {
           // this.load = false;
         });
     }*/
    this.openDialog();

    //  console.log(this.analisisImp);


  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogmembreteComponent, {
      width: "350px",
      data: { mensaje: this.mensaje, decision: this.decision }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

        this.serviceA.getDatoslaboratorio(this.jwt, this.prefix)
          .then(ok => {
            this.lab = ok.body;
          })
          .catch(error => {
            this.load = false;
            if (error.status == 401) {
              this.router.navigate(["/ingresar"]);
            }
            else {
              this.mensaje = error.error.mensaje;//error.message;
            }
            this.openDialog();
          });
      }
      this.decision = result;
      //  this.downloadPDF(this.decision);
      this.serviceA.getAnalisisSeleccionados(this.jwt, this.prefix, this.actID, this.actString)
        .then(ok => {
          this.createPDF(ok.body, this.decision)
            .then(
              respuesta => {

                //this.enviarPDF(respuesta.toString());
              }
            );
        }).catch(error => {
          this.router.navigate(["/ingresar"]);
        });
      this.router.navigate(["/pacientes/" + this.actID + "/analisis"]);
    });
  }

  getFormatoFecha(fecha: string) {
    let splitted = fecha.split("T", 1);
    let dd: string, mm: string, yyyy: string, mes: Number;
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "Mayo", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    fecha = splitted[0];
    fecha = fecha.substring(0, 10);
    yyyy = fecha.substring(0, 4);
    mm = fecha.substring(5, 7);
    mes = Number(mm) - 1;
    mm = monthNames[mes.toString()];
    dd = fecha.substring(8, 10);

    fecha = dd.concat("-", mm, "-", yyyy);
    return fecha;
  }

  cabecera() {
    if (this.lab.imgByte != null) {
      this.doc.addImage(this.lab.imgByte, "JPEG", 10, 10, 40, 25);
    }
    this.doc.setDrawColor(45, 76, 130);
    this.doc.line(5, 5, 205, 5);

    this.doc.setFont("helvetica");
    this.doc.setFontType("normal");
    this.doc.setFontSize(14);
    //this.doc.text(55, 16, "LABORATORIOS DE ANALISIS CLINICOS ESPINOSA");
    this.doc.text(60, 16, this.lab.nombre);
    this.doc.setFontSize(10);
    //No mostrará los campos en caso de que estén vacíos
    //Cédula profesional y especialidad
    if (this.lab.infoMembrete.cedulaEspecialidad != "") {
      this.membrete_cadena = "Cedula de Especialidad: " + this.lab.infoMembrete.cedulaEspecialidad;
    }
    if (this.lab.infoMembrete.cedulaProfesional != "") {
      if (this.membrete_cadena.length == 0) {
        this.membrete_cadena = "Cedula Profesional: " + this.lab.infoMembrete.cedulaProfesional;
      }
      else {
        this.membrete_cadena = this.membrete_cadena + " Cedula Profesional: " + this.lab.infoMembrete.cedulaProfesional;
      }
    }
    //Domicilio
    if (this.lab.domicilio != "") {
      this.domicilio = "Domicilio: " + this.lab.domicilio;
    }
    //Ciudad y Estado
    if (this.lab.ciudad != "") {
      this.ciudad = "Ciudad: " + this.lab.ciudad;
    }
    if (this.lab.estado != "") {
      if (this.ciudad.length == 0) {
        this.ciudad = "Estado: " + this.lab.estado;
      }
      else {
        this.ciudad = this.ciudad + " Estado: " + this.lab.estado;
      }
    }
    //Correo y teléfono
    if (this.lab.email != "") {
      this.correo = "Correo: " + this.lab.email;
    }
    if (this.lab.telefonos != "") {
      if (this.correo.length == 0) {
        this.correo = "Telefono: " + this.lab.telefonos;
      }
      else {
        this.correo = this.correo + " Telefono: " + this.lab.telefonos;
      }
    }


    this.doc.text(
      60,
      21,
      this.domicilio
    );
    this.doc.text(
      60,
      25,
      this.ciudad
    );
    this.doc.text(
      60,
      29,
      this.correo
    );
    this.doc.text(
      60,
      33,
      this.membrete_cadena
    );

    this.doc.line(5, 40, 205, 40);
  }



  createPDF(analisis: Array<Analisis> = [], membrete: string) {
    return new Promise((ok, error) => {
      //Genera la cabecera
      if (membrete != null) {
        this.cabecera();
      }

      this.load = true;
      this.altura = 50;
      this.alturaItems = 60;

      this.sangria = 10;
      this.doc.setFontSize(8.5);
      this.doc.setFontType("normal");
      this.doc.text("Examen practicado a: ", this.sangria, this.altura);
      this.doc.setFontType("normal");
      this.sangria = 156;
      this.doc.text("Fecha de aplicación: ", this.sangria, this.altura);
      this.sangria = 40;
      this.doc.setFontType("bold");
      this.doc.text(
        analisis[0].paciente.toString(),
        this.sangria,
        this.altura
      );
      this.sangria = 185;
      this.fecha = analisis[0].fecha.toString();
      this.fecha = this.getFormatoFecha(this.fecha);
      this.doc.text(this.fecha, this.sangria, this.altura);
      this.altura = 50;
      this.sangria = 10;
      this.doc.setFontType("normal");
      this.doc.text("Practicado por  el médico: ", this.sangria, this.altura + 4);
      this.sangria = 45;
      this.doc.setFontType("bold");
      this.doc.text(
        analisis[0].medico.toString(),
        this.sangria,
        this.altura + 4
      );

      this.doc.line(5, this.altura + 8, 205, this.altura + 8);

      for (var i = 0; i < analisis.length; i++) {
        if (this.alturaItems >= 240) {
          this.doc.addPage();
          //Imprime cabecera

          this.cabecera();

          this.alturaItems = 60;
        }
        let product = analisis[i];
        this.paciente = product.paciente;

        this.alturaItems = this.alturaItems + 5;
        this.sangria = 10;
        this.doc.setFontSize(10);
        this.doc.setFontType("bold");
        this.doc.text(
          product.analisis.toString(),
          this.sangria,
          this.alturaItems
        );

        /**
         * Cambio para Espermatobioscopía
         * 02-03-2020
         * INICIO
         */
        if (product.analisis.toString() == "ESPERMATOBIOSCOPIA") {
          product.json.forEach(x => {
            this.doc.setFontSize(8);
            this.doc.setFontType("bold");

            if (x.subtitulo.toString() == "ESPERMATOBIOSCOPIA DIRECTA") {
              this.sangria = 10;
              this.alturaItems = 70;
            }
            if (x.subtitulo.toString() == "MORFOLOGIA") {
              this.sangria = 50;
              this.alturaItems = 155;
              this.doc.text(
                "VALORES DE REFERENCIA: POR CRITERIOS ESTRICTOS DE KRUGER >= 14%",
                this.sangria,
                this.alturaItems
              );
              this.doc.rect(47, 146.5, 112, 9.6);
              this.sangria = 90;
              this.alturaItems = 150;
            }
            if (
              x.subtitulo.toString() == "MOTILIDAD" ||
              x.subtitulo.toString() == "MOBILIDAD"
            ) {
              this.sangria = 140;
              this.alturaItems = 70;
            }
            this.doc.text(x.subtitulo.toString(), this.sangria, this.alturaItems);

            this.doc.setFontType("normal");
            this.doc.setFontSize(8);
            this.alturaItems = this.alturaItems + 1;

            x.items.forEach(y => {
              if (y.prueba == "Días de abstinencia:") {
                this.alturaItems = 74;
                this.sangria = 10;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 38;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString() + "     Días",
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.rect(37, 71.5, 5.2, 3);
              }

              if (y.prueba == "Aspecto:") {
                this.alturaItems = 78;
                this.sangria = 10;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 38;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.rect(37, 75.5, 5.2, 3);
                this.sangria = 44;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Licuefacción:") {
                this.alturaItems = 82;
                this.sangria = 10;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 38;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.rect(37, 79.5, 5.2, 3);
              }

              if (y.prueba == "Viscosidad:") {
                this.alturaItems = 86;
                this.sangria = 10;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 38;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.rect(37, 83.5, 5.2, 3);
              }

              if (y.prueba == "Volumen:") {
                this.alturaItems = 90;
                this.sangria = 10;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 38;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.rect(37, 87.5, 5.2, 3);
                this.sangria = 44;
                if (y.unidades != null)
                  this.doc.text(
                    y.unidades.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 48;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "pH:") {
                this.alturaItems = 94;
                this.sangria = 10;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 38;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.rect(37, 91.5, 5.2, 3);
                this.sangria = 44;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Concentración:") {
                this.alturaItems = 110;
                this.sangria = 20;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 50;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(40, this.alturaItems + 1, 63, this.alturaItems + 1);
                this.sangria = 67;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.rect(65, 107, 39, 4);
              }

              if (y.prueba == "Viabilidad:") {
                this.alturaItems = 115;
                this.sangria = 20;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 50;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(40, this.alturaItems + 1, 63, this.alturaItems + 1);
                this.sangria = 67;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Leucocitos:") {
                this.alturaItems = 120;
                this.sangria = 20;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 50;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(40, this.alturaItems + 1, 63, this.alturaItems + 1);
                this.sangria = 67;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Aglutinación:") {
                this.alturaItems = 125;
                this.sangria = 20;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 45;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(40, this.alturaItems + 1, 63, this.alturaItems + 1);
                this.sangria = 67;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Bacterias:") {
                this.alturaItems = 110;
                this.sangria = 120;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 137;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  134,
                  this.alturaItems + 1,
                  153,
                  this.alturaItems + 1
                );
                this.sangria = 157;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Eritrocitos:") {
                this.alturaItems = 115;
                this.sangria = 120;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 140;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  134,
                  this.alturaItems + 1,
                  153,
                  this.alturaItems + 1
                );
                this.sangria = 157;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Cel. Germinales:") {
                this.alturaItems = 120;
                this.sangria = 120;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 153;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  145,
                  this.alturaItems + 1,
                  164,
                  this.alturaItems + 1
                );
                this.sangria = 167;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Cel. Epiteliales:") {
                this.alturaItems = 125;
                this.sangria = 120;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 153;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  145,
                  this.alturaItems + 1,
                  164,
                  this.alturaItems + 1
                );
                this.sangria = 167;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "Dentritus celulares:") {
                this.alturaItems = 130;
                this.sangria = 120;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 153;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  145,
                  this.alturaItems + 1,
                  164,
                  this.alturaItems + 1
                );
                this.sangria = 167;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "A") {
                this.alturaItems = 74;
                this.sangria = 140;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 152;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 155;
                if (y.unidades != null)
                  this.doc.text(
                    y.unidades.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  145,
                  this.alturaItems + 1,
                  164,
                  this.alturaItems + 1
                );
                this.sangria = 167;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.text(
                  "VR. A >= 25%",
                  this.sangria,
                  66
                );
                this.doc.text(
                  "A y B >= 50%",
                  this.sangria,
                  69
                );
              }

              if (y.prueba == "B") {
                this.alturaItems = 78;
                this.sangria = 140;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 152;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 155;
                if (y.unidades != null)
                  this.doc.text(
                    y.unidades.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  145,
                  this.alturaItems + 1,
                  164,
                  this.alturaItems + 1
                );
                this.sangria = 167;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "C") {
                this.alturaItems = 82;
                this.sangria = 140;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 152;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 155;
                if (y.unidades != null)
                  this.doc.text(
                    y.unidades.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  145,
                  this.alturaItems + 1,
                  164,
                  this.alturaItems + 1
                );
                this.sangria = 167;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "D") {
                this.alturaItems = 86;
                this.sangria = 140;
                if (y.prueba != null)
                  this.doc.text(
                    y.prueba.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 152;
                if (y.resultados != null)
                  this.doc.text(
                    y.resultados.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.sangria = 155;
                if (y.unidades != null)
                  this.doc.text(
                    y.unidades.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                this.doc.line(
                  145,
                  this.alturaItems + 1,
                  164,
                  this.alturaItems + 1
                );
                this.sangria = 167;
                if (y.referencia != null)
                  this.doc.text(
                    y.referencia.toString(),
                    this.sangria,
                    this.alturaItems
                  );
              }

              if (y.prueba == "NORMALES") {
                this.alturaItems = 160;
                this.sangria = 20;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 46;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(45, 157, 8, 4);
                this.sangria = 50;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "MACROCEFALOS") {
                this.alturaItems = 165;
                this.sangria = 20;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 46;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(45, 162, 8, 4);
                this.sangria = 50;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "MICROCEFALOS") {
                this.alturaItems = 170;
                this.sangria = 20;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 46;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(45, 167, 8, 4);
                this.sangria = 50;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }


              if (y.prueba == "PIRIFORMES") {
                this.alturaItems = 160;
                this.sangria = 80;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 105;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(104, 157, 8, 4);
                this.sangria = 109;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "COLA ANORMAL") {
                this.alturaItems = 165;
                this.sangria = 80;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 105;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(104, 162, 8, 4);
                this.sangria = 109;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "AMORFOS") {
                this.alturaItems = 170;
                this.sangria = 80;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 105;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(104, 167, 8, 4);
                this.sangria = 109;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "ACINTADOS") {
                this.alturaItems = 160;
                this.sangria = 140;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 172;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(171, 157, 8, 4);
                this.sangria = 176;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "ALFILER") {
                this.alturaItems = 165;
                this.sangria = 140;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 172;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(171, 162, 8, 4);
                this.sangria = 176;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "DUPLICADOS") {
                this.alturaItems = 170;
                this.sangria = 140;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 172;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(171, 167, 8, 4);
                this.sangria = 176;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "GOTA CITOPLASMICA") {
                this.alturaItems = 175;
                this.sangria = 140;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 172;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(171, 172, 8, 4);
                this.sangria = 176;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "P. Hinchamiento Hiposmótica") {
                this.alturaItems = 195;
                this.sangria = 40;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 79;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(78, 192, 9, 4);
                this.sangria = 84;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
                this.sangria = 124;
                if (y.referencia != null)
                  this.doc.text(y.referencia.toString(), this.sangria, this.alturaItems);
              }

              if (y.prueba == "Concentración Espermatica Total") {
                this.alturaItems = 200;
                this.sangria = 35;
                if (y.prueba != null)
                  this.doc.text(y.prueba.toString(), this.sangria, this.alturaItems);
                this.sangria = 79;
                if (y.resultados != null)
                  this.doc.text(y.resultados.toString(), this.sangria, this.alturaItems);
                this.doc.rect(78, 197, 9, 4);
                this.sangria = 88;
                if (y.unidades != null)
                  this.doc.text(y.unidades.toString(), this.sangria, this.alturaItems);
                this.sangria = 124;
                if (y.referencia != null)
                  this.doc.text(y.referencia.toString(), this.sangria, this.alturaItems);
              }
            });
          });
          if (product.comentario != "") {
            this.alturaItems = this.alturaItems + 5;
            this.doc.text(20, this.alturaItems, "Observaciones: ");

            let numberBreaks = product.comentario.match(/\n/g) || [];
            let split = product.comentario.split("\n");

            /*
                      split.forEach(s => {
                        if (s.length > 120) {
                          comentarioFinal = s.substring(0, 120);
                          comentarioFinal =
                            comentarioFinal + "\n" + s.substring(120, s.length);
                        } else {
                          comentarioFinal = comentarioFinal + "\n" + s;
                        }
                      });
                      this.doc.text(comentarioFinal, 40, this.alturaItems);
            
                      this.alturaItems = this.alturaItems + 3 * (numberBreaks.length + 2);
                      */
            let comentarioFinal: string = "";
            /*
                      split.forEach(s => {
                        if (s.length > 100) {
                          comentarioFinal = s.substring(0, 120);
                          comentarioFinal =
                            comentarioFinal + "\n" + s.substring(120, s.length);
                        } else {
                          comentarioFinal = comentarioFinal + "\n" + s;
                        }
                      });
            */

            comentarioFinal = product.comentario;
            let comentarioFinal2 = this.doc.splitTextToSize(comentarioFinal, 150);
            this.doc.text(comentarioFinal2, 40, this.alturaItems);

            //this.doc.text(product.comentario.toString(), 40, this.alturaItems);
            //this.doc.text(comentarioFinal, 40, this.alturaItems);

            //this.alturaItems = this.alturaItems + 3 * (numberBreaks.length + 2);
            this.alturaItems = this.alturaItems + 3 * comentarioFinal2.length;
          } else {
            this.alturaItems = this.alturaItems + 4;
          }
          this.doc.line(5, this.alturaItems, 205, this.alturaItems);
          this.doc.rect(15, 156, 170, 22);
        } else {
          /**
           * Cambio para Espermatobioscopía
           * 02-03-2020
           * FIN
           */
          product.json.forEach(x => {
            this.doc.setFontSize(8);
            this.doc.setFontType("bold");
            this.alturaItems = this.alturaItems + 5;
            this.sangria = 80;
            this.doc.text(x.subtitulo.toString(), this.sangria, this.alturaItems);

            this.alturaItems = this.alturaItems + 5;
            this.doc.text(10, this.alturaItems, "Prueba");
            this.doc.text(85, this.alturaItems, "Resultados");
            this.doc.text(105, this.alturaItems, "Unidades");
            this.doc.text(125, this.alturaItems, "Referencia");
            this.doc.text(155, this.alturaItems, "Comentarios");
            this.doc.setFontType("normal");
            this.doc.setFontSize(8);

            this.doc.line(10, this.alturaItems + 1, 205, this.alturaItems + 1);
            this.alturaItems = this.alturaItems + 1;

            x.items.forEach(y => {
              if (this.alturaItems >= 240) {
                this.doc.addPage();
                //Imprime cabecera
                this.cabecera();

                this.alturaItems = 40;
              }
              this.alturaItems = this.alturaItems + 5;
              if (y.prueba != null) {
                this.sangria = 10;
                this.doc.text(
                  y.prueba.toString(),
                  this.sangria,
                  this.alturaItems
                );
              }

              if (y.resultados != null) {
                this.sangria = 85;
                this.doc.text(
                  y.resultados.toString(),
                  this.sangria,
                  this.alturaItems
                );
              }
              if (y.unidades != null) {
                this.sangria = 105;
                this.doc.text(
                  y.unidades.toString(),
                  this.sangria,
                  this.alturaItems
                );
              }

              if (y.referencia != null) {
                this.sangria = 125;
                this.doc.text(
                  y.referencia.toString(),
                  this.sangria,
                  this.alturaItems
                );
              }

              if (y.comentario != null) {
                this.sangria = 155;
                var length_comenta = y.comentario.toString().length;
                var vl_length_aux = 0;
                var vl_length_aux2 = 0;
                if (length_comenta >= 36) {

                  var vl_cont = 0;
                  var vl_salir = "";
                  do {
                    if (vl_cont == 0) {
                      vl_cont = 1;
                      this.doc.text(
                        y.comentario.toString().substr(0, 36),
                        this.sangria,
                        this.alturaItems
                      );

                      this.alturaItems = this.alturaItems + 3;
                      vl_length_aux = 36;
                    }
                    else {
                      vl_length_aux2 = vl_length_aux + 36;
                      if (vl_length_aux2 <= length_comenta) {
                        this.doc.text(
                          y.comentario.toString().substr(vl_length_aux, 36),
                          this.sangria,
                          this.alturaItems);
                        vl_length_aux = vl_length_aux + 36;

                      }
                      else {
                        vl_length_aux2 = length_comenta - vl_length_aux;
                        this.doc.text(
                          y.comentario.toString().substr(vl_length_aux, vl_length_aux2),
                          this.sangria,
                          this.alturaItems);
                        vl_salir = 'X';
                      }

                      this.alturaItems = this.alturaItems + 3;
                    }
                  }
                  while (vl_salir == '') {

                  }

                }
                else {
                  this.doc.text(
                    y.comentario.toString(),
                    this.sangria,
                    this.alturaItems
                  );
                }
              }
            });
          });

          /**
           * Cambio para los comentarios
           * 26-02-2020
           * INICIO
           */
          if (product.comentario != "") {
            this.alturaItems = this.alturaItems + 5;
            this.doc.text(20, this.alturaItems, "Observaciones: ");

            //let numberBreaks = product.comentario.match(/\n/g) || [];
            //let split = product.comentario.split("\n");
            let comentarioFinal: string = "";
            /*
                      split.forEach(s => {
                        if (s.length > 100) {
                          comentarioFinal = s.substring(0, 120);
                          comentarioFinal =
                            comentarioFinal + "\n" + s.substring(120, s.length);
                        } else {
                          comentarioFinal = comentarioFinal + "\n" + s;
                        }
                      });
            */

            comentarioFinal = product.comentario;
            let comentarioFinal2 = this.doc.splitTextToSize(comentarioFinal, 150);
            this.doc.text(comentarioFinal2, 40, this.alturaItems);

            //this.doc.text(product.comentario.toString(), 40, this.alturaItems);
            //this.doc.text(comentarioFinal, 40, this.alturaItems);

            //this.alturaItems = this.alturaItems + 3 * (numberBreaks.length + 2);
            this.alturaItems = this.alturaItems + 3 * comentarioFinal2.length;

          } else {
            this.alturaItems = this.alturaItems + 4;
          }
          /**
           * Cambio para los comentarios
           * 26-02-2020
           * FIN
           */
          this.doc.line(5, this.alturaItems, 205, this.alturaItems);
        }
      }

      this.doc.setProperties({
        title: this.paciente + ".pdf"
      });


      this.doc.output("dataurlnewwindow");

    });
  }
}

