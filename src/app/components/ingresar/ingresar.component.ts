import { Component, OnInit, OnDestroy } from "@angular/core";
// import { ServicesService } from '../services/logon/services.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../common/dialog/dialog.component";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { startWith, tap } from 'rxjs/operators';

@Component({
  selector: "app-ingresar",
  templateUrl: "./ingresar.component.html",
  styleUrls: ["./ingresar.component.scss"]
})
export class IngresarComponent implements OnInit, OnDestroy {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  logon: FormGroup;
  loginNav: boolean = false;
  loading = false;
  token: string;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.token = localStorage.getItem("token");

  }

  ngOnInit() {
    //this.ngAfterViewInit();

    if (this.token != null) {
      this.router.navigateByUrl("/pacientes");
    }

    this.logon = new FormGroup({
      username: new FormControl("", [Validators.required]), //, Validators.minLength(4)]),
      password: new FormControl("", [Validators.required]) //, Validators.minLength(6)])
    });
  }

  ngOnDestroy() {
    this.loading = false;
  }

  login() {
    this.loading = true;
    this.authService
      .login(this.logon.get("username").value, this.logon.get("password").value)
      .then(ok => {
        this.loading = false;
        this.router.navigateByUrl("/pacientes");
      })
      .catch(error => {
        this.loading = false;
        let mensaje: string;
        console.log(error);
        this.openDialog(error.error.mensaje);
      });
  }

  openDialog(mensaje: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px",
      data: { mensaje: mensaje }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(["/"]);
      this.loading = false;
    });
  }

  logout() {
    this.authService.logout();
  }

  ngAfterViewInit() {
    /*setTimeout(() => {
      this.logout()
    });*/
  }
}
