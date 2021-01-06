import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/common/dialog/dialog.component';
import { UserTokenService } from '../../services/userToken/user-token.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-user',
  templateUrl: './confirmar-user.component.html',
  styleUrls: ['./confirmar-user.component.scss']
})
export class ConfirmarUserComponent implements OnInit {

  confUser: FormGroup;
  actRoute: string;
  mensaje: string;
  loading = false;
  load: boolean = false;
  ok: any;
  noMatch: boolean = false;
  constructor(
    private userService: UserTokenService,
    private activatedRoute: ActivatedRoute,
    private userC:FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    //this.actRoute = this.activatedRoute.snapshot.params["token"];
    this.confUser = this.userC.group({
      user: ["", [Validators.required]],
    });
   }

  ngOnInit(): void {
    /*this.confUser = new FormGroup({
      user: new FormControl("", [Validators.required])
      });*/
  }
  checkUser() {
    console.log(this.confUser);
    this.loading = true;
    this.userService
      .setConfirma(this.confUser.get("user").value)
      .then(ok => {
        this.loading = false;
        this.router.navigateByUrl("/reset-pass");
      })
      .catch(error => {
        this.loading = false;
        //Error no conexión
        if (error.status == "0") {
          this.openDialog(error.message);
        }
        else {
          this.openDialog(error.error.mensaje);
        }
        console.log(error);
      });
  }
    openDialog(mensaje: string): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        data: { mensaje: mensaje }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(["/ingresar"]);
      });
    }

}
