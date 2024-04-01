import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {AuthService} from './auth.service'
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ApiService {
  public token: string;
  public url: string;

  GetHeader(): any{
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-PINGOTHER': 'pingpong',
        'Authorization': "Bearer " + this.token,
      })
    };
    return httpOptions;
  }
  constructor(private http: HttpClient, private router: Router, private auth: AuthService, private global: GlobalService) { 
    // this.url = global.serverUrl;
    this.global.getConfig().subscribe(data => {
      this.url = data.serverApi;
     });
  }

  private  getConfig(): Observable<any>  {
    return this.http.get("../../../assets/config.txt");
  }

  async getUrl(): Promise<any> {
    return await this.getConfig().toPromise()
    .then(res => {
        this.url = res.serverApi;
        return res;
      });
  }

  async GetWithBody(api: string, body: any): Promise<any> {
    this.checkAuthen();
    if(this.url === null || this.url === undefined){
      return await this.getUrl().then(res => {
        return this.http.get<any>(this.url + api, body).toPromise().then(data => {
          return data;
        });
      });      
    }
    else{
      return await this.http.get<any>(this.url + api, this.GetHeader()).toPromise().then(res => {
        return res;
      });
    }   
  }

  async Get(api: string): Promise<any> {
    this.checkAuthen();
    if(this.url === null || this.url === undefined){
      return await this.getUrl().then(res => {
        return this.http.get<any>(this.url + api, this.GetHeader()).toPromise().then(data => {
          return data;
        });
      });      
    }
    else{
      return await this.http.get<any>(this.url + api, this.GetHeader()).toPromise().then(res => {
        return res;
      });
    }   
  }

  async unauthorizedGet(api: string): Promise<any> {
    if(this.url === null || this.url === undefined){
      return await this.getUrl().then(res => {
        return this.http.get<any>(this.url + api).toPromise().then(data => {
          return data;
        });
      });      
    }
    else{
      return await this.http.get<any>(this.url + api).toPromise().then(res => {
        return res;
      });
    }   
  }

  async Post(api: string, json?: any): Promise<any> {
    this.checkAuthen();
    if(this.url === null || this.url === undefined){
      return await this.getUrl().then(res => {
        return this.http.post<any>(this.url + api, json, this.GetHeader()).toPromise().then(data => {
          return data;
        });
      });      
    }
    else{
      return await this.http.post<any>(this.url + api, json, this.GetHeader()).toPromise().then(res => {
        return res;
      });
    }
  }
  async PostUploadFile(api: string, formdata: any): Promise<any> {
    var httpOptions = {
      headers: new HttpHeaders({
        'enctype': "multipart/form-data",
        'Accept': 'text/plain',
        'Cache-Control': 'no-cache',
        'X-PINGOTHER': 'pingpong',
        'Authorization': "Bearer " + this.token,
      })
    };
    if(this.url === null || this.url === undefined){
      return await this.getUrl().then(res => {
        return this.http.post<any>(this.url + api, formdata, httpOptions).toPromise().then(data => {
          return data;
        });
      });      
    }
    else{
      return await this.http.post<any>(this.url + api, formdata, httpOptions).toPromise().then(res => {
        return res;
      });
    }
  }

  async unauthorizedPost(api: string, json?: any): Promise<any> {
    if(this.url === null || this.url === undefined){
      return await this.getUrl().then(res => {
        return this.http.post<any>(this.url + api, json).toPromise().then(data => {
          return data;
        });
      });      
    }
    else{
      return await this.http.post<any>(this.url + api, json).toPromise().then(res => {
        return res;
      });
    }
  }

  async Put(api: string, json?: any): Promise<any> {
    this.checkAuthen();
    if(this.url === null || this.url === undefined){
      return await this.getUrl().then(res => {
        return this.http.put<any>(this.url + api, json, this.GetHeader()).toPromise().then(data => {
          return data;
        });
      });      
    }
    else{
      return await this.http.put<any>(this.url + api, json, this.GetHeader()).toPromise().then(res => {
        return res;
      });
    }
  }

  async Delete(api: string): Promise<any> {
    this.checkAuthen();
    if(this.url === null || this.url === undefined){
      return await this.getUrl().then(res => {
        return this.http.delete<any>(this.url + api, this.GetHeader()).toPromise().then(data => {
          return data;
        });
      });      
    }
    else{
      return await this.http.delete<any>(this.url + api, this.GetHeader()).toPromise().then(res => {
        return res;
      });
    }
  }

  error(err) {
    if ( err.code = null) {
      //this.auth.logoutUser();
    }
  }

  checkAuthen(){
    this.token = localStorage.getItem("user_token")!;
    if (this.token === "" || this.token === null || this.token === undefined) {
      this.auth.logout();
    }
  }


  // Dashboard APIs
  GetGeneralInfo(){
    return this.Get(`basic/general`);
  }
  GetLatestTransactions(){
    return this.Get(`basic/latestTransactions`);
  }

  GetLatestCustomers(){
    return this.Get(`basic/latestCustomers`);
  }


   // Basic APIs
   GetEnumCategories(){
    return this.Get(`basic/getEnumCategories`);
  }
  // Category APIs
  GetCategories(){
    return this.Get(`categories`);
  }

  CreateCategory(data){
    return this.Post(`categories`,data);
  }


  // Product APIs
  GetProducts(){
    return this.unauthorizedGet(`products`);
  }

  GetCustomerProducts(data:string=''){
    console.log(`products`+data);
    return this.unauthorizedGet(`products`+data);
  }

  CreateProduct(data){
    return this.Post(`products`,data);
  }

  EditProduct(id,data){
    return this.Put(`products/`+id,data);
  }

  DeleteProduct(id){
    return this.Delete(`products/`+id);
  }

  UploadFile(formdata: any){
      return this.PostUploadFile(`products/uploadImage`, formdata);
  }

  // Transaction APIs
  GetTransactions(){
    return this.Get(`transactions`);
  }

  EndTransaction(data){
    return this.Post(`transactions/endTransaction`,data);
  }


  // Customer APIs
  GetCustomers(){
    return this.Get(`customers`);
  }

  RegisterCustomer(data){
    return this.unauthorizedPost(`customers`,data);
  }

  verifyPin(data){
    return this.unauthorizedPost(`customers/verify`,data);
  }

  SendReset(data){
    return this.unauthorizedPost(`customers/sendReset`,data);
  }

  ResetPassword(data){
    return this.unauthorizedPost(`customers/reset`,data);
  }

  AddToCart(data){
    return this.Post('transactions/addToCart',data);
  }

  GetCustomerCart(){
    return this.Get('cart');
  }

  RemoveFromCart(data){
    return this.Post('transactions/removeFromCart',data)
  }

  MakeTransaction(data){
    return this.Post('transactions/makeTransaction',data)
  }
  GetCustomerTransactions(){
    return this.Get("customerTransaction");
  }

  // Staff APIs
  GetStaffs(){
    return this.Get(`users`);
  }

  CreateStaff(data){
    return this.Post(`users`,data);
  }

  EditStaff(id,data){
    return this.Put(`users/`+id,data);
  }

  DeleteStaff(id){
    return this.Delete(`users/`+id);
  }
}


