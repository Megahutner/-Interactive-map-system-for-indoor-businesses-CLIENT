import { Component,OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  general: any;
  latestTransactions:any;
  latestCustomers:any;

  transactionColumns: string[] = [ 'TransactionId', 'Total', 'Payment','Updated_at'];
  customerColumns: string[] = [ 'Name', 'Email','Phone','Created_at'];

  
  constructor(
    private apiService: ApiService,
    public global: GlobalService,
    private router: Router,
  ) {}

  ngOnInit(){
    this.getGenralInfo();
    this.getLatestTransactions();
    this.getLatestCustomers();
  }

  public getGenralInfo(){
    this.apiService
    .GetGeneralInfo()
    .then((res) => {
      console.log(res);
      this.general = res.data;
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

  public getLatestTransactions(){
    this.apiService
    .GetLatestTransactions()
    .then((res) => {
      console.log(res);
      this.latestTransactions = res.data;
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

  public getLatestCustomers(){
    this.apiService
    .GetLatestCustomers()
    .then((res) => {
      console.log(res);
      this.latestCustomers = res.data;
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }
}
