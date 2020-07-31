import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmarComponent } from './confirmar.component';


const routes: Routes = [{ path: 'confirma', component: ConfirmarComponent, pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmarRoutingModule { }
