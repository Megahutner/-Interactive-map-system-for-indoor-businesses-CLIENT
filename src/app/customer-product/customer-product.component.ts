import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-customer-product',
  templateUrl: './customer-product.component.html',
  styleUrl: './customer-product.component.css'
})
export class CustomerProductComponent {
  loggedIn: boolean = false;
  categories:any= [
    {id:0,name:"All"},
    {id:1,name:'Accessories'},
    {id:2,name:'Outerwear'},
    {id:3,name:'Top'},
    {id:4,name:'Bottom'},
    {id:5,name:'Shoes'},
  ]
  currentCustomer:any;
  currentCategory: string= 'All';
  productList :any;
  addingProduct: any;

  constructor(
    private apiService: ApiService,
    public global: GlobalService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog:MatDialog,
    private auth: AuthService
  ) {
    if(this.auth.isCustomerAuthentication()){
      this.loggedIn = true; 
      this.currentCustomer = JSON.parse(localStorage.getItem('currentCustomer')!);
    }
    this.getProducts();
  }
  getCategory(id){
    this.currentCategory = this.categories.find(x => x.id === id).name;
    let filter ='';
    if(id >0){
      filter ='?category_id[eq]='+id;
    }
    console.log(filter);
    this.apiService.GetCustomerProducts(filter).then((res) => {
      console.log(res);
      if(res?.code === 200){
        this.productList = res?.data;    
        console.log(this.productList);
      }
    })
    .catch((err) => {
      this.apiService.error(err);
    });;

  }

  getProducts(){

    this.apiService.GetProducts().then((res) => {
      console.log(res);
      if(res?.code === 200){
        this.productList = res?.data;    
        console.log(this.productList);
      }
    })
    .catch((err) => {
      this.apiService.error(err);
    });

  }

  addToCart(productId){
    if(!this.loggedIn){
      this.router.navigate(['/customer-login']);
      return;
    }
    this.addingProduct = productId;
    let data = {
      product_id: productId,
      amount: 1
    };

    this.apiService.AddToCart(data).then((res) => {
      if(res?.code === 200){
        this.addingProduct = null;
        this.openSnackBar(200,'Product is added to cart');
      }
      else{
        this.addingProduct = null;
        this.openSnackBar(422,'Failed');
      }
    })
    .catch((err) => {
      this.addingProduct = null;
      this.apiService.error(err);
    });


  }

  logout(){
    this.auth.logoutCustomer();
  }

  openSnackBar(code,message) {
    this._snackBar.open(code, message, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration : 3000
    });
  }

}
