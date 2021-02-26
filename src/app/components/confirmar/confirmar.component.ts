import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmarService } from 'src/app/services/confirmar/confirmar.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/common/dialog/dialog.component';



@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.scss']
})
export class ConfirmarComponent implements OnInit {

  //Variables
  actRoute: string;
  load: boolean = true;
  valido: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmaService: ConfirmarService,
    private dialog: MatDialog
  ) {
    this.actRoute = this.activatedRoute.snapshot.params["token"];
    
  }

  ngOnInit(): void {
    if (this.actRoute != null) {
      this.confirmaService.setConfirma(this.actRoute)
        .then(resp => {
          //console.log(resp);
          this.load = false;
          this.valido = true;
        })
        .catch(error => {
          this.load = false;
          this.openDialog(error.error.mensaje, '/reenvio-token');
         // this.router.navigate(["/ingresar"]);
        });
    }

    else {
      this.load = false;
      this.openDialog('Token no válido', '/ingresar');
     // this.router.navigate(["/ingresar"]);
    }
  }

  

  openDialog(mensaje: string, ruta: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',

      data: { mensaje: mensaje }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([ruta]);
    });
  }

}
