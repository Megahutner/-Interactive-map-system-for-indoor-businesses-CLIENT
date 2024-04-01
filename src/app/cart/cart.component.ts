import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';


declare var StripeCheckout: StripeCheckoutStatic
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  key: string;
  handler: StripeCheckoutHandler;
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
  cart :any;
  transaction: any;
  cartColumns: string[] = [ 'Name', 'Price', 'Amount','Remove'];


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
    this.key = "pk_test_51OK9onHRyLjeZQRb1axe1rLyFwoJSq6huCl6bJpTq6h6QTFsIQFyuJpVpkCqkUsZEByoxTclVnmBuFxHyMgnKxCx00C08YFOSR";
    console.log(this.key);
    this.getOrders();  
  }
  ngOnInit() {
    this.handler = StripeCheckout.configure({
      key: this.key,
      locale: 'auto',
      source: async (source) => {
        let data = {
          transaction_id : this.transaction.id
        }
        this.apiService.MakeTransaction(data).then((res) => {
          if(res?.code === 200){
            this.transaction = null;
            this.cart = null;
            this.openSnackBar(200,'Transaction completed');    
          }
          else{
            this.openSnackBar(422,'An error has occurred');
          }
        })
        .catch((err) => {
          this.apiService.error(err);
        });
      }
    });
  }

  returnToHP(){
    this.router.navigate(['/customer-product'])
  }

  getOrders(){
    this.apiService.GetCustomerCart().then((res) => {
      console.log(res);
      if(res?.code === 200){
        this.transaction = res?.data;
        this.cart = res?.data?.order;    
        console.log(this.cart);
      }
      else{
        this.transaction = null;
        this.cart = null;
      }
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

  removeFromCart(id){
    let data = {
      order_id: id
    };
    this.apiService.RemoveFromCart(data).then((res) => {
      console.log(res);
      if(res?.code === 200){
        this.openSnackBar(200,'Product is removed cart');
        this.transaction = res?.data;
        this.cart = res?.data?.order;   
      }
    })
    .catch((err) => {
      this.apiService.error(err);
    });

  }

  async checkout(e) {
    this.handler.open({
      name: 'Clothes-EC',
      amount: this.transaction?.total*100,
      email: this.currentCustomer.email
    });
    e.preventDefault();
  }

  openSnackBar(code,message) {
    this._snackBar.open(code, message, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration : 3000
    });
  }
  
  logout(){
    this.auth.logoutCustomer();
  }

}
