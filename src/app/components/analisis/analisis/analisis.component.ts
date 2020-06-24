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
  displayedColumns: string[] = ['id', 'analisis', 'fecha', 'medico', 'imprimir'];
  token: string;
  load: boolean = false;
  actRoute: number;
  dataSource: Analisis[] = [];
  analisisImp: Array<string> = [];
  buttonImp: boolean = false;
  selected: boolean;
  mensaje: string;
  paciente: string;

  constructor(
    private altapaciente: PacienteService,
    private serviceA: AnalisisService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    super();

    this.actRoute = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {

    this.load = true;
    this.token = localStorage.getItem('token');

    this.altapaciente
      .getPaciente(this.token, this.actRoute)
      .then(ok => {
        this.paciente = ok.body.nombre;
      })
      .catch(error => {
        this.load = false;
        this.mensaje = error.error.mensaje;//error.message;
        this.openDialog();
      });

    this.serviceA.obtenerTotal(this.token, this.actRoute)
      .then(ok => {
        this.length = ok;
        this.serviceA.getLista(this.token, this.page_number, this.page_size, this.actRoute)
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
      //this.router.navigate(["/analisis"]);
    });
  }

  handlePage(e: PageEvent) {

    this.load = true;
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex;
    this.serviceA.getLista(this.token, this.page_number, this.page_size, this.actRoute)
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
  }

  onActivate(event) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
}
