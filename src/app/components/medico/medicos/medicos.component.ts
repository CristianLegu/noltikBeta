import { Component, OnInit, ViewChild } from '@angular/core';
import { Medico } from '../../../common/interface';
import { MedicosService } from 'src/app/services/medicos/medicos.service';
import { CustomPaginator } from 'src/app/CustomPaginator';
import { faSearch, faSync, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../common/dialog/dialog.component';
import { Router } from '@angular/router';
import { MatPaginatorIntl, MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator('Médicos por página') }]
})
export class MedicosComponent extends MatPaginatorIntl implements OnInit {

  length: number = 10;
  page_size: number = 30;
  page_number: number = 0;
  dataSource: Medico[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'area', 'perfil'];
  token: string;
  load: boolean = false;
  faSearch = faSearch;
  faSync = faSync;
  faUserMd = faUserMd;
  nombre: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private serviceM: MedicosService,
    private dialog: MatDialog,
    private router: Router) {
    super();
    /* const mat = new MatPaginatorIntl();
     mat.itemsPerPageLabel = 'Médicos por página';
   */
  }

  ngOnInit() {
    this.load = true;
    this.token = localStorage.getItem('token');
    this.nombre = '';
    this.serviceM.obtenerTotal(this.token, this.nombre)
      .then(ok => {
        this.length = ok;
        this.serviceM.obtenerMedicos(this.token, this.page_number, this.page_size, this.nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch((err => {
            let mensaje: string;
            this.load = false;
            mensaje = err.error.mensaje;//err.error.message;
            this.openDialog(mensaje);
          }))
      })
      .catch(err => {

        let mensaje: string;
        this.load = false;
        mensaje = err.error.mensaje;//err.error.message;
        this.openDialog(mensaje);

      });
  }

  handlePage(e: PageEvent) {
    this.load = true;
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex;

    this.serviceM.obtenerMedicos(this.token, this.page_number, this.page_size, this.nombre)
      .then(ok => {

        this.dataSource = ok.body;
        this.load = false;
      })
      .catch(err => {

        let mensaje: string;
        this.load = false;
        mensaje = err.error.mensaje;  // err.error.message;
        this.openDialog(mensaje);
      });

  }

  refresh() {
    this.nombre = '';
    this.page_size = 30;
    this.load = true;
    this.serviceM.obtenerTotal(this.token, this.nombre)
      .then(ok => {
        this.length = ok;
        this.serviceM.obtenerMedicos(this.token, this.page_number, this.page_size, '')
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            let mensaje: string;
            this.load = false;
            mensaje = err.error.mensaje; //err.error.message;
            this.openDialog(mensaje);
          });
      })
      .catch(error => {
        let mensaje: string;
        this.load = false;
        mensaje = error.error.mensaje;  //error.error.message;
        this.openDialog(mensaje);
      });
  }

  buscar(nombre: string) {

    this.paginator.pageIndex = 0;
    this.page_number = 0;
    this.page_size = 50;

    this.load = true;
    this.serviceM.obtenerTotal(this.token, this.nombre)
      .then(ok => {
        this.length = ok;
        this.serviceM.obtenerMedicos(this.token, this.page_number, this.page_size, nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            let mensaje: string;
            this.load = false;
            mensaje = err.error.mensaje;//err.error.message;
            this.openDialog(mensaje);
          })
      })
      .catch(error => {
        let mensaje: string;
        this.load = false;
        mensaje = error.error.mensaje;  //error.error.message;
        this.openDialog(mensaje);
      })
      ;
  }

  pageSizeOptions = [10, 30, 50, 100];

  openDialog(mensaje: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { mensaje: mensaje }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(["/"]);
      this.load = false;
    });
  }
}
