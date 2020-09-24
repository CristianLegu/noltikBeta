import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { faHospital, 
         faUsers, 
         faStethoscope, 
         faProcedures, 
         faSignOutAlt, 
         faFileInvoice, 
         faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  rol: string;
  opened: boolean;

  //Validar tamaño de pantalla
  innerWidth: number;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 920) {
      this.opened = true;
    }
    else {
      this.opened = false;
    }
  }


  faHospital = faHospital;
  faUsers = faUsers;
  faStethoscope = faStethoscope;
  faProcedures  = faProcedures;
  faSignOutAlt  = faSignOutAlt;
  faFileInvoice = faFileInvoice;
  faCaretSquare = faBars;


  constructor(
    private router: Router,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.onResize();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/ingresar');
  }

  checkRol() {
    this.rol = localStorage.getItem('role');
    if (this.rol == 'ROLE_ADMIN') {
      return true;
    }
    else {
      return false;
    }
  }

  sidenav() {
    if (this.opened != false) {
      this.opened = false;
    }
    else {
      this.opened = true;
    }
  }


}
