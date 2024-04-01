import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GlobalService } from './global.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token: string;
  private url: string;
  
  constructor(private http: HttpClient, private router: Router, private global: GlobalService) { 
    this.global.getConfig().subscribe(data => {
      this.url = data.serverApi;
     });
  }

  public loginUser(username: string, password: string) {
    var json = { "name": username, "password": password }
    return this.http.post(this.url + "users/login", json).pipe(map((info: any) => {
      if(info.code == 200) {
        let token = info.api_token; // return true or false
        if (token) {
          this.token = token;
          localStorage.setItem('currentUser', JSON.stringify(info.user));
          localStorage.setItem('user_token', token);
        }
        // return true;
      }
      return info;
    }))
  }

  public loginCustomer(username: string, password: string) {
    var json = { "name": username, "password": password }
    return this.http.post(this.url + "customers/login", json).pipe(map((info: any) => {
      if(info.code == 200) {
        let token = info.api_token; // return true or false
        if (token) {
          this.token = token;
          localStorage.setItem('currentCustomer', JSON.stringify(info.user));
          localStorage.setItem('user_token', token);
        }
        // return true;
      }
      return info;
    }))
  }

  public logout():void{
    localStorage.clear();
    this.router.navigate(["/"]);
  }


  public logoutUser(): void {
    localStorage.clear();
    this.router.navigate(["/login"]);
    window.location.reload();
    // 
  }

  public logoutCustomer(): void {
    localStorage.clear();
    this.router.navigate(["/customer-product"]);
    window.location.reload();
    // 
  }

  public isAuthentication(): any {
    let user: any = localStorage.getItem('currentUser');
    if (user === null || user === undefined || user === "") {
      return false;
    } else {
      return true;
    }
  }

  public isCustomerAuthentication(): any {
    let customer: any = localStorage.getItem('currentCustomer');
    if (customer === null || customer === undefined || customer === "") {
      return false;
    } else {
      return true;
    }
  }


  // public isAdmin() {
  //   let user: any = JSON.parse(localStorage.getItem('currentUser')!);
  //   if(user && user.user_type <= 1) {
  //     return true
  //   }
  //   return false
  // }


  // public ForgotPassword(username: string, email: string){
  //   var json = { "username": username, "email": email}
  //   return this.http.post(this.url + "users/reset", json).toPromise().then((info: any) => {
  //     return info;
  //   })
  // }
}
