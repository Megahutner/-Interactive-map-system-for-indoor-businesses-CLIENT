import { Component ,ViewChild,TemplateRef} from '@angular/core';
import { ApiService } from '../services/api.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { category_model } from '../../model/category_model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  category: category_model;
  categories: any;
  categoryColumns: string[] = [ 'Id', 'Name', 'Des'];
  
  constructor(
    private apiService: ApiService,
    public global: GlobalService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog:MatDialog
  ) {
    this.getCategories();
    //this.getLatestTransactions();
  }

  @ViewChild('form', { static: true }) form: TemplateRef<any>;


  public getCategories(){
    this.apiService
    .GetCategories()
    .then((res) => {
      console.log(res);
      this.categories = res?.data;
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
      this.categories = res.data;
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
    this.category = new category_model;
    this.dialog.open(this.form);
  }


  create(){
    if(this.category.name === '' || this.category.name === null || this.category.name === undefined){
      this.openSnackBar(422,'Name is required');
      return;
    }   
    this.apiService
    .CreateCategory(this.category)
    .then((res) => {
      if(res.code === 200){
        this.openSnackBar(res.code,res.message)
        this.getCategories();
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
    this.category = new category_model; 
  }

}
