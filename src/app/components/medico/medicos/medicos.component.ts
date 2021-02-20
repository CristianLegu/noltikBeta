import { Component, OnInit, ViewChild } from '@angular/core';
import { Medico } from '../../../common/interface';
import { MedicosService } from 'src/app/services/medicos/medicos.service';
import { CustomPaginator } from 'src/app/CustomPaginator';
import { faSearch, faSync, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../common/dialog/dialog.component';
import { Router } from '@angular/router';
import { MatPaginatorIntl, MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator('Médicos por página') }]
})
export class MedicosComponent extends MatPaginatorIntl implements OnInit {

  length: number = 10;
  page_size: number = 10;
  page_number: number = 0;
  dataSource: Medico[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'area'];
  token: string;
  prefix: string = "";
  load: boolean = false;
  faSearch = faSearch;
  faSync = faSync;
  faUserMd = faUserMd;
  nombre: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private serviceM: MedicosService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {

    this.load = true;
    this.token = localStorage.getItem('token');
    this.prefix = localStorage.getItem('prefix');

    if (this.prefix.length == 0) {
      this.openDialog('Error al procesar datos', 401);
      return;
    }

    this.nombre = '';
    this.serviceM.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;
        this.serviceM.obtenerMedicos(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch((err => {
            let mensaje: string;
            this.load = false;
            if (err.status == 401) {
              mensaje = 'Sin autorización';
            }
            else {
              mensaje = err.error.mensaje;//error.message;
            }
            this.openDialog(mensaje, err.status);
          }))
      })
      .catch(err => {

        let mensaje: string;
        this.load = false;
        if (err.error == null) {
          mensaje = err.message;
        }
        else {
          mensaje = err.error.mensaje;
        }

        //Valida el tipo de error
        if (err.status == 401) {
          let m = "Sesión expiró, debe de iniciar sesión nuevamente.";
          this.openDialog(m, err.status);
        }
        else {
          this.openDialog(mensaje);
        }

      });
  }

  handlePage(e: PageEvent) {

    this.load = true;
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex;

    this.serviceM.obtenerMedicos(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
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
    this.serviceM.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;
        this.serviceM.obtenerMedicos(this.token, this.prefix, this.page_number, this.page_size, '')
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            let mensaje: string;
            this.load = false;
            if (err.status == 401) {
              mensaje = 'Sin autorización';
            }
            else {
              mensaje = err.error.mensaje;//error.message;
            }
            this.openDialog(mensaje, err.status);
          });
      })
      .catch(error => {
        let mensaje: string;
        this.load = false;
        if (error.status == 401) {
          mensaje = 'Sin autorización';
        }
        else {
          mensaje = error.error.mensaje;//error.message;
        }
        this.openDialog(mensaje, error.status);
      });
  }

  buscar(nombre: string) {

    this.paginator.pageIndex = 0;
    this.page_number = 0;
    this.page_size = 50;

    this.load = true;
    this.serviceM.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;
        this.serviceM.obtenerMedicos(this.token, this.prefix, this.page_number, this.page_size, nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            let mensaje: string;
            this.load = false;
            if (err.status == 401) {
              mensaje = 'Sin autorización';
            }
            else {
              mensaje = err.error.mensaje;//error.message;
            }
            this.openDialog(mensaje, err.status);
          })
      })
      .catch(error => {
        let mensaje: string;
        this.load = false;
        if (error.status == 401) {
          mensaje = 'Sin autorización';
        }
        else {
          mensaje = error.error.mensaje;//error.message;
        }
        this.openDialog(mensaje, error.status);
      })
      ;
  }

  pageSizeOptions = [10, 30, 50, 100, 500, 1000];

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
        this.router.navigate(["/medicos"]);
        this.load = false;
      });
    }

  }
}
