import { Component } from '@angular/core';
import { login_model } from '../../model/login_model';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.css'
})
export class CustomerLoginComponent {
  model:login_model;
  loginMode: boolean = true;
  sendResetMode: boolean = false;
  verifyMode: boolean = false;
  email:string;
  code: string;
  password: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private global: GlobalService,
    private _snackBar: MatSnackBar,
    private apiService: ApiService

  ) {
    if (auth.isCustomerAuthentication()) this.router.navigate(["/customer-product"]);
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
    this.auth.loginCustomer(this.model.name, this.model.password).subscribe((result) => {
      if (result.code === 200) {
        this.router.navigate(["/customer-product"]);
        window.location.reload();
      } else {
        if (result?.code === 422 || result?.code == null) {
         this.openSnackBar(400,'Login failed');
        } else {
          this.openSnackBar(400,'Login failed');        }
      }
    });
  }

  toForgotPassword(){
    this.loginMode = false;
    this.sendResetMode = true;
  }

  sendReset(){
    if(this.email === null || this.email === "" || this.email === undefined ){
      this.openSnackBar(400,'Failed');
      return;
    }
    let data = {
      email: this.email
    };
    this.apiService.SendReset(data).then((result) => {
      if (result.code === 200) {
        this.sendResetMode = false;
        this.verifyMode = true;
      } else {
        if (result?.code === 422 || result?.code == null) {
         this.openSnackBar(400,' Failed');
        } else {
          this.openSnackBar(400,'Failed');        }
      }
    });
    
  }

  resetPass(){
    if(this.code === null || this.code === "" || this.code === undefined ){
      this.openSnackBar(400,'Code is required');
      return;
    }
    if(this.password === null || this.password === "" || this.password === undefined ){
      this.openSnackBar(400,'Password is required');
      return;
    }
    let data = {
      email: this.email,
      code: this.code,
      newPassword: this.password
    };
    this.apiService.ResetPassword(data).then((result) => {
      if (result.code === 200) {
        this.openSnackBar(200,'Success');
        window.location.reload();
      } else {
        if (result?.code === 422 || result?.code == null) {
         this.openSnackBar(400,' Failed');
        } else {
          this.openSnackBar(400,'Failed');        }
      }
    });
    

  }

}
