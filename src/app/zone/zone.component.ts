import { Component ,ViewChild,TemplateRef} from '@angular/core';
import { ApiService } from '../services/api.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { zone_model } from '../../model/zone_model';


@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrl: './zone.component.css'
})
export class ZoneComponent {

  zone: zone_model;
  zones: any;
  zoneColumns: string[] = [  'Name',"ZoneId", "CreatedTime","UpdatedTime","Edit", "Delete"];
  createMode: boolean = false;
  editMode: boolean = false;
  constructor(
    private apiService: ApiService,
    public global: GlobalService,
    private _snackBar: MatSnackBar,
    private dialog:MatDialog
  ) {
  }
  ngOnInit(): void {
    this.getZones();
  }

  @ViewChild('form', { static: true }) form: TemplateRef<any>;


  public getZones(){
    this.apiService.GetZones()
    .then((res) => {
      this.zones = res?.data.zone;
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
    this.zone = new zone_model;
    this.dialog.open(this.form);
  }

  openEdit(chosenZone){
    this.createMode = false;
    this.editMode = true;
    this.zone = new zone_model;
    this.zone.id = chosenZone.id;
    this.zone.name = chosenZone.name;
    this.zone.width = chosenZone.width;
    this.zone.height = chosenZone.height;
    this.dialog.open(this.form);
  }


  
  createOrEdit(){
    if(this.zone.name === '' || this.zone.name === null || this.zone.name === undefined){
      this.openSnackBar(422,'Name is required');
      return;
    }
    if(this.zone.width === null || this.zone.width === undefined){
      this.openSnackBar(422,'Width is required');
      return;
    }
    if(this.zone.height === null || this.zone.height === undefined){
      this.openSnackBar(422,'Height is required');
    }
    if(this.createMode){
      // if(this.uploadHinh != null){
      //   this.product.image = '';
      //   let upload = new FormData();
      //   upload.append('image', this.uploadHinh, this.uploadHinh.Name);
      //   this.apiService.UploadFile(upload).then((res)=> {
      //     this.product.image= res.data;
      //     this.apiService.CreateProduct(this.product)
      // .then((res) => {
      //   if(res.code === 200){
      //     this.openSnackBar(res.code,res.message)
      //     this.getProducts();
      //     this.dialog.closeAll();
      //   }
      //   else{
      //     this.openSnackBar(res.code,'An error has occured'); 
      //   }
      // })
      // .catch((err) => {
      //   this.apiService.error(err);
      // });
      //   })
      // }
        this.apiService.CreateZone(this.zone)
      .then((res) => {
        if(res.code === 200){
          this.openSnackBar(res.code,res.message)
          this.getZones();
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

    else if(this.editMode){
    //   this.apiService
    // .EditProduct(this.product.id,this.product)
    // .then((res) => {
    //   if(res.code === 200){
    //     this.openSnackBar(res.code,res.message)
    //     this.getProducts();
    //     this.dialog.closeAll();
    //   }
    //   else{
    //     this.openSnackBar(res.code,'An error has occured'); 
    //   }
    // })
    // .catch((err) => {
    //   this.apiService.error(err);
    // });
    
  }
    
  }

  deleteZone(id){
    this.apiService
    .DeleteZone(id)
    .then((res) => {
      if(res.code === 200){
        this.openSnackBar(res.code,res.message)
        this.getZones();
      }
      else{
        this.openSnackBar(res.code,res.message)
      }
    })
    .catch((err) => {
      this.apiService.error(err);
    });
  }

  clearData(){
    this.zone = new zone_model; 
  }

  drawZone(id) {
    window.open(`/zone/draw?id=${id}`, "_blank");
  }

}
