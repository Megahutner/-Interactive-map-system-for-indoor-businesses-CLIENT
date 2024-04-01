import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { login_model } from '../../model/login_model';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { register_model } from '../../model/register_model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model:register_model;
  tempData: any;
  registerMode: boolean = true;
  inputCodeMode: boolean = false;
  code: string='';
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private global: GlobalService,
    private _snackBar: MatSnackBar,
    private apiService: ApiService

  ) {
    if (auth.isAuthentication()) this.router.navigate(["/customer-product"]);
  }



  ngOnInit(){
    this.model = {
      name: "",
      password: "",
      address: "",
      phone: "",
      email: ""
    };
  }

  
  openSnackBar(code,message) {
    this._snackBar.open(code, message, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration : 3000
    });
  }

  register() {
    this.apiService.RegisterCustomer(this.model).then((result) => {
      if (result.code === 200) {
        this.tempData = result;
        this.registerMode = false;
        this.inputCodeMode = true;
        return;
      } else {
        if (result?.code === 422 || result?.code == null) {
         this.openSnackBar(400,'Register failed');
         return;
        } else {
          this.openSnackBar(400,'Register failed');
          return;
        }
      }
    });
  }

  checkInputCode(){
    if(this.code === null || this.code === '' || this.code === undefined ){
      this.openSnackBar(400,'Unmatched PIN code');
      return;
    }
    let data = {
      name: this.tempData.user?.name,
      code: this.code
    };
    this.apiService.verifyPin(data).then((result) => {
      if (result.code === 200) {
        let token = this.tempData.api_token; // return true or false
        if (token) {
          localStorage.setItem('currentCustomer', JSON.stringify(this.tempData?.user));
          localStorage.setItem('user_token', token);
        }
        this.router.navigate(["/customer-product"]);
      } else {
        if (result?.code === 422 || result?.code == null) {
         this.openSnackBar(400,'Register failed');
         return;
        } else {
          this.openSnackBar(400,'Register failed');
          return;
        }
      }
    });

  }


}
