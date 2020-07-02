import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogDataEliminar } from '../interface';
import { PacienteService } from '../../services/paciente/paciente.service';
import { Router } from '@angular/router';
import { EstudiosService } from 'src/app/services/estudios/estudios.service';
import { MedicosService } from 'src/app/services/medicos/medicos.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { AnalisisService } from 'src/app/services/analisis/analisis.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialogeliminar',
  templateUrl: './dialogeliminar.component.html',
  styleUrls: ['./dialogeliminar.component.scss']
})
export class DialogeliminarComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogeliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataEliminar,

    private servicePacientes: PacienteService,
    private serviceEstudios: EstudiosService,
    private serviceMedicos: MedicosService,
    private serviceUsuarios: UsuarioService,
    private serviceAnalisis: AnalisisService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }


  //dataSource: DialogData[] = [];
  eliminarSi(dataI) {

    if (dataI.datos.tipo == 'estudios') {
      this.serviceEstudios.eliminar(dataI.datos.jwt, dataI.datos.prefix, dataI.datos.id)
        .then(ok => {
          this.mensajeSnack(ok.mensaje);
        })
        .catch(error => {
          this.mensajeSnack(error.message);
        });
      this.dialogRef.close();
      this.router.navigateByUrl('/estudios')
    }

    if (dataI.datos.tipo == 'pacientes') {
      console.log(dataI);
      this.servicePacientes.eliminar(dataI.datos.jwt, dataI.datos.prefix, dataI.datos.id)
        .then(ok => {
          console.log(ok);
          this.mensajeSnack(ok.mensaje);
        })
        .catch(error => {
          console.log(error)
          this.mensajeSnack(error.message);
        });
      this.dialogRef.close();
      this.router.navigateByUrl('/pacientes');
    }

    if (dataI.datos.tipo == 'medicos') {
      this.serviceMedicos.eliminar(dataI.datos.jwt, dataI.datos.prefix, dataI.datos.id)
        .then(ok => {
          this.dialogRef.close();
          this.router.navigateByUrl('/medicos')
        })
        .catch(error => {
        });
    }

    if (dataI.datos.tipo == 'usuarios') {

      this.serviceUsuarios.eliminar(dataI.datos.jwt, dataI.datos.prefix, dataI.datos.id)
        .then(ok => {
          this.dialogRef.close();
          this.router.navigateByUrl('/usuarios')
        })
        .catch(error => {
        });
    }

    if (dataI.datos.tipo == 'analisis') {
      this.serviceAnalisis.eliminar(dataI.datos.jwt, dataI.datos.prefix, dataI.datos.idpaciente, dataI.datos.id)
        .then(ok => {
          this.mensajeSnack(ok.mensaje);
        })
        .catch(error => {
          this.mensajeSnack(error.message);
        });
      
      this.dialogRef.close();
      this.router.navigate(['pacientes', dataI.datos.idpaciente, 'analisis']);
    }

  }

  //Mensaje Snackbar
  mensajeSnack(msj: String) {

    this.snackBar.open('' + msj, 'Aceptar', {
      duration: 5000
    });
  }


  eliminarNo() {
    this.dialogRef.close();
  }
}
