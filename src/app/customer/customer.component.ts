import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {

  customers: any;
  customersColumns: string[] = [ 'Id', 'Name', 'Email','Address',"Phone",'Created','Updated'];

  
  constructor(
    private apiService: ApiService,
    public global: GlobalService,
    private router: Router,
  ) {
    this.getCustomers();
  }

  public getCustomers(){
    this.apiService
    .GetCustomers()
    .then((res) => {
      console.log(res);
      this.customers = res?.data;
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

}
