import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {

  transactions: any;
  dataSource :any;

  transactionsColumns: string[] = [ 'Id', 'TransactionId', 'Total','Status',"Payment",'Created','Updated','End'];
  status: any = [
    {id: 0, name:'Initializing'},
    {id: 1, name: "Pending"},
    {id: 2,name: "Done" },
    {id: 3, name: "End" },
];
  
  constructor(
    private apiService: ApiService,
    public global: GlobalService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.getTransactions();
    this.dataSource = new MatTableDataSource(this.transactions);
    console.log(this.dataSource)

  }

  public getTransactions(){
    this.apiService
    .GetTransactions()
    .then((res) => {
      console.log(res);
      this.transactions = res?.data;
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

  public getStatusName(id){
      return this.status.find(x=>x.id === id)?.name;
  }


  public endTransaction(transaction){
    var data = {
      transaction_id: transaction.id
    };
    this.apiService
    .EndTransaction(data)
    .then((res) => {
      console.log(res);
      if(res.code = 200){
        transaction.status = 3;
        transaction.updatedDate = res.data.updatedDate;
        this.openSnackBar(res.code,res.message)
      }
      else{
        this.openSnackBar(400,"An error has occured");
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

  }






