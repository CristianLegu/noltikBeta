import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AnalisisService } from "../../../services/analisis/analisis.service";
import {
  Analisis,
  JSONEstudio,
  ItemsEstudio,
  Patient,
  DialogDataEliminar
} from "../../../common/interface";
import {
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup
} from "@angular/forms";
import { MedicosService } from "../../../services/medicos/medicos.service";
import { EstudiosService } from "../../../services/estudios/estudios.service";
import { PacienteService } from "../../../services/paciente/paciente.service";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { faSearchPlus, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { MatDialog } from "@angular/material/dialog";
import { DialogeliminarComponent } from "../../../common/dialogeliminar/dialogeliminar.component";
import { DialogComponent } from "../../../common/dialog/dialog.component";
import * as moment from 'moment-timezone';
import { DatePipe } from '@angular/common';

export interface NombreMedico {
  nombre: string;
  area: string;
}
export interface NombreEstudio {
  nombre: string;
  id: number;
}
export interface EstudioPrueba {
  id: number;
  nombre: string;
  json_estudio: JSONEstudio[];
}
@Component({
  selector: "app-unanalisis",
  templateUrl: "./unanalisis.component.html",
  styleUrls: ["./unanalisis.component.scss"]
})
export class UnanalisisComponent implements OnInit {
  //Data element para Form
  data = {
    analisis: "",
    area: "",
    comentario: "",
    fecha: "",
    paciente: "",
    medico: "",
    json: [
      {
        subtitulo: "",
        items: [
          {
            prueba: "",
            resultados: "",
            unidades: "",
            referencia: "",
            comentario: ""
          }
        ]
      }
    ]
  };

  idPaciente: string;
  idAnalisis: string;

  com: number = 0;
  subtitulofinal: string;
  noBtn: boolean = false;
  btn: boolean = false;

  altaAnalisis: FormGroup;
  fecha1: string;
  myDate = new Date();
  analisisNuevo: Analisis = {
    analisis: "",
    area: "",
    comentario: "",
    fecha: this.fecha1,
    id: 0,
    json: [],
    medico: "",
    paciente: ""
  };

  dataEliminar: DialogDataEliminar = {
    id: "",
    jwt: "",
    prefix: "",
    mensaje: "",
    tipo: "",
    idpaciente: ""
  };

  itemE: ItemsEstudio[] = [];
  jsonE: JSONEstudio[] = [];

  itemMod: ItemsEstudio[] = [];
  jsonEstudioMod: JSONEstudio[] = [];

  //Parte de las opciones de las listas
  filteredOptions: Observable<NombreMedico[]>;
  filteredEstudio: Observable<NombreEstudio[]>;

  //Arrays para las opciones en las listas
  nombreMed: NombreMedico[] = [];
  nombreEst: NombreEstudio[] = [];

  //Son para cuando vas escribiendo, te da la opcion
  fControl = new FormControl();
  fControlE = new FormControl();

  jwt: string;
  prefix: string;
  load: boolean = false;
  mensaje: string;
  mensajeDialog: string;

  analisis: Analisis;
  analisisIn: Analisis;

  //Iconos
  faSearchPlus = faSearchPlus;
  faPlusSquare = faPlusSquare;

  areaM: string;
  medico: string;
  estudio: string;
  idEstudio: number;

  estudioI: EstudioPrueba;

  timeZone: string;

  //Variables rol
  rol: string;
  UserPerm: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: AnalisisService,
    private serviceM: MedicosService,
    private serviceEstudio: EstudiosService,
    private servicePaciente: PacienteService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
  ) {
    this.fecha1 = this.datePipe.transform(this.myDate, 'yyyy-MM-dd') + "  00:00:00";

    //Obtenemos los id's
    this.idPaciente = this.activatedRoute.snapshot.params["id"];
    this.idAnalisis = this.activatedRoute.snapshot.params["ia"];

    this.altaAnalisis = this.fb.group({
      analisis: [""],
      area: ["",],
      comentario: [""],
      fecha: [""],
      paciente: [""],
      medico: [""],
      json: this.fb.array([])
    });

  }

  ngOnInit() {
    this.jwt = localStorage.getItem("token");
    this.prefix = localStorage.getItem('prefix');
    this.rol = localStorage.getItem('role');

    this.timeZone = moment.tz.guess();
    this.load = true;

    //Valida rol
    if (this.rol == 'ROLE_ADMIN') {
      this.UserPerm = true;
    }

    if (this.idAnalisis != "0") {
      this.service
        .getUnAnalisis(this.jwt, this.prefix, this.idPaciente, this.idAnalisis)
        .then(ok => {
          this.analisis = ok.body;

          let an = this.analisisMod(this.analisis);

          this.pasaValores(an);
          this.load = false;
        })
        .catch(error => {
          this.load = false;
          this.mensajeDialog = error.error.mensaje;
          this.openDialog(this.mensajeDialog);
        });
    } else {
      this.mensaje = "Crear Análisis";

      //Estos metodos son para las opciones cuando el user va escribiendo
      this.paciente(this.idPaciente);
      this.medicos();
      this.estudios();
    }
  }

  pacienteE: Patient = {
    ciudad: "",
    codigopostal: 0,
    direccion: "",
    email: "",
    estado: "",
    genero: "",
    id: 0,
    nacimiento: new Date(),
    nombre: "",
    rfcjson: "",
    telefonos: [],
    tiposangre: ""
  };

  paciente(id: any) {
    this.servicePaciente
      .getPaciente(this.jwt, this.prefix, id)
      .then(respose => {
        this.pacienteE = respose.body;
      })
      .catch(error => {
        this.load = false;
        this.mensajeDialog = error.error.mensaje;
        this.openDialog(this.mensajeDialog);
      });
  }

  pasaValores(an: Analisis) {
    this.analisisIn = an;

    if (this.idAnalisis != "0") {
      this.mensaje = this.analisisIn.analisis;
    }
    else {
      this.mensaje = "Crear Análisis";
    }
    this.altaAnalisis.patchValue({
      analisis: this.analisisIn.analisis,
      area: this.analisisIn.area,
      comentario: this.analisisIn.comentario,
      fecha: new Date(this.analisisIn.fecha),
      medico: this.analisisIn.medico
    });

    this.analisisIn.json.forEach(v => {
      let c = <FormArray>this.altaAnalisis.controls.json;

      c.push(
        this.fb.group({
          subtitulo: [v.subtitulo],
          analisis: [v.analisis],
          comentario: [v.comentario],
          items: this.setItems(v.items)
        })
      );
    });

  }

  setItems(i) {
    let arr = new FormArray([]);

    i.forEach(v => {
      arr.push(
        this.fb.group({
          prueba: v.prueba,
          resultados: v.resultados,
          unidades: v.unidades,
          referencia: v.referencia,
          comentario: v.comentario
        })
      );
    });
    return arr;
  }

  analisisMod(a: Analisis): Analisis {
    // console.log(a);
    this.analisisNuevo.analisis = a.analisis;
    this.analisisNuevo.area = a.area;
    this.analisisNuevo.comentario = a.comentario;
    this.analisisNuevo.fecha = a.fecha;
    this.analisisNuevo.medico = a.medico;
    this.analisisNuevo.paciente = a.paciente;
    this.analisisNuevo.id = a.id;

    a.json.forEach(is => {
      is.items.forEach(i => {
        this.itemMod.push({
          prueba: i.prueba,
          referencia: i.referencia,
          resultados: i.resultados,
          unidades: i.unidades,
          comentario: i.comentario
        });
      });

      this.jsonEstudioMod.push({
        items: this.itemMod,
        subtitulo: is.subtitulo,
        analisis: a.analisis,
        comentario: a.comentario
      });
      this.subtitulofinal = is.subtitulo;
      this.itemMod = [];
    });

    // console.log(this.jsonEstudioMod);
    this.analisisNuevo.json = this.jsonEstudioMod;

    this.itemMod = [];
    this.jsonEstudioMod = [];

    return this.analisisNuevo;
  }

  private medicos() {
    this.load = true;

    //Igual que estudios, traemos todos los medicos
    this.serviceM
      .obtenerTotal(this.jwt, this.prefix, "")
      .then(ok => {
        this.serviceM
          .obtenerMedicos(this.jwt, this.prefix, 0, ok, "")
          .then(ok => {
            //Creamos JSON de array con 'nombre', 'area'
            ok.body.forEach(valor => {
              this.nombreMed.push({
                nombre: valor.nombre,
                area: valor.area
              });
            });

            this.load = false;
            //Se crean los filtros
            this.filteredOptions = this.fControl.valueChanges.pipe(
              startWith(""),
              map(value => (typeof value === "string" ? value : value.name)),
              map(name => (name ? this._filter(name) : this.nombreMed.slice()))
            );
          })
          .catch(error => {
            this.load = false;
            this.mensajeDialog = error.error.mensaje;
            this.openDialog(this.mensajeDialog);
          });
      })
      .catch(error => {
        this.load = false;
        this.mensajeDialog = error.error.mensaje;
        this.openDialog(this.mensajeDialog);
      });
  }
  private estudios() {
    this.load = true;
    //Obtenemos los estudios, todos, por ahora es como lo haremos
    this.serviceEstudio
      .obtenerTotal(this.jwt, this.prefix, "")
      .then(ok => {
        this.serviceEstudio
          .obtenerEstudios(this.jwt, this.prefix, 0, ok, "")
          .then(response => {
            //Creamos un JSON de Array de los estudios,
            response.body.forEach(valor => {
              this.nombreEst.push({
                nombre: valor.nombre,
                id: valor.id
              });

              this.load = false;
              //Hacemos los filtros
              this.filteredEstudio = this.fControlE.valueChanges.pipe(
                startWith(""),
                map(value => (typeof value === "string" ? value : value.name)),
                map(name =>
                  name ? this._filterE(name) : this.nombreEst.slice()
                )
              );
            });
          })
          .catch(error => {
            this.load = false;
            this.mensajeDialog = error.error.mensaje;
            this.openDialog(this.mensajeDialog);
          });
      })
      .catch(error => {
        this.load = false;
        this.mensajeDialog = error.error.mensaje;
        this.openDialog(this.mensajeDialog);
      });
  }

  displayFnE(est?: NombreEstudio): string | undefined {
    //console.log(est);
    return est ? est.nombre : undefined;
  }

  private _filterE(name: string): NombreEstudio[] {
    const filterValue = name.toLowerCase();

    return this.nombreEst.filter(
      option => option.nombre.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayFn(med?: NombreMedico): string | undefined {
    return med ? med.nombre : undefined;
  }

  private _filter(name: string): NombreMedico[] {
    const filterValue = name.toLowerCase();

    return this.nombreMed.filter(
      option => option.nombre.toLowerCase().indexOf(filterValue) === 0
    );
  }

  //Otenemos el estudio una vez que se selecciona el deseado
  getEstudio(event: any) {
    this.load = true;
    this.estudio = event.option.value.nombre;
    this.idEstudio = event.option.value.id;
    //console.log(this.idEstudio)
    this.serviceEstudio.obtenerEstudio(this.jwt, this.prefix, this.idEstudio)
      .then(response => {
        this.load = false;
        //Pasamos la respuesta a la variable
        this.estudioI = response.body;
        this.agregaEstudio();
      })
      .catch(error => {
        this.load = false;
        this.mensajeDialog = error.error.mensaje;
        this.openDialog(this.mensajeDialog);
      });
    /*
        this.serviceEstudio
          .obtenerEstudios(this.jwt, 0, 1, this.estudio)
          .then(response => {
            this.load = false;
            //Pasamos la respuesta a la variable
            this.estudioI = response.body;
            // console.log(this.estudioI);
          })
          .catch(error => {
            this.load = false;
            this.mensajeDialog = error.error.mensaje;
            this.openDialog(this.mensajeDialog);
          });
    */

  }

  getArea(event: any) {
    this.areaM = event.option.value.area;
    this.medico = event.option.value.nombre;
  }
  //
  agregaEstudio() {
    this.btn = true;
    this.analisis = {
      analisis: "",
      area: "",
      comentario: "",
      fecha: this.fecha1,
      id: 0,
      json: [],
      medico: "",
      paciente: ""
    };

    this.fControlE.setValue('');

    this.com = 1;

    this.estudioI.json_estudio.forEach(is => {
      is.items.forEach(i => {
        this.itemE.push({
          prueba: i.prueba,
          resultados: i.resultados,
          unidades: i.unidades,
          referencia: i.referencia,
          comentario: i.comentario
        });

      });

      this.jsonE.push({
        subtitulo: is.subtitulo,
        items: this.itemE
      });
      this.subtitulofinal = is.subtitulo;
      this.itemE = [];
    });

    this.analisis.area = this.areaM;
    this.analisis.json = this.jsonE;
    this.analisis.medico = this.medico;
    this.analisis.analisis = this.estudio;

    this.jsonE = [];
    this.itemE = [];

    let an = this.analisisMod(this.analisis);

    this.pasaValores(an);
    delete this.estudioI;
  }

  backListA() {
    this.router.navigate(["pacientes", this.idPaciente, "analisis"]);
  }

  eliminarEstudio(i: number) {
    let control = <FormArray>this.altaAnalisis.controls.json;
    delete this.estudioI;
    control.removeAt(i);

    this.analisisIn.json.splice(i, 1);
    if (control.length == 0) {
      this.com = 0;
      this.btn = false;
    }
  }

  guardar() {
    this.load = true;
    let response: string = "";
    if (this.idAnalisis == "0") {
      console.log(this.analisis);
      let valor = <FormArray>this.altaAnalisis.controls.json;
      let total: number = 0;

      // console.log(valor.length);

      total = valor.length - 1;
      // console.log(total);

      if (valor.length > 0) {
        // valor.controls.forEach((i, index) => {
        //console.log(this.altaAnalisis);
        let a = this.generaNvaEstAnalisis(valor, this.altaAnalisis);

        a.forEach((i, index) => {
          this.service
            .crear(this.jwt, this.prefix, this.idPaciente, i, this.timeZone)
            .then(ok => {
              response = ok.mensaje;
              this.load = false;
              // console.log(total);
              // console.log(index);
              // console.log(ok);
              if (ok.statusCode == "OK") {
                this.openDialog(response);
                this.router.navigate([
                  "pacientes",
                  this.idPaciente,
                  "analisis"
                ]);
              }
            })
            .catch(error => {
              this.load = false;
              this.mensajeDialog = error.error.mensaje;
              this.openDialog(this.mensajeDialog);
            });
          // this.load = false;
        });
      } else {
        let m = "Debe de Agregar Estudio";
        this.openDialog(m);
        this.load = false;
      }
    } else {
      let response: string = "";
      let valor = <FormArray>this.altaAnalisis.controls.json;
      let total: number = 0;

      total = valor.length - 1;

      let a = this.generaNvaEstAnalisis(valor, this.altaAnalisis);
      a.forEach((i, index) => {
        this.service
          .modificar(this.jwt, this.prefix, this.idPaciente, this.idAnalisis, i, this.timeZone)
          .then(ok => {
            this.load = false;
            if (ok.statusCode == "OK") {
              this.openDialog(ok.mensaje);
              this.router.navigate(["pacientes", this.idPaciente, "analisis"]);
            }
          })
          .catch(error => {
            this.load = false;
            this.mensajeDialog = error.error.mensaje;
            this.openDialog(this.mensajeDialog);
          });
      });
    }
  }

  generaNvaEstAnalisis(json: any, analisis: FormGroup): Analisis[] {
    let a: Analisis[] = [
      {
        analisis: "",
        area: "",
        comentario: "",
        fecha: this.fecha1,//fecha: new Date(),
        id: 0,
        json: [],
        medico: "",
        paciente: ""
      }
    ];

    let name: string = "";
    // let arreglo: number[] = [];
    let i: number = 0;
    let numarreglos: number = 0;
    json.controls.forEach((e, index) => {
      if (name == analisis.value.json[index].analisis || name == "") {
        i = i + 1;
        // arreglo[numarreglos] = i;
        name = analisis.value.json[index].analisis;
        a[numarreglos].paciente = this.pacienteE.nombre;
        a[numarreglos].medico = analisis.get("medico").value;
        a[numarreglos].area = analisis.get("area").value;
        if (this.idAnalisis != "0") a[numarreglos].id = +this.idAnalisis;

        let itemsEstudio: ItemsEstudio[] = [];
        a[numarreglos].analisis = analisis.value.json[index].analisis;
        a[numarreglos].comentario = analisis.value.json[index].comentario;

        analisis.value.json[index].items.forEach(i => {
          itemsEstudio.push({
            prueba: i.prueba,
            referencia: i.referencia,
            resultados: i.resultados,
            unidades: i.unidades,
            comentario: i.comentario
          });
        });

        a[numarreglos].json.push({
          subtitulo: analisis.value.json[index].subtitulo,
          items: itemsEstudio
        });
        // console.log(a);
      } else {
        i = 0;
        i = i + 1;
        numarreglos = numarreglos + 1;
        name = analisis.value.json[index].analisis;
        // console.log(a);
        a.push({
          analisis: "",
          area: "",
          comentario: "",
          fecha: this.fecha1,// fecha: new Date(),
          id: 0,
          json: [],
          medico: "",
          paciente: ""
        });
        a[numarreglos].paciente = this.pacienteE.nombre;
        a[numarreglos].medico = analisis.get("medico").value;
        a[numarreglos].area = analisis.get("area").value;
        if (this.idAnalisis != "0") a[numarreglos].id = +this.idAnalisis;

        let itemsEstudio: ItemsEstudio[] = [];
        a[numarreglos].analisis = analisis.value.json[index].analisis;
        a[numarreglos].comentario = analisis.value.json[index].comentario;

        analisis.value.json[index].items.forEach(i => {
          itemsEstudio.push({
            prueba: i.prueba,
            referencia: i.referencia,
            resultados: i.resultados,
            unidades: i.unidades,
            comentario: i.comentario
          });
        });

        a[numarreglos].json.push({
          subtitulo: analisis.value.json[index].subtitulo,
          items: itemsEstudio
        });
      }
    });
    return a;
  }

  eliminar() {
    this.load = true;
    this.openDialogEliminar();
  }

  openDialogEliminar() {
    this.load = false;

    this.dataEliminar.mensaje =
      "¿Desea eliminar el análisis " + this.analisis.analisis + "?";
    this.dataEliminar.id = this.idAnalisis;
    this.dataEliminar.jwt = this.jwt;
    this.dataEliminar.prefix = this.prefix;
    this.dataEliminar.tipo = "analisis";
    this.dataEliminar.idpaciente = this.idPaciente;

    const dialogRef = this.dialog.open(DialogeliminarComponent, {
      width: "350px",
      data: {
        mensaje: this.dataEliminar.mensaje,
        datos: this.dataEliminar
      }
    });
  }

  openDialog(m: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { mensaje: m }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.router.navigate(["/analisis"]);
    });
  }
}
