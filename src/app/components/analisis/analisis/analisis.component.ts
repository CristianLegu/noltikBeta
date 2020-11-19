import { Component, OnInit } from '@angular/core';
import { Analisis } from '../../../common/interface';
import { CustomPaginator } from 'src/app/CustomPaginator';
import { AnalisisService } from '../../../services/analisis/analisis.service';
import { PacienteService } from "../../../services/paciente/paciente.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../../common/dialog/dialog.component";
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatCheckbox } from '@angular/material/checkbox';
import { SidenavComponent } from 'src/app/sidenav/sidenav.component';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator('Análisis por página') }
  ]
})
export class AnalisisComponent extends MatPaginatorIntl implements OnInit {

  length: number;
  page_size: number = 50;
  page_number: number = 0;
  displayedColumns: string[] = ['analisis', 'fecha', 'medico', 'imprimir','enviar'];
  token: string;
  prefix: string;
  load: boolean = false;
  actRoute: number;
  dataSource: Analisis[] = [];
  analisisImp: Array<string> = [];
  analisisEnv: Array<string> = [];
  buttonImp: boolean = false;
  buttonEnv: boolean = false;
  selected: boolean;
  mensaje: string;
  paciente: string;
  showMedico: boolean = true;

  ruta: string;

  constructor(
    private altapaciente: PacienteService,
    private serviceA: AnalisisService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private sidenav: SidenavComponent = new SidenavComponent(router, authService)
  ) {
    super();

    this.actRoute = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {

    this.load = true;
    this.token = localStorage.getItem('token');
    this.prefix = localStorage.getItem('prefix');

    this.altapaciente
      .getPaciente(this.token, this.prefix, this.actRoute)
      .then(ok => {
        this.paciente = ok.body.nombre;

        if (this.sidenav.innerWidth < 920) {
          this.displayedColumns = ['analisis', 'fecha', 'imprimir','enviar'];
          this.showMedico = false;
          this.paciente = this.paciente.substr(0, 30);
          this.paciente = this.paciente.concat('...');
        }

      })
      .catch(error => {
        this.load = false;
        this.mensaje = error.error.mensaje;//error.message;
        this.openDialog();
      });

    this.serviceA.obtenerTotal(this.token, this.prefix, this.actRoute)
      .then(ok => {
        this.length = ok;
        this.serviceA.getLista(this.token, this.prefix, this.page_number, this.page_size, this.actRoute)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(error => {
            this.load = false;
            this.mensaje = error.error.mensaje;
            this.openDialog();
          })
      })
      .catch(error => {
        this.load = false;
        this.mensaje = error.error.mensaje;
        this.openDialog();
      });

  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { mensaje: this.mensaje }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(["/pacientes"]);
    });
  }

  handlePage(e: PageEvent) {

    this.load = true;
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex;
    this.serviceA.getLista(this.token, this.prefix, this.page_number, this.page_size, this.actRoute)
      .then(ok => {
        this.dataSource = ok.body;
        //console.log(ok.body)
        this.load = false;
      })
      .catch(err => {
        this.load = false;
      });
  }


  pageSizeOptions = [10, 50, 100, 300];

  backlist() {
    this.router.navigateByUrl('/pacientes');
  }

  //Con este metodo se obtienen los ID's de los análisis seleccionados.
  somethingClick(checkbox: MatCheckbox, item: { id: string }) {
    var cont = this.analisisImp.length;
    if (checkbox.checked == false) {
      this.analisisImp[cont] = item.id;
    } else {
      var pos = this.analisisImp.indexOf(item.id);
      this.analisisImp.splice(pos, 1);
    }

    if (this.analisisImp.length > 0) {
      this.buttonImp = true;
    } else {
      this.buttonImp = false;
    }
    this.ruta = "/pacientes/" + this.actRoute + "/analisis/imprimir/" + this.analisisImp;
    console.log(this.ruta);
  }

  somethingClick2(checkbox: MatCheckbox, item: { id: string }) {
    var cont = this.analisisEnv.length;
    console.log(cont);
    if (checkbox.checked == false) {
      this.analisisEnv[cont] = item.id;
    } else {
      var pos = this.analisisEnv.indexOf(item.id);
      this.analisisEnv.splice(pos, 1);
    }

    if (this.analisisEnv.length > 0) {
      this.buttonEnv = true;
    } else {
      this.buttonEnv = false;
    }
    this.ruta = "/pacientes/" + this.actRoute + "/analisis/enviar/" + this.analisisEnv;
    console.log(this.ruta);
  }





  onActivate(event) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
}
