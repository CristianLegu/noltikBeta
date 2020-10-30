import { Component, OnInit, ViewChild } from '@angular/core';

import { faPlusCircle, faSearch, faSync } from '@fortawesome/free-solid-svg-icons';
import { CustomPaginator } from 'src/app/CustomPaginator';
import { EstudiosService } from 'src/app/services/estudios/estudios.service';
import { Estudio } from 'src/app/common/interface';
import { DialogComponent } from 'src/app/common/dialog/dialog.component';
import { Router } from '@angular/router';
import { MatPaginatorIntl, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SidenavComponent } from 'src/app/sidenav/sidenav.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-estudios',
  templateUrl: './estudios.component.html',
  styleUrls: ['./estudios.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator('Estudios por página') }]
})
export class EstudiosComponent extends MatPaginatorIntl implements OnInit {

  length: number = 10;
  page_size: number = 30;
  page_number: number = 0;
  dataSource: Estudio;
  displayedColumns: string[] = ['id', 'estudio'];
  faPlusCircle = faPlusCircle;
  faSync = faSync;
  faSearch = faSearch;
  token: string;
  prefix: string;
  load: boolean = false;
  nombre: string;
  mensaje: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private estudiosServices: EstudiosService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit() {

    this.load = true;
    this.token = localStorage.getItem('token');
    this.prefix = localStorage.getItem('prefix');
    this.nombre = '';
    this.estudiosServices.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        console.log(ok);
        this.length = ok;
        this.estudiosServices.obtenerEstudios(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch((err => {
            console.log(err);
            let mensaje: string;
            if (err.error.status === 401) {
              mensaje = 'Sin autorización';
            }
            else {
              mensaje = err.error.message;
            }
            this.load = false;
            this.openDialog(mensaje, err.error.status);
          }))
      })
      .catch(err => {
        let mensaje: string;
        if (err.error.status === 401) {
          mensaje = 'Sin autorización';
        }
        else {
          mensaje = err.error.message;
        }
        this.load = false;
        this.openDialog(mensaje, err.error.status);
      });
  }

  handlePage(e: PageEvent) {
    this.load = true;
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex;

    this.estudiosServices.obtenerEstudios(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
      .then(ok => {

        this.dataSource = ok.body;
        this.load = false;
      })
      .catch(err => {
        let mensaje: string;
        this.load = false;
        mensaje = err.error.mensaje;
        this.openDialog(mensaje);
      });

  }

  buscar(nombre: string) {

    this.paginator.pageIndex = 0;
    this.page_number = 0;
    this.page_size = 50;

    this.load = true;
    this.estudiosServices.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;
        this.estudiosServices.obtenerEstudios(this.token, this.prefix, this.page_number, this.page_size, nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            let mensaje: string;
            this.load = false;
            mensaje = err.error.mensaje;
            this.openDialog(mensaje);
          })
      })
      .catch(error => {
        let mensaje: string;
        this.load = false;
        mensaje = error.error.mensaje;
        this.openDialog(mensaje);
      })
      ;
  }

  refresh() {

    this.nombre = '';
    this.page_size = 30;
    this.load = true;
    this.estudiosServices.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;
        this.estudiosServices.obtenerEstudios(this.token, this.prefix, this.page_number, this.page_size, '')
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            let mensaje: string;
            this.load = false;
            mensaje = err.error.mensaje;
            this.openDialog(mensaje);
          });
      })
      .catch(error => {
        let mensaje: string;
        this.load = false;
        mensaje = error.error.mensaje;
        this.openDialog(mensaje);
      });
  }

  openDialog(mensaje: string, status?: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: { mensaje: mensaje }
    });

    if (status == 401) {
      dialogRef.afterClosed().subscribe(result => {
        this.authService.logout();
        this.router.navigate(["/ingresar"]);
      });
    }
    else {
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(["/estudios"]);
      });
    }

  }

  pageSizeOptions = [10, 30, 50, 100];
}
