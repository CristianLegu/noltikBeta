import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogDataEliminar } from '../interface';
import { PacienteService } from '../../services/paciente/paciente.service';
import { Router } from '@angular/router';
import { EstudiosService } from 'src/app/services/estudios/estudios.service';
import { MedicosService } from 'src/app/services/medicos/medicos.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { AnalisisService } from 'src/app/services/analisis/analisis.service';

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
    private router: Router
  ) {
  }


  //dataSource: DialogData[] = [];
  eliminarSi(dataI) {
    
    if (dataI.datos.tipo == 'estudios') {
      this.serviceEstudios.eliminar(dataI.datos.jwt, dataI.datos.id)
        .then(ok => {
          this.dialogRef.close();
          this.router.navigateByUrl('/estudios')
        })
        .catch(error => {
        });
    }

    if (dataI.datos.tipo == 'pacientes') {

      this.servicePacientes.eliminar(dataI.datos.jwt, dataI.datos.id)
        .then(ok => {
          this.dialogRef.close();
          this.router.navigateByUrl('/pacientes')
        })
        .catch(error => {
        });
    }

    if (dataI.datos.tipo == 'medicos') {
      this.serviceMedicos.eliminar(dataI.datos.jwt, dataI.datos.id)
        .then(ok => {
          this.dialogRef.close();
          this.router.navigateByUrl('/medicos')
        })
        .catch(error => {
        });
    }

    if (dataI.datos.tipo == 'usuarios') {

      this.serviceUsuarios.eliminar(dataI.datos.jwt, dataI.datos.id)
        .then(ok => {
          this.dialogRef.close();
          this.router.navigateByUrl('/usuarios')
        })
        .catch(error => {
        });
    }

    if (dataI.datos.tipo == 'analisis') {
      this.serviceAnalisis.eliminar(dataI.datos.jwt, dataI.datos.idpaciente, dataI.datos.id)
        .then(ok => {
          this.dialogRef.close();
          this.router.navigate(['pacientes', dataI.datos.idpaciente, 'analisis']);
          
        })
        .catch(error => {
        })
    }

  }


  eliminarNo() {
    this.dialogRef.close();
  }
}
