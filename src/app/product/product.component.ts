import { Component,TemplateRef,ViewChild,Inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { product_model } from '../../model/product_model';
import { DOCUMENT } from "@angular/common";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  products: any;
  productColumns: string[] = [ 'Id', 'Name', 'Des','Price',"Avail",'Img','Category','Created','Updated','Edit','Delete'];
  enum: any;
  product: product_model

  createMode: boolean = false;
  editMode: boolean = false;
  uploadHinh: any;


  constructor(
    private apiService: ApiService,
    public global: GlobalService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog:MatDialog,
    @Inject(DOCUMENT) private document: any

  ) {
    this.getProducts();
    this.getEnumCategories();
    //this.getLatestTransactions();
  }
  @ViewChild('form', { static: true }) form: TemplateRef<any>;


  public getProducts(){
    this.apiService
    .GetProducts()
    .then((res) => {
      console.log(res);
      this.products = res?.data;
      console.log(this.global.imageLink(this.products[24].image));
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

  public getEnumCategories(){
    this.apiService.GetEnumCategories().then((res) => {
      this.enum = res?.data;
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

  public getCategoryName(id){
    if(this.enum != null){
      return this.enum.find(x=>x.id === id).name;
    }
  }

  public deleteProduct(id){
    this.apiService
    .DeleteProduct(id)
    .then((res) => {
      if(res.code === 200){
        this.openSnackBar(res.code,res.message)
        this.getProducts();
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
    this.createMode = true;
    this.editMode = false;
    this.product = new product_model;
    this.dialog.open(this.form);
  }

  openEdit(chosenProduct){
    this.createMode = false;
    this.editMode = true;
    this.product = new product_model;
    this.product.id = chosenProduct.id;
    this.product.name = chosenProduct.name;
    this.product.description = chosenProduct.description;
    this.product.price = chosenProduct.price;
    this.product.available = chosenProduct.available;
    this.product.category_id = chosenProduct.category_id;
    this.dialog.open(this.form);
  }


  createOrEdit(){
    if(this.product.name === '' || this.product.name === null || this.product.name === undefined){
      this.openSnackBar(422,'Name is required');
      return;
    }
    if(this.product.price === null || this.product.price === undefined){
      this.openSnackBar(422,'Price is required');
      return;
    }
    if(this.product.available === null || this.product.available === undefined){
      // this.openSnackBar(422,'Available is required');
      // return;
      this.product.available = 0;
    }
    if(this.product.category_id === null || this.product.category_id === undefined){
      this.openSnackBar(422,'Category is required');
      return;
    }
    if(this.createMode){
      if(this.uploadHinh != null){
        this.product.image = '';
        let upload = new FormData();
        console.log(this.uploadHinh)
        upload.append('image', this.uploadHinh, this.uploadHinh.Name);
        console.log(upload);
        this.apiService.UploadFile(upload).then((res)=> {
          this.product.image= res.data;
          console.log(this.product.image);
          console.log(res.data);
          this.apiService.CreateProduct(this.product)
      .then((res) => {
        if(res.code === 200){
          this.openSnackBar(res.code,res.message)
          this.getProducts();
          this.dialog.closeAll();
        }
        else{
          this.openSnackBar(res.code,'An error has occured'); 
        }
      })
      .catch((err) => {
        this.apiService.error(err);
      });
        })
      }
      else{
        this.apiService.CreateProduct(this.product)
      .then((res) => {
        if(res.code === 200){
          this.openSnackBar(res.code,res.message)
          this.getProducts();
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
      console.log(this.product.image)
      
    }

    else if(this.editMode){
      if(this.uploadHinh != null){
        this.product.image = '';
        let upload = new FormData();
        console.log(this.uploadHinh)
        upload.append('image', this.uploadHinh, this.uploadHinh.Name);
        console.log(upload);
        this.apiService.UploadFile(upload).then((res)=> {
          this.product.image= res.data;
          console.log(this.product.image);
          console.log(res.data);
          this.apiService.EditProduct(this.product.id,this.product)
      .then((res) => {
        if(res.code === 200){
          this.openSnackBar(res.code,res.message)
          this.getProducts();
          this.dialog.closeAll();
        }
        else{
          this.openSnackBar(res.code,'An error has occured'); 
        }
      })
      .catch((err) => {
        this.apiService.error(err);
      });
        })
      }
      else{
      this.apiService
    .EditProduct(this.product.id,this.product)
    .then((res) => {
      if(res.code === 200){
        this.openSnackBar(res.code,res.message)
        this.getProducts();
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
  }
    
  }

  clearData(){
    this.product = new product_model; 
  }

  checkInput(e: any) {
    this.uploadHinh = e.target.files[0];
    console.log(this.uploadHinh);
    this.loadMediaFile(window.URL.createObjectURL(e.target.files[0]));
  }

  loadMediaFile(url: any) {
    var img = this.document.getElementById("uploadImage");
    if (img === null || img === undefined) {
      setTimeout(() => {
        this.loadMediaFile(url);
      }, 300);
      return;
    }
    img.src = url;
    img.style.display = "block";
  }

}
