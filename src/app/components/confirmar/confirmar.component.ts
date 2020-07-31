import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmarService } from 'src/app/services/confirmar/confirmar.service';

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
  ) {
    this.actRoute = this.activatedRoute.snapshot.params["token"];
  }

  ngOnInit(): void {
    if (this.actRoute != null) {
      this.confirmaService.setConfirma(this.actRoute)
        .then(resp => {
          console.log(resp);
          this.load = false;
          this.valido = true;
        })
        .catch(error => {
          this.load = false;
          alert(error.error.mensaje);
          this.router.navigate(["/ingresar"]);
        });
    }

    else {
      this.load = false;
      alert('Token no válido');
      this.router.navigate(["/ingresar"]);
    }
  }

}
