import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-envia-mail',
  templateUrl: './envia-mail.component.html',
  styleUrls: ['./envia-mail.component.scss']
})
export class EnviaMailComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  inicio(){

    this.router.navigateByUrl("/ingresar"); 
  }

}
