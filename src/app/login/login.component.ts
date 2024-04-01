import { login_model } from '../../model/login_model';
import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model:login_model;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private global: GlobalService,
    private _snackBar: MatSnackBar,

  ) {
    if (auth.isAuthentication()) this.router.navigate(["/"]);
  }



  ngOnInit(){
    this.model = {
      name: "",
      password: "",
    };
  }

  
  openSnackBar(code,message) {
    this._snackBar.open(code, message, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration : 3000
    });
  }

  login() {
    this.auth.loginUser(this.model.name, this.model.password).subscribe((result) => {
      if (result.code === 200) {
        this.router.navigate(["/"]);
        window.location.reload();
      } else {
        if (result?.code === 422 || result?.code == null) {
         this.openSnackBar(400,'Login failed');
        } else {
          this.openSnackBar(400,'Login failed');        }
      }
    });
  }
}


