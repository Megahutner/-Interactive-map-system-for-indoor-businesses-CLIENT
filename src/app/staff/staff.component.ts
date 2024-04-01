import { Component,TemplateRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { GlobalService } from '../services/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { staff_model } from '../../model/staff_model';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent {
  staffs: any;
  staffColumns: string[] = [ 'Id', 'Name', 'Email','Delete'];
  user: staff_model

  roles = [
    {id: 0, name:'Admin'},
    {id: 1, name: 'Super operator'},
    {id: 2, name: 'Operator'},
    {id: 3, name: 'Staff'},

  ]
  
  constructor(
    private apiService: ApiService,
    public global: GlobalService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog:MatDialog
  ) {
    this.getStaffs();
    //this.getLatestTransactions();
  }
  @ViewChild('form', { static: true }) form: TemplateRef<any>;


  public getStaffs(){
    this.apiService
    .GetStaffs()
    .then((res) => {
      console.log(res);
      this.staffs = res?.data;
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }


  public deleteStaff(id){
    this.apiService
    .DeleteStaff(id)
    .then((res) => {
      if(res.code === 200){
        this.openSnackBar(res.code,res.message)
        this.getStaffs();
      }
      else{
        this.openSnackBar(res.code,res.message)
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

  openCreate(){
    this.user = new staff_model;
    this.dialog.open(this.form);
  }

  create(){
    if(this.user.name === '' || this.user.name === null || this.user.name === undefined){
      this.openSnackBar(422,'Name is required');
      return;
    }
    if(this.user.password === '' || this.user.password === null || this.user.password === undefined){
      this.openSnackBar(422,'Password is required');
      return;
    }
    if(this.user.email === '' || this.user.email === null || this.user.email === undefined){
      this.openSnackBar(422,'Email is required');
      return;
    }
    if( this.user.type === null || this.user.type === undefined){
      this.openSnackBar(422,'Type is required');
      return;
    }
    this.apiService
    .CreateStaff(this.user)
    .then((res) => {
      if(res.code === 200){
        this.openSnackBar(res.code,res.message)
        this.getStaffs();
        this.dialog.closeAll();
      }
      else{
        this.openSnackBar(res.code,'An error has occured'); 
      }
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

  clearData(){
    this.user = new staff_model; 
  }
}
