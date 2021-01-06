import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from '../../../common/interface';
import { PacienteService } from '../../../services/paciente/paciente.service';
import { faSearch, faSync } from '@fortawesome/free-solid-svg-icons';
import { CustomPaginator } from '../../../CustomPaginator';
import { DialogComponent } from '../../../common/dialog/dialog.component';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth/auth.service";
import { MatPaginatorIntl, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SidenavComponent } from 'src/app/sidenav/sidenav.component';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator('Pacientes por página') }]
})
export class PacientesComponent extends MatPaginatorIntl implements OnInit {

  length: number;
  page_size: number = 10;
  page_number: number = 0;
  dataSource: Patient[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'analisis'];
  token: string;
  prefix: string;
  load: boolean = false;
  faSearch = faSearch;
  faSync = faSync;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  nombre: string;
  mensaje: string = '';


  constructor(
    private service: PacienteService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private sidenav: SidenavComponent
  ) {
    super();
  }

  ngOnInit() {
    this.load = true;
    this.token = localStorage.getItem('token');
    this.prefix = localStorage.getItem('prefix');
    this.nombre = '';
    this.service.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;

        this.service.getpacientes(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            this.load = false;
            console.log(err);
            this.mensaje = err.message;//err.error.message;
            this.openDialog(this.mensaje);
          });
      })
      .catch(error => {
        this.load = false;
        console.log(error);
        if (error.error == null) {
          this.mensaje = error.message;
        }
        else {
          this.mensaje = error.error.mensaje;
        }

        if (error.status == 401) {
          let m = "Sesión expiró, debe de iniciar sesión nuevamente.";
          this.openDialog(m, error.status);
        } else
          this.openDialog(this.mensaje);
      });

  }

  handlePage(e: PageEvent) {
    this.load = true;
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex;
    this.service.getpacientes(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
      .then(ok => {
        this.dataSource = ok.body;
        this.load = false;
      })
      .catch(err => {
        this.load = false;
        this.mensaje = err.error.mensaje;//err.error.message;
        this.openDialog(this.mensaje);
      });
  }

  refresh() {
    this.ngOnInit();

  }

  buscar(nombre: string) {


    this.paginator.pageIndex = 0;

    this.page_number = 0;
    this.page_size = 50;

    this.load = true;
    this.service.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;
        this.service.getpacientes(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            this.load = false;
            this.mensaje = err.error.mensaje;//err.error.message;
            this.openDialog(this.mensaje);
          })
      })
      .catch(error => {
        this.load = false;
        this.mensaje = error.error.mensaje;//error.error.message;
        this.openDialog(this.mensaje);
      });
  }

  pageSizeOptions = [10, 30, 50, 100, 500, 1000];

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
    } else {

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(["/pacientes"]);
      });
    }
  }
}
