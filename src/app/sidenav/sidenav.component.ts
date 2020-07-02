import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { faHospital, faUsers, faStethoscope, faProcedures, faSignOutAlt, faFileInvoice } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  rol: string;
  UserPerm: boolean;

 
  faHospital = faHospital;
  faUsers = faUsers;
  faStethoscope = faStethoscope;
  faProcedures = faProcedures;
  faSignOutAlt = faSignOutAlt;
  faFileInvoice = faFileInvoice;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.rol = localStorage.getItem('role');
    if(this.rol == 'ROLE_ADMIN'){
      this.UserPerm = true;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/ingresar');
  }


}
