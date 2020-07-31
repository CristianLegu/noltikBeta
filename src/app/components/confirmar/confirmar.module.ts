import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmarRoutingModule } from './confirmar-routing.module';

import { MatButtonModule } from '@angular/material/button';
import { ConfirmarComponent } from './confirmar.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [ConfirmarComponent],
  imports: [
    CommonModule,
    ConfirmarRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class ConfirmarModule { }
