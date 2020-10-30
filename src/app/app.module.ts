import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';


//Rutas
import { APP_ROUTING } from './app.routes';

import { AppComponent } from './app.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { AltausuarioComponent } from './components/usuario/altausuario/altausuario.component';
import { AltapacienteComponent } from './components/paciente/altapaciente/altapaciente.component';
import { AltamedicoComponent } from './components/medico/altamedico/altamedico.component';
import { DialogComponent } from './common/dialog/dialog.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MedicosComponent } from './components/medico/medicos/medicos.component';
import { UsuariosComponent } from './components/usuario/usuarios/usuarios.component';

import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { PacientesComponent } from './components/paciente/pacientes/pacientes.component';
import { DialogeliminarComponent } from './common/dialogeliminar/dialogeliminar.component';
import { AnalisisComponent } from './components/analisis/analisis/analisis.component';
import { ImprimirComponent } from './components/imprimir/imprimir.component';
import { EstudioComponent } from './components/estudio/estudio/estudio.component';
import { EstudiosComponent } from './components/estudio/estudios/estudios.component';
import { UnanalisisComponent } from './components/analisis/unanalisis/unanalisis.component';
import { DialogmembreteComponent } from './common/dialogmembrete/dialogmembrete.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
//Módulo registro
import { RegistroModule } from './components/registro/registro.module';
//Módulo confirmar
import { ConfirmarModule } from './components/confirmar/confirmar.module';
import { HomeComponent } from './components/home/home.component';
//import { InicioComponent } from './components/inicio/inicio.component';






@NgModule({
  declarations: [
    AppComponent,
    IngresarComponent,
    AltausuarioComponent,
    AltapacienteComponent,
    AltamedicoComponent,
    DialogComponent,
    SidenavComponent,
    MedicosComponent,
    UsuariosComponent,
    PacientesComponent,
    DialogeliminarComponent,
    AnalisisComponent,
    ImprimirComponent,
    EstudioComponent,
    EstudiosComponent,
    UnanalisisComponent,
    DialogmembreteComponent,
    HomeComponent
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatGridListModule,
    MatSelectModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    RegistroModule,
    ConfirmarModule
  ],
  providers: [
    AuthService, AuthGuard, DatePipe,
    { provide: MatPaginatorIntl, useClass: PacientesComponent },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent, DialogeliminarComponent, DialogmembreteComponent],
})
export class AppModule { }
