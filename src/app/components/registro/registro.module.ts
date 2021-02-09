import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RegistroComponent } from './registro.component';
import { RegistroRoutingModule } from './registro-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

@NgModule({
  declarations: [RegistroComponent],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    //RecaptchaV3Module,
    MatDividerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  //providers: [{ provide: RECAPTCHA_V3_SITE_KEY, useValue: "6LdC_08aAAAAAHaSUZ1-QfspfhQ7jHERVcygEHqm" }],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LfiSlEaAAAAAGoaueDzBz1NMGFBt2dZqVfuc9F2',
      } as RecaptchaSettings,
    },
  ],
})
export class RegistroModule { }