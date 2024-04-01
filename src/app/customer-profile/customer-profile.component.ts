import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent {

  loggedIn: boolean = false;
  categories:any= [
    {id:0,name:"All"},
    {id:1,name:'Accessories'},
    {id:2,name:'Outerwear'},
    {id:3,name:'Top'},
    {id:4,name:'Bottom'},
    {id:5,name:'Shoes'},
  ]

  status: any = [
    {id: 1, name: "Pending"},
    {id: 2,name: "Done" },
    {id: 3, name: "End" },
];
  currentCustomer:any;
  currentCategory: string= 'All';
  transactions: any;
  transactionColumns: string[] = [ 'TransactionId', 'Total', 'Status','Created'];


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

    this.getOrders();  
  }

  
  public getStatusName(id){
    return this.status.find(x=>x.id === id).name;
}


  returnToHP(){
    this.router.navigate(['/customer-product'])
  }

  getOrders(){
    this.apiService.GetCustomerTransactions().then((res) => {
      console.log(res);
      if(res?.code === 200){
        this.transactions = res?.data;
      }
      else{
        this.transactions = null;
      }
    })
    .catch((err) => {
      this.apiService.error(err);
    });
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
