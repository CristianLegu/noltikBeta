import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/common/dialog/dialog.component';
import { UserTokenService } from '../../services/userToken/user-token.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reenvio-token',
  templateUrl: './reenvio-token.component.html',
  styleUrls: ['./reenvio-token.component.scss']
})
export class ReenvioTokenComponent implements OnInit {

  usuarioForm: FormGroup;
  mensaje: string;
  loading: boolean = false;

  constructor(private userService: UserTokenService,
    private activatedRoute: ActivatedRoute,
    private usuarioFb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar) {

    this.usuarioForm = this.usuarioFb.group({
      usuarioCorreo: ["", [Validators.required]]
    });

    this.usuarioForm = new FormGroup({
      usuarioCorreo: new FormControl("", [Validators.required])
    });

  }

  ngOnInit(): void {
  }

  reenviaCorreoUser() {

    //console.log(this.usuarioForm);
    this.loading = true;
    //console.log(this.loading)
/*
    this.userService.reenvioRegistroToken(this.usuarioForm.get('usuarioCorreo').value)
      .then(ok => {
        this.loading = false;
      })
      .catch(e => {
        this.loading = false;
      })
*/

  }

}
