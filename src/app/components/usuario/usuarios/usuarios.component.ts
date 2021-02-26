import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Usuario } from 'src/app/common/interface';
import { CustomPaginator } from 'src/app/CustomPaginator';
import { faSearch, faSync } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from '../../../common/dialog/dialog.component';
import { Router } from '@angular/router';
import { MatPaginatorIntl, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator('Usuarios por página') }]
})
export class UsuariosComponent extends MatPaginatorIntl implements OnInit {
  length: number;
  page_size: number = 10;
  page_number: number = 0;
  dataSource: Usuario[] = [];
  displayedColumns: string[] = ['id', 'usuario'];
  token: string;
  prefix: string = "";
  load: boolean = false;
  faSearch = faSearch;
  faSync = faSync;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  nombre: string;
  constructor(
    private service: UsuarioService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
  ) {
    super();
    const mat = new MatPaginatorIntl();
    mat.itemsPerPageLabel = 'Pacientes por página';
    mat.getRangeLabel(69, 2, 69);
  }


  ngOnInit() {

    this.load = true;
    this.token = localStorage.getItem('token');
    this.prefix = localStorage.getItem('prefix');

    if (this.prefix != null && this.prefix.length == 0) {
      this.openDialog('Error al procesar datos', 401);
      return;
    }
    this.nombre = '';

    this.service.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;

        this.service.obtenerLista(this.token, this.prefix, this.page_number, this.page_size,
          this.nombre)
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
      .catch(err => {
        let mensaje: string;
        //console.log(err);
        if (err.status == 401) {
          mensaje = 'Sesión ha expirado, intenta acceder de nuevo';
          this.openDialog(mensaje, 401);
          //this.router.navigate(["/ingresar"]);
        } else {

          if (err.status == 403) {
            mensaje = 'Acceso denegado';
            this.openDialog(mensaje);
          }
          else {
            mensaje = err.mensaje;
            this.openDialog(mensaje);
          }
        }
        this.load = false;
      })
  }

  handlePage(e: PageEvent) {
    this.load = true;
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex;
    this.service.obtenerLista(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
      .then(ok => {
        this.dataSource = ok.body;
        this.load = false;
      })
      .catch(err => {
        let mensaje: string;
        mensaje = err.error.mensaje;
        this.openDialog(mensaje);
        this.load = false;
      });
  }

  refresh() {

    this.nombre = '';
    this.page_size = 30;
    this.load = true;
    this.service.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;
        this.service.obtenerLista(this.token, this.prefix, this.page_number, this.page_size, this.nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            let mensaje: string;
            mensaje = err.error.mensaje;
            this.openDialog(mensaje);
            this.load = false;
          });
      })
      .catch(error => {
        let mensaje: string;
        mensaje = error.error.mensaje;
        this.openDialog(mensaje);
        this.load = false;
      });
  }


  buscar(nombre: string) {

    this.paginator.pageIndex = 0;
    this.page_number = 0;
    this.page_size = 30;
    this.load = true;
    this.service.obtenerTotal(this.token, this.prefix, this.nombre)
      .then(ok => {
        this.length = ok;
        this.service.obtenerLista(this.token, this.prefix, this.page_number, this.page_size, nombre)
          .then(ok => {
            this.dataSource = ok.body;
            this.load = false;
          })
          .catch(err => {
            let mensaje: string;
            mensaje = err.error.mensaje;
            this.openDialog(mensaje);
            this.load = false;
          })
      })
      .catch(error => {
        let mensaje: string;
        mensaje = error.error.mensaje;
        this.openDialog(mensaje);
        this.load = false;
      });
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
        this.router.navigate(["/usuarios"]);
      });
    }
  }


}
