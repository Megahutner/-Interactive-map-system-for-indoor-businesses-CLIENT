// import { Component } from '@angular/core';
// import { AuthService } from './services/auth.service';


// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'EC_Clothes';
//   loggedIn = false;
//   currentUser: any;


//   constructor(private auth: AuthService) { 
//     this.loggedIn = this.auth.isAuthentication();
//     this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
//   }

//   public logout(){
//     this.auth.logoutUser();
//     window.location.reload();
//   }
// }
import { Component, OnInit, Inject, ElementRef,TemplateRef,ViewChild,DoCheck } from '@angular/core';
import { HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';



export interface ZoneObject {
  name: string;
  width:number,
  height:number,
  type:number,
  dragPosition:{x:number, y:number},
  distance:{x:number,y:number},
  rotate:number 
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck{

  @ViewChild('test') canvasRef: ElementRef

  loading: boolean = true;
  @HostListener('window:beforeunload', ['$event'])
canLeavePage($event) {
  console.log($event);
  console.log(this.change);
  if(this.change) {
    confirm('You data is unsaved. Are you sure you want to leave?')
    return false;
  }
  return true;
}  
@HostListener('document:keydown', ['$event'])
  keyPress(e) {
    var overlap=false
    var key = e.which || e.keyCode;
    for(var i=0;i<this.objects?.length;i++){
      if(this.objects[i].id==this.currentBlockID){
           switch(key){
            case 82: { // rotate (R) key 
              this.rotate(this.objects[i])
              break;
            }
            case 65:{ // left arrow (A) key
              var direction=1;
              for(const tempObject of this.objects){
                if(overlap){
                  break;
                }
                if(tempObject.name != this.objects[i].name){ // check overlap
                  if(this.checkOverlap(this.objects[i],tempObject,direction)){
                    overlap=true;
                    break;  
                  }}}
              if(overlap){ 
                 // 
                 return;
                }
                else if(this.objects[i].dragPosition.x<=0){ //can not go further if reach boundary
                  return;
                }
              else{ 
                this.tempObject=this.objects[i];
                      this.objects.splice(i,1)
                      this.objects.splice(i,0,{id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
                        type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x-1,y:this.tempObject.distance.y},distance:{x:this.tempObject.distance.x-1,y:this.tempObject.distance.y},
                        rotate:this.tempObject.rotate, color: this.tempObject.color});
                this.backArray.push({id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
                  type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},
                  rotate:this.tempObject.rotate,color: this.tempObject.color})     
                  this.table.renderRows()    
                    break;
                  }
                }
            case 87:{ // up arrow (W) key
              var direction=2;
              for(const tempObject of this.objects){
                if(overlap){
                  break;
                }
                if(tempObject.name != this.objects[i].name){ // check overlap
      
                  if(this.checkOverlap(this.objects[i],tempObject,direction))
                  {
                    overlap=true;
                    break;}}}

                    if(overlap){ 
                       // 
                    return;
                    }
                    else if(this.objects[i].dragPosition.y<=0){ //can not go further if reach boundary
                      return;
                    }
                    else{
                      this.tempObject=this.objects[i]
                      this.objects.splice(i,1)
                      this.objects.splice(i,0,{id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
                        type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x,y:this.tempObject.distance.y-1},distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y-1},
                        rotate:this.tempObject.rotate,color: this.tempObject.color 
                      }) 
                        this.backArray.push({id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
                          type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},
                          rotate:this.tempObject.rotate,color: this.tempObject.color})
                          this.table.renderRows()
                    break;
                  }
                }
            case 68: { // right arrow (D) key
              var direction=3;
              for(const tempObject of this.objects){
                if(overlap){
                  break;
                }
                if(tempObject.name != this.objects[i].name){ // check overlap
       
                  if(this.checkOverlap(this.objects[i],tempObject,direction))
                {
                    overlap=true;
                    break;
                  }}}

                  if(overlap){ 
                    // 
                    return;
                  }

                  else if(this.objects[i].dragPosition.x + this.objects[i].width>=this.floor.width){ //can not go further if reach boundary
                    return;
                   }
                  else{
                    this.tempObject=this.objects[i]
                    this.objects.splice(i,1)
                    this.objects.splice(i,0,{id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
                      type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x+1,y:this.tempObject.distance.y},distance:{x:this.tempObject.distance.x+1,y:this.tempObject.distance.y},
                      rotate:this.tempObject.rotate,color: this.tempObject.color}) 
                      this.backArray.push({id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
                        type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},
                        rotate:this.tempObject.rotate,color: this.tempObject.color})
                        this.table.renderRows()
                  break;
                }}
            case 83: { // down arrow (S) key

              var direction=4;
              for(const tempObject of this.objects){
                if(overlap){
                   break;
                  }
                if(tempObject.name != this.objects[i].name){ // check overlap
                  if(this.checkOverlap(this.objects[i],tempObject,direction)) {
                    overlap=true;
                    break;   
                  }}}
                  if(overlap){ 
                    //
                    return;
                  }
                  else if(this.objects[i].dragPosition.y + this.objects[i].height>=this.floor.height){ //can not go further if reach boundary
                    return;
                   }
                  else{
                    this.tempObject=this.objects[i]
                      this.objects.splice(i,1)
                      this.objects.splice(i,0,{id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
                        type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x,y:this.tempObject.distance.y+1},distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y+1},
                        rotate:this.tempObject.rotate,color: this.tempObject.color}) 
                        this.backArray.push({id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
                          type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},
                          rotate:this.tempObject.rotate,color: this.tempObject.color})
                          this.table.renderRows()
                    break;
                  }
                  }
                  }}}
                  if(this.change == false ){
                    this.change = true;
                  }
                }
  title = 'ThesisUWE';
  min=1;
  floor = {
    width:1000,
    height:500,
  }  
  width: any = this.floor.width;
  height: any = this.floor.height;
  input=1;
  tempObject:any;
  popupHelp:boolean = false;
  popupAddVisible:boolean=false;
  editingObject: any;
  ZoneId: any;
  ZoneInfo ={
    zone_id: "",
    name: "",
    block_count: null,
    kiosk_count: null,
    locker_count: null,
    bg_url:"./assets/picture/zone.png",
    width : null,
    height: null,
  };
  currentBlockID:any;
  typeObject = [
    {id:1, name:"Terminal"},
    {id:2, name: "Block"},
  ]
updateData = {
  Id: null,
  ObjectList: [],
  Width: null ,
  Height: null
}
backArray:any;
zoneData: any
popupChangeBG : boolean = false;
dataMedia: any;
currentMediaType: any;
currentmedia: any; 
objects = [
{ 
  id:0,
  //object_id:null,
  name:"Object A",
  width:200,
  height:200,
  type:1,
  dragPosition:{x:0, y:0},
  distance:{x:0,y:0},
  rotate:0,
  color: null 
},
{ 
  id:1,
  //object_id:null,
  name:"Object B",
  width:100,
  height:100,
  type:1,
  dragPosition:{x:500, y:200},
  distance:{x:500, y:200},
  rotate:0,
  color: null  
},
{ 
  id:2,
  //object_id:null,
  name:"Object C",
  width:200,
  height:200,
  type:1,
  dragPosition:{x:800, y:0},
  distance:{x:800, y:0},
  rotate:0,
  color: null 
},
]
change: boolean = false
object: any;
UpdateImg = {
  Id: null,
  file: null
}
value = 'Clear me';
oldOption : boolean = false;
focusedRowKey = -1;
option: boolean = true;
objectColumns: string[] = [ 'Id', 'Name','Width','Height','Coordinates',"Edit","Close"];
createMode: boolean = false;
editMode: boolean = false;
shapedimension = 10;
shapes: any;
currentRow={
  name: null,
  width:null,
  height: null,
  color: null
}
  type=1;
  previousObject: any;
  currentObject:any
  gridVisible: boolean=false;
  wallPositions: any;
  kioskInfo : any;
  focusedLocker: any;
  kioskStart: any;
  blockStart: any;
  minimumI = 0;
  minimumJ = 0;
  maximumI = 0;
  maximumJ = 0;
  pathMode: boolean = true;
  blockList: any[] = [];
  boundaryList = [
    // {
    //   Object: null,
    //   MinimumI : null,
    //   MaximumI : null,
    //   MinimumJ: null,
    //   MaximumJ: null,
    // }
  ] 
  @ViewChild('form', { static: true }) form: TemplateRef<any>;
  @ViewChild(MatTable) table: MatTable<ZoneObject>;


  constructor( @Inject(DOCUMENT) private document: any, private elementRef: ElementRef,   private _snackBar: MatSnackBar, private http: HttpClient,
  private dialog:MatDialog,
    ) {
   }
   ngOnInit(): void {
    const initData = JSON.parse(localStorage.getItem('zoneData'));
    this.objects = initData?.ObjectList ? initData?.ObjectList : this.objects;
    this.width = this.floor.width = initData?.Width ? initData?.Width : 1000 ;
    this.height = this.floor.height = initData?.Height ? initData?.Height : 1000;
    this.backArray = [];
    console.log(this.objects)
   }

   ngAfterViewInit(): void { // draw grid after ngOnInit
    this.drawGrid();
  }

  ngDoCheck(): void { // redraw grid after changing option ( Hide List / Show List)
    if(this.oldOption != this.option){
      this.oldOption = this.option;
      setTimeout(() => {
        this.drawGrid();
    }, 100);
    }
      
  }

  
  drawGrid(){  // draw a grid on the map for visibility 
    const cw = Math.fround(this.width + 1);
    const ch = Math.fround(this.height + 1);
    console.log(cw,ch)
    this.canvasRef.nativeElement.width = cw;
    this.canvasRef.nativeElement.height = ch;
    const ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.clearRect(0,0,cw,ch);
    ctx.strokeStyle = 'rgb(185, 173, 173)'; // grid borderline
    
    this.shapes = new Array(Math.fround(this.width/this.shapedimension))
    for (let i = 0; i < this.shapes.length; i++) { this.shapes[i] = new Array(Math.fround(this.height/this.shapedimension)) };
    for (let i = 0; i < this.shapes.length; i++) {
      for (let j = 0; j < this.shapes[i].length; j++) {
        let type = 0;
        let x = i * this.shapedimension;
        let y = j * this.shapedimension;
        let visited = false;
        let F = 100000;
        let G = 100000;
        let H = 100000;
        let cameFrom = undefined;
        let neighbors = new Array();
        ctx.strokeRect(x, y, this.shapedimension, this.shapedimension); // draw grid
        this.shapes[i][j] = { x, y,i,j, type, F, G, H, neighbors, cameFrom, visited };
      }

    }
  }

   startDrag(e){ // cdkDragStarted event
    this.gridVisible = true;


  }

  // onFocusedRowChanged(e){
  //   this.currentBlockID = e.row.data.id;
  //   this.focusedRowKey = e.row.data.id;
  //   this.currentObject=document.getElementById(`${e.row.data.id}`);
  //   this.previousObject=this.currentObject;
  // }
  checkOption(){
    if (this.option === true ){
      return "fa fa-expand";
    }
    return "fa fa-compress";
  }
  
  checkMapText(){
  if (this.option === true ){
    return "Hide List";
  }
  return "Show List";
  }
  mode(){
    if(this.pathMode){
      this.pathMode = false;
      this.currentBlockID = null;
    }
    else if(!this.pathMode){
      this.pathMode = true;
      this.blockList = [];
      this.drawGrid(); // redraw grid 
    }
    console.log(this.pathMode)
  }
  checkPathText(){
    if (this.pathMode){
      return "Mode: Control";
    }
    else{
      return "Mode: Pathfinding";
  
    }
    }
  checkBG(item){
    if(item === null || item === undefined || item === ""){
      return false;
    }
    return true;
  }
  
  changeOption(){
    if(this.option === true){ 
      this.option = false;
    }
    else if(this.option === false) 
    {
      this.option = true;
    }
  }
  checkOptionShow(){
    if(this.option ===true){
      return "50";
    }
    return "100";
  }
  checkOptionShowWH(){
    if(this.option ===true){
      return "10";
    }
    return "-250";
    
  }
  imageChange(e: any) {
    console.log(e.target.files[0]);
    // let selectedFile = (e.target.files[0]);
    // const fd = new FormData();
    // fd.append('image', selectedFile, selectedFile.name);
    // console.log(fd);
    // console.log(selectedFile.name);
    // this.http.post('http://localhost:4200/assets/picture', fd)
    //   .subscribe(res => {
    //     console.log(res);
    //   });
    // let file = e.target.files[0]
    //   console.log(file); 
    //   this.uploadService.upload(file).subscribe( 
    //       (event: any) => { 
    //         console.log(event);
    //       } 
    //   ); 
  }
  checkWidthChange(e){
    console.log(this.width);
    var error = false;
    for(const object of this.objects){
      if(error){
        break;
      }
      if(this.width < object.dragPosition.x + object.width){
        this.width= this.floor.width;
        error = true;
        //notify("Zone too small to contain objects!","warning");
      }
    }
    if (!error)
    {
      this.floor.width = this.width
      this.drawGrid();
    }
  
  }

  checkHeightChange(e){
    console.log(this.height);
    var error = false;
    for(const object of this.objects){
      if(error){
        break;
      }
      if(this.height < object.dragPosition.y + object.height ){
        this.height= this.floor.height;
        error = true;
        //notify("Zone too small to contain objects!","warning");
      }
    }
    if (!error)
    {
      this.floor.height = this.height
      this.drawGrid();
    }
  }
 
  checkWork(){
    if(this.change === true){
      return true;
    }
    else{
      return false;
    }
  }
  ChangeBG() {
    if (this.dataMedia !== undefined && this.dataMedia !== null && this.dataMedia !== "") {
      let uploadHinh = new FormData();
      uploadHinh.append('file', this.dataMedia, this.dataMedia.name);
      // this.apiService.UploadBG(uploadHinh,this.ZoneId).then(res => {
      //   if (res.code == 200) {
      //     this.global.showNotify("Update Image Background successfully", "success");
      //     this.popupChangeBG = false;
      //     this.ZoneInfo.bg_url = this.backgroundUrl.concat(res.data);
      //   }
      //   else {
      //     this.global.showNotify("Update Image Background fail1", "error");
      //   }
      // }).catch(err => {
      //   this.apiService.error(err);
      //   this.global.showNotify("Update Image Background fail2", "error");
      // }) 
    }
  }

  onUploaded(event: any) {
    var mediaFile = event.value[0];
    var typeMedia = mediaFile.type.split('/')[0];
    if (typeMedia.toLowerCase() === "image") {
      this.currentMediaType = 0;
      this.loadMediaFile(window.URL.createObjectURL(event.value[0]));
    }
    else {
      this.currentMediaType = 2;
      this.loadMediaFile(window.URL.createObjectURL(event.value[0]));
      return;
    }
    this.dataMedia = event.value[0];
  }
  loadMediaFile(url: any) {
    var img = this.document.getElementById('hinhupload');
    if (img === null || img === undefined) {
      setTimeout(() => { this.loadMediaFile(url); }, 300);
      return;
    }
    if (this.currentMediaType === 0) {
      img.src = url;
      img.style.display = 'block';
    }
    else {
      //this.global.showNotify(`Not support media this type`, "warning");
      img.style.display = 'none';
    }
  }

  help(){
    this.popupHelp = true;
  }
  changeBGPopup(){
    this.popupChangeBG = true;
    this.dataMedia ="";
  }
  cancelChange() {
    this.popupChangeBG = false;
  }

  updateCoordinate(){ // in case dragPosition value is float 
    for(var i=0;i<this.objects.length;i++){
      this.objects[i].dragPosition.x = Math.round(this.objects[i].dragPosition.x);
      this.objects[i].dragPosition.y = Math.round(this.objects[i].dragPosition.y);
    }
  }

  clearFocus(){
    this.currentBlockID = null;
    this.focusedRowKey = null;
  }
  checkColor(item){ // return css background color if == type
    if(item.type === 1)
      if(item.color === null || item.color === "undefined"||item.color === undefined || item.color === ""){
        return "rgb(131, 126, 126)";
      }
      else{
        return item.color;
      }
    return "rgb(212, 105, 105)"  ;
    
  }
  mouseleave(){
    console.log("1");
    this.currentBlockID = null;
  }

  checkBorder(id){ // draw border on current hightlighted block
    if(this.pathMode){
      if( id === this.currentBlockID){
        return "solid 1px black";
      }
      else{
        return "none";
      }
    }
    else{
      if(this.blockList.includes(id)){
        return "solid 1px black";
      }
      else{
        return "none";
      }
    }
  }

  rotate(item){   // change current highlighted block 's rotate value
    for (var i =0;i<this.objects.length;i++){
      if(this.objects[i].id==item.id){
        if(this.objects[i].rotate === 360){
          this.objects[i].rotate = 0;
        }
        this.objects[i].rotate += 90;
        var temp = this.objects[i].height;
        this.tempObject=this.objects[i];
        this.objects.splice(i,1);
        this.objects.splice(i,0,{id: this.tempObject.id,name: this.tempObject.name,
          width: this.tempObject.width,height: this.tempObject.height,type: this.tempObject.type,
          dragPosition:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},
          distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},
          rotate:this.tempObject.rotate,color: this.tempObject.color}); 
        this.backArray.push({id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,
          type: this.tempObject.type,dragPosition:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},
          rotate:this.tempObject.rotate-90,color: this.tempObject.color})
      }
    }
    if(this.change == false ){
      this.change = true;
    }
  }
  
      checkRotate(rotate){ // rotate current highlighted block
        return `rotateZ(${rotate}deg)`;
      }
      rotateH(item){
        if(item.rotate === 0 || item.rotate === 180 || item.rotate === 360){
          return item.height; 
        }
        else{
           return item.width;
        }
      }
      rotateW(item){
        if(item.rotate === 0 || item.rotate === 180 || item.rotate === 360){
          return item.width; 
        }
        return item.height;
      }
  
    cancel(){
      this.popupAddVisible = false;
    }

    focus(item){      // highlight a block upon mouseover
      if(this.pathMode){
        this.currentBlockID =item.id;
        this.focusedRowKey = item.id;
        //this.currentObject=document.getElementById(`${id}`);
        //this.previousObject=this.currentObject;
    
        }
        else{
          if(this.blockList.includes(item.id)){
            this.removeFromArray(this.blockList,item.id);
          }
          else{
            this.blockList.push(item.id);
          }
        }
      }
    
      checkOverlap(currentObject,otherObject,direction){ // check if blocks are overlapped or not
        const currentBlock = document.getElementById(`${currentObject.id}`).getBoundingClientRect();
        const otherBlock = document.getElementById(`${otherObject.id}`).getBoundingClientRect();
        if (direction === 0){ // check mouse drag overlap
        return !(
          currentBlock.top  >= otherBlock.bottom ||
          currentBlock.right <= otherBlock.left  ||
          currentBlock.bottom <= otherBlock.top  ||
          currentBlock.left  >= otherBlock.right
        );}
        if (direction === 1){ // check left move overlap
          return !(
            currentBlock.top  >= otherBlock.bottom ||
            currentBlock.right <= otherBlock.left  ||
            currentBlock.bottom <= otherBlock.top  ||
            currentBlock.left -1 >= otherBlock.right
          );}
          if (direction ===2){ // check up move overlap
            return !(
              currentBlock.top -1 >= otherBlock.bottom ||
              currentBlock.right <= otherBlock.left  ||
              currentBlock.bottom <= otherBlock.top  ||
              currentBlock.left  >= otherBlock.right
            );}
            if (direction ===3){// check right move overlap
              return !(
                currentBlock.top  >= otherBlock.bottom ||
                currentBlock.right <= otherBlock.left -1 ||
                currentBlock.bottom <= otherBlock.top  ||
                currentBlock.left  >= otherBlock.right
              );}
                return !(
                  currentBlock.top  >= otherBlock.bottom ||
                  currentBlock.right <= otherBlock.left  ||
                  currentBlock.bottom <= otherBlock.top -1 ||
                  currentBlock.left  >= otherBlock.right
                );
      
      }
    
    checkVirtualOverlap(virtualObject,otherObject){ // check if calculating object is overlapping objects around it or not
      
      
    
      return !(
        virtualObject.dragPosition.y  >= otherObject.dragPosition.y + otherObject.height ||
        virtualObject.dragPosition.x + virtualObject.width <= otherObject.dragPosition.x  ||
        virtualObject.dragPosition.y + virtualObject.height <= otherObject.dragPosition.y ||
        virtualObject.dragPosition.x  >= otherObject.dragPosition.x + otherObject.width
      )
     
    
    }
    
    onKeyDownDxDataGrid(e){
      if(e.event.keyCode == 65){
        e.event.preventDefault();
      }
    }

    changeXY(e,item:any){ // cdkDragEnded event
      var overlap =false;
      var virtualOverlap = false;
      var notOverlapped = false;
      var number = 0;
      var overlapX = 0;
      var overlapY = 0;
      var virtualObject = item;
  
      var result = 0;
      for(let object of this.objects){
        if(object.name==item.name){
          // object's cdkDragEnded coordinates
          var x= object.dragPosition.x + e.distance.x ; 
          var y= object.dragPosition.y + e.distance.y ;
          for(const overlappedObject of this.objects){
          
              if(overlap){
               break;
              }
               if(overlappedObject.name != item.name){ // check overlap
                if(this.checkOverlap(object,overlappedObject,0))
                {
                  console.log(x,y)
                  console.log(overlappedObject.dragPosition);
                  overlap=true;
                  if( x < overlappedObject.dragPosition.x  && x + object.width > overlappedObject.dragPosition.x + overlappedObject.width 
                    && y < overlappedObject.dragPosition.y &&y + object.height > overlappedObject.dragPosition.y){ // case 9
                    console.log("Case 9")
                    virtualOverlap = false;
                    overlapX = x;
                    overlapY = overlappedObject.dragPosition.y - object.height;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                   
                  }
                  else if( x < overlappedObject.dragPosition.x  && x + object.width > overlappedObject.dragPosition.x + overlappedObject.width 
                    && y  < overlappedObject.dragPosition.y + overlappedObject.height && y + object.height > overlappedObject.dragPosition.y + overlappedObject.height){ // case 10
                    console.log("Case 10")
                    virtualOverlap = false;
                    overlapX = x;
                    overlapY = overlappedObject.dragPosition.y + overlappedObject.height;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                   
                  }
                  else if( x < overlappedObject.dragPosition.x  && x + object.width > overlappedObject.dragPosition.x
                    && y  < overlappedObject.dragPosition.y  && y + object.height > overlappedObject.dragPosition.y + overlappedObject.height){ // case 11
                    console.log("Case 11")
                    virtualOverlap = false;
                    overlapX = overlappedObject.dragPosition.x - object.width;
                    overlapY = y;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                   
                  }
                  else if( x < overlappedObject.dragPosition.x + overlappedObject.width  && x + object.width > overlappedObject.dragPosition.x + overlappedObject.width
                    && y  < overlappedObject.dragPosition.y  && y + object.height > overlappedObject.dragPosition.y + overlappedObject.height){ // case 12
                    console.log("Case 12")
                    virtualOverlap = false;
                    overlapX = overlappedObject.dragPosition.x + overlappedObject.width;
                    overlapY = y;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                   
                  }
                 // if( y < overlappedObject.dragPosition.y && ( x> overlappedObject.dragPosition.x || x < overlappedObject.dragPosition.x )){ // case 1
                 else if(y + object.height > overlappedObject.dragPosition.y && x + object.width > overlappedObject.dragPosition.x && x < overlappedObject.dragPosition.x && y < overlappedObject.dragPosition.y){
                    console.log("Case 1")
                    virtualOverlap = false;
                    overlapX = x;
                    overlapY = overlappedObject.dragPosition.y - object.height;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                   
                  
                  }
                  //else if (x< overlappedObject.dragPosition.x){  // case 2
                  else if (x < overlappedObject.dragPosition.x + overlappedObject.width && y + object.height > overlappedObject.dragPosition.y && y < overlappedObject.dragPosition.y && x + object.width > overlappedObject.dragPosition.x + overlappedObject.width){  // case 2
                    console.log("Case 2")
  
                    virtualOverlap = false;
                    overlapX = overlappedObject.dragPosition.x + overlappedObject.width;
                    overlapY = y;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
                          virtualOverlap = true;                      
                      }
                      }
                    }
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    
                  }
                 
                    
  
                  }
                  else if( x + object.width > overlappedObject.dragPosition.x && y < overlappedObject.dragPosition.y + overlappedObject.height && x < overlappedObject.dragPosition.x
                    && y + object.height > overlappedObject.dragPosition.y + overlappedObject.height ){ // case 3
                    console.log("Case 3")
  
                    virtualOverlap = false;
                    overlapX = overlappedObject.dragPosition.x - object.width;
                    overlapY = y;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;                     
                      }
                      }
                    }
                  
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    
                  }
                 
                    
                  }
                  //else if ( y < overlappedObject.dragPosition.y + overlappedObject.height ){ // case 4
                  else if( x < overlappedObject.dragPosition.x + overlappedObject.width && y < overlappedObject.dragPosition.y + overlappedObject.height 
                    && x + object.width > overlappedObject.dragPosition.x + overlappedObject.width && y + object.height > overlappedObject.dragPosition.y + overlappedObject.height   ){ // case 4
                    console.log("Case 4")
  
                    virtualOverlap = false;
                    overlapX = x;
                    overlapY = overlappedObject.dragPosition.y + overlappedObject.height;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;                      
                      }
                      }
                    }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                  
                  }
                  else if( y < overlappedObject.dragPosition.y && y + object.height > overlappedObject.dragPosition.y){ // case 5
                    console.log("Case 5")
                    virtualOverlap = false;
                    overlapX = x;
                    overlapY = overlappedObject.dragPosition.y - object.height;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                   
                  }
                  else if( y < overlappedObject.dragPosition.y + overlappedObject.height && y + object.height > overlappedObject.dragPosition.y + overlappedObject.height){ // case 6
                    console.log("Case 6")
                    virtualOverlap = false;
                    overlapX = x;
                    overlapY = overlappedObject.dragPosition.y + overlappedObject.height;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                    
                  }
                  else if( x < overlappedObject.dragPosition.x && x + object.width > overlappedObject.dragPosition.x ){ // case 8
                    console.log("Case 7")
                    virtualOverlap = false;
                    overlapX = overlappedObject.dragPosition.x - object.width;
                    overlapY = y;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                   
                  }
                  else if( x < overlappedObject.dragPosition.x + overlappedObject.width && x + object.width > overlappedObject.dragPosition.x + overlappedObject.width){ // case 8
                    console.log("Case 8")
                    virtualOverlap = false;
                    overlapX = overlappedObject.dragPosition.x + overlappedObject.width;
                    overlapY = y;
                    if(overlapX < 0 || overlapY < 0){
                      break;
                    }
                   
                    virtualObject.dragPosition.x = overlapX;
                    virtualObject.dragPosition.y = overlapY;
                    for(const otherObject of this.objects){
                      if(virtualOverlap){
                        break;
                      }
                      if(otherObject.name != overlappedObject.name && otherObject.name != object.name){
                        if(this.checkVirtualOverlap(virtualObject,otherObject)){
                          console.log("virtual overlap");
  
                          virtualOverlap = true;      
                      }
                    }
                      }
                    
                    if(!virtualOverlap){
                      notOverlapped = true;                    
                    }
                   
                  }
                  break;
  
            }}
          }
          if(overlap == true){ // using distance in object to redraw object's previous coordinates
         //   if(!notOverlapped ){
              this.tempObject = object;
             x = 0 + object.distance.x ;
             y = 0 + object.distance.y;
             this.objects.splice(number,1);
             this.objects.splice(number,0,{id: this.tempObject.id,name: this.tempObject.name,
              width: this.tempObject.width,height: this.tempObject.height,
              type: this.tempObject.type,
              dragPosition:{x:x,y:y},distance:{x:x,y:y},
              rotate:this.tempObject.rotate,color: this.tempObject.color})
  
            //  this.backArray.push({id: this.tempObject.id,name: this.tempObject.name,
            //   width: this.tempObject.width,height: this.tempObject.height,
            //   type: this.tempObject.type,
            //   dragPosition:{x:this.tempObject.x,y:this.tempObject.y},distance:{x:this.tempObject.x,y:this.tempObject.y},
            //   rotate:this.tempObject.rotate})
             return;
            //}
            // else{
            // this.tempObject = object;
            //  this.objects.splice(number,1);
            //  this.objects.splice(number,0,{id: this.tempObject.id,name: this.tempObject.name,width: this.tempObject.width,height: this.tempObject.height,type: this.tempObject.type,dragPosition:{x:overlapX,y:overlapY},distance:{x:overlapX,y:overlapY},rotate:this.tempObject.rotate})  
            //  this.backArray.push({id: this.tempObject.id,name: this.tempObject.name,
            //   width: this.tempObject.width,height: this.tempObject.height,
            //   type: this.tempObject.type,
            //   dragPosition:{x:this.tempObject.dragPosition.x,y:this.tempObject.dragPosition.y},distance:{x:this.tempObject.distance.x,y:this.tempObject.distance.y},
            //   rotate:this.tempObject.rotate})
            //  return;
            // }
          }
          else{ // calculate object's new coordinates and distance
            this.backArray.push({id: object.id,name: object.name,
              width: object.width,height: object.height,
              type: object.type,
              dragPosition:{x:object.dragPosition.x,y:object.dragPosition.y},distance:{x:object.distance.x,y:object.distance.y},
              rotate:object.rotate})
          object.dragPosition.x = x;
          object.dragPosition.y = y;
          object.distance.x += e.distance.x ;
          object.distance.y += e.distance.y ;
  
          if(object.distance.x < 0){ // left boundary
            object.distance.x = 0;
            object.dragPosition.x=0;
          }
          if(object.distance.y < 0){ // top boundary
            object.distance.y = 0;
            object.dragPosition.y = 0;
          }
          if(object.distance.x + object.width > this.floor.width){  // right boundary
            object.distance.x = this.floor.width - object.width;
            object.dragPosition.x = this.floor.width -object.width;
          }
          if(object.distance.y + object.height> this.floor.height){ // bottom boundary
            object.distance.y = this.floor.height -object.height;
            object.dragPosition.y = this.floor.height -object.height;
          }
          
          }
        }
        number +=1;
      }
      this.currentBlockID=item.id; // highlight a block after drag
      this.gridVisible = false;
      if(this.change == false ){
        this.change = true;
      }
      
    }

    saveData(){
      var updateZone = this.updateData;
    updateZone.Id = this.ZoneId;
    updateZone.Height = this.floor.height;
    updateZone.Width = this.floor.width;
    updateZone.ObjectList = this.objects;
    localStorage.setItem('zoneData',JSON.stringify(updateZone));
    this.change = false;
    this.openSnackBar("Success","200");

    }
    openSnackBar(code,message) {
      this._snackBar.open(code, message, {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration : 3000
      });
    }

    openCreate(){
      this.clearFocus();
      this.createMode = true;
      this.editMode = false;
      this.currentRow.name = "";
      this.currentRow.width = 0;
      this.currentRow.height = 0;
      this.currentRow.color = null;
      this.dialog.open(this.form);
    }

    openEdit(object){
      this.clearFocus();
      this.createMode = false;
      this.editMode = true;
      this.editingObject = object;
      this.currentRow.name = object.name;
      this.currentRow.width = object.width;
      this.currentRow.height = object.height;
      this.currentRow.color = object.color;
      this.dialog.open(this.form);
    }

    createOrEdit(){
      if(this.currentRow.name === '' || this.currentRow.name === null || this.currentRow.name === undefined){
        this.openSnackBar(422,'Name is required');
        return;
      }
      if(this.currentRow.width === 0 || this.currentRow.width === null || this.currentRow.width === undefined){
        this.openSnackBar(422,'Width is required');
        return;
      }
      if(this.currentRow.height === 0 || this.currentRow.height === null || this.currentRow.height === undefined){
        this.openSnackBar(422,'Height is required');
        return;
      }
      if(this.createMode){
        //
        for(var i=0;i<this.objects?.length;i++){
          if(this.objects[i].name === this.currentRow.name){
            this.openSnackBar(422,'Duplicate name');
            return;
          }
          }
          let count = 0;
          for (var i = 0; i < this.objects?.length; i++) {
            console.log(i);
            if(!this.objects.find(x=>x.id === i) ){
              count = i;
              break;
            }
          if(count === 0){
            count = this.objects.length
          }      
        
          }  
          this.objects.push({id: count,name: this.currentRow.name,width: this.currentRow.width,height: this.currentRow.height,
          type: 1,dragPosition:{x:0,y:0},distance:{x:0,y:0},
          rotate:0,color: this.currentRow.color}) ;
        this.table.renderRows();
        this.dialog.closeAll();
      }
      else{
        for(var i=0;i<this.objects.length;i++){
          if(this.objects[i].name === this.currentRow.name && this.objects[i].id != this.editingObject.id){
            this.openSnackBar(422,'Duplicate name');
            return;
          }
          }  
          this.backArray.push({id: this.editingObject.id,name: this.editingObject.name,width: this.editingObject.width,height: this.editingObject.height,
            type: this.editingObject.type,dragPosition:{x:this.editingObject.distance.x,y:this.editingObject.distance.y},distance:{x:this.editingObject.distance.x,y:this.editingObject.distance.y},
            rotate:this.editingObject.rotate,color: this.editingObject.color});
        this.editingObject.name = this.currentRow.name;
        this.editingObject.width = this.currentRow.width;
        this.editingObject.height = this.currentRow.height;
        this.editingObject.color = this.currentRow.color;
        this.dialog.closeAll();
      }
    }

    deleteObject(object){
      for(var i=0;i<this.objects.length;i++){
        if(this.objects[i].id === object.id){
          this.backArray.push({id: object.id,name: object.name,width: object.width,height: object.height,
            type: object.type,dragPosition:{x:object.distance.x,y:object.distance.y},distance:{x:object.distance.x,y:object.distance.y},
            rotate:object.rotate,color: object.color});
          this.objects.splice(i,1);
          this.table.renderRows();
        }
    }
  }

  backFunc(){
    let object = this.backArray.pop();
    let deleted = true;
    console.log(object);
    for(var i=0;i<this.objects.length;i++){
      if(this.objects[i].id === object.id){
        deleted = false;
        this.objects.splice(i,1);
        this.objects.splice(i,0,object);
        this.table.renderRows();
      }
  }
  if(deleted){
    this.objects.splice(this.objects.length,0,object);
    this.table.renderRows();
  }
  }

  //////// pathfinding algorithm

  async pathfinder_a_star_search(){
    // if(this.currentBlockID == null){
    //   this.global.showNotify("Please click on a locker block!", "error");
    //   return;
    // }
    if(this.blockList.length === 0){
      //this.global.showNotify("Please select block(s)!", "error");
      return;
    }
    const begin = Date.now();
    let Ends = [];
    this.searchNotObject();
    let openSet = [];
    let closedSet = [];
    let start, end;
    let path = [];
    let optimizedPath = [];
    let nextEnd;
    let destinations = [];
    this.findNeighbors();
    console.log(this.kioskInfo)
    console.log(this.focusedLocker)
    this.kioskInfo.forEach(x => { x.type = 0});
    this.focusedLocker.forEach(x => { x.type = 1});
    //let destinations = this.objects.filter(object => this.blockList.includes(object.id));
    // const object = this.objects.find(block => block.id == this.currentBlockID );
    this.boundaryList.forEach(object => {
      //console.log(object.MinimumI,object.MaximumI,object.MinimumJ,object.MaximumJ,)
      switch (object.Object.rotate){
        
        case 360:{
          for(let i = object.MaximumI - 1; i <= object.MaximumI;i ++){
            let j = Math.floor(object.MinimumJ + (object.MaximumJ - object.MinimumJ)/2);
            this.shapes[i][j].type = 0;
            
            
          }
          end = this.shapes[object.MaximumI-1][Math.floor(object.MinimumJ + (object.MaximumJ - object.MinimumJ)/2)];
          break;
        }
        case 0:{
          for(let i = object.MaximumI - 1; i <= object.MaximumI;i ++){
            let j = Math.floor(object.MinimumJ + (object.MaximumJ - object.MinimumJ)/2);
            console.log(this.shapes[i][j]);
            this.shapes[i][j].type = 0;
          }
          
          end = this.shapes[object.MaximumI-1][Math.floor(object.MinimumJ + (object.MaximumJ - object.MinimumJ)/2)];
          break;
        }
        case 90:{
          let i = Math.floor(object.MinimumI + (object.MaximumI - object.MinimumI)/2)
            for(let j = object.MaximumJ - 1; j <= object.MaximumJ;j ++){
              console.log(this.shapes[i][j]);
                this.shapes[i][j].type = 0;
            }
          
          end = this.shapes[Math.floor(object.MinimumI + (object.MaximumI - object.MinimumI)/2)][object.MaximumJ-1];
          break;
        }
        case 180:{
          for(let i = object.MinimumI; i <= object.MinimumI + 1;i ++){
            let j = Math.floor(object.MinimumJ + (object.MaximumJ - object.MinimumJ)/2);
            this.shapes[i][j].type  = 0;
          }
          end = this.shapes[object.MinimumI +1][Math.floor(object.MinimumJ + (object.MaximumJ - object.MinimumJ)/2)];
          break;
        }
        case 270:{
          let i = Math.floor(object.MinimumI + (object.MaximumI - object.MinimumI)/2);
            for(let j = object.MinimumJ ; j <= object.MinimumJ + 1;j ++){
                this.shapes[i][j].type = 0;
            }
          }
          end = this.shapes[Math.floor(object.MinimumI + (object.MaximumI - object.MinimumI)/2)][object.MinimumJ +1];
          break;
        
      }
      if(this.wallPositions.includes(end)){
        //this.global.showNotify("One of the destinations is unreachable: " + object.Object.name, "error");
        //exit();
      }
      Ends.push(end);
    })
    start = this.kioskStart;
    nextEnd = start;
    //openSet.push(start);
    while(Ends.length > 0){
      const beginLoop = Date.now();
       // temporary solution (follow throughout Ends list)
      for(let x  = 0; x < Ends.length; x++){
      openSet.push(start);
      end = Ends[x];
      while (openSet.length > 0) {
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
          if (openSet[i].F < openSet[lowestIndex].F)
            lowestIndex = i;
        }
        //current node
        let current = openSet[lowestIndex];
        //console.log(current);
  
        //if reached the end
       // if (openSet[lowestIndex] === end ) {
        if(openSet[lowestIndex] == end){
          const endLoop = Date.now();
          console.log("Loop " + (endLoop - beginLoop) +"ms")
          console.log("Open set - " + openSet.length);
          console.log("Closed set - " + closedSet.length);
          openSet = [];
          closedSet = [];
          //path = [];
          let temp = current;
          destinations.push(temp);
          path.push(temp);
          while (temp.cameFrom) { 
            path.push(temp.cameFrom);
            temp = temp.cameFrom;
          }
          for (let i = 0; i < this.shapes.length; i++) { // reset loop objects
            for (let j = 0; j < this.shapes[0].length; j++) {

              this.shapes[i][j].cameFrom = undefined;
              this.shapes[i][j].F = 100000;
              this.shapes[i][j].G = 100000;
              this.shapes[i][j].H = 100000;
            }
          }

          break;
       
        }
  
        
  
        this.removeFromArray(openSet, current);
        closedSet.push(current);
  
        let my_neighbors = current.neighbors;
        for (let i = 0; i < my_neighbors.length; i++) {
          var neighbor = my_neighbors[i];
          if (!closedSet.includes(neighbor) && neighbor.type == 0) {
            let tempG = current.G + 1;
            let newPath = false;
            if (openSet.includes(neighbor)) {
              if (tempG < neighbor.G) {
                neighbor.G = tempG;
                newPath = true;
              }
            } else {
              neighbor.G = tempG;
              newPath = true;
              openSet.push(neighbor);
            }
  
            if (newPath) {
              neighbor.H = this.heuristic(neighbor, end);
              //neighbor.F = neighbor.G + neighbor.H;
              neighbor.G = neighbor.F + neighbor.H;
              neighbor.cameFrom = current;
            }
  
          }
        }
      } 
      if(optimizedPath.length == 0 || path.length < optimizedPath.length ){
        optimizedPath = path;
        nextEnd = end;
      }
      path = [];
    }
      //draw
      for (let k = optimizedPath.length - 1; k >= 0; k--) {
        this.drawNode(optimizedPath[k].x, optimizedPath[k].y)        
      }
      optimizedPath = [];
      this.removeFromArray(Ends, nextEnd);
      start = nextEnd;
      continue;
      
    }
    for (let o = 0; o < destinations.length;o++){ // highlight destination(s)
      const ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.beginPath();
    ctx.arc(destinations[o].x + this.shapedimension/2, destinations[o].y + this.shapedimension/2, this.shapedimension/2, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.stroke();
    }
    const last = Date.now();
    console.log(last-begin);
    
  

  }
  async drawNode(xPos, yPos) {
    const ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.beginPath();
    ctx.arc(xPos + this.shapedimension/2, yPos + this.shapedimension/2, this.shapedimension/2, 0, 2 * Math.PI);
    ctx.fillStyle = "#DC143D";
    ctx.fill();
    ctx.stroke();
  }





  findNeighbors() {
    for (let i = 0; i < this.shapes.length; i++) {
      for (let j = 0; j < this.shapes[0].length; j++) {
        if (i < this.shapes.length - 1) {
          this.shapes[i][j].neighbors.push(this.shapes[i + 1][j]);
        }
        if (i > 0) {
          this.shapes[i][j].neighbors.push(this.shapes[i - 1][j]);
        }
        if (j < this.shapes[0].length - 1) {
          this.shapes[i][j].neighbors.push(this.shapes[i][j + 1]);
        }
        if (j > 0) {
          this.shapes[i][j].neighbors.push(this.shapes[i][j - 1]);
        }

      }
    }
  }

  searchNotObject(){ // check if calculating object is overlapping objects around it or not
    this.wallPositions = [];
    this.kioskInfo = [];
    this.focusedLocker = [];
    this.blockStart = null;
    this.kioskStart = null;
    this.minimumI = 0;
    this.minimumJ = 0;
    this.maximumI = 0;
    this.maximumJ = 0;
    this.boundaryList = [];
    this.drawGrid(); // redraw grid + reset every block to its original state
    var containerX = document.getElementById('container').getBoundingClientRect().x ;
    var containerY = document.getElementById('container').getBoundingClientRect().y ;
    var temp = this.objects[0]; // temporary set temp as the first one in this.objects
    for(const object of this.objects){
      const block = document.getElementById(`${object.id}`).getBoundingClientRect();      
      if(temp.id != object.id && this.blockList.includes(temp.id)){
        let boundary = {
          Object : temp,
           MinimumI : this.minimumI,
           MaximumI : this.maximumI,
           MinimumJ : this.minimumJ,
           MaximumJ : this.maximumJ
        }
        this.boundaryList.push( boundary)

      
      this.minimumI = 0;
      this.minimumJ = 0;
      this.maximumI = 0;
      this.maximumJ = 0;

}
temp = object;

      for (let i = 0; i < this.shapes.length; i++) {
        for (let j = 0; j < this.shapes[0].length; j++) {
          let x = this.shapes[i][j].x;
          let y = this.shapes[i][j].y;
            if(!(( block.top - 10 - containerY )  >= y + this.shapedimension ||
              block.right + 10 - containerX <= x  ||
              block.bottom + 10  - containerY <= y||
              block.left - 10 - containerX  >= x + this.shapedimension)){                    
                if(object.type == 2){
                  this.kioskInfo.push(this.shapes[i][j]);
                  if(x  <= this.centerCoor(object).x && x + this.shapedimension  >= this.centerCoor(object).x && y   <= this.centerCoor(object).y && y  + this.shapedimension >= this.centerCoor(object).y){
                    this.kioskStart = this.shapes[i][j];
                  }
                }
                else if(object.type == 1 && this.blockList.includes(object.id)){
                  this.focusedLocker.push(this.shapes[i][j]);
                  
                  if( this.minimumI == 0 && this.minimumJ == 0 && this.maximumI == 0 && this.maximumJ == 0){
                    this.minimumI = i;
                    this.minimumJ = j;
                    this.maximumI = i;
                    this.maximumJ = j
                  }
                  else{
                    if(i < this.minimumI){
                      this.minimumI = i;
                    }
                    else if(i > this.maximumI){
                      this.maximumI = i;
                    }
                    if(j < this.minimumJ){
                      this.minimumJ = j;
                    }
                    else if(j > this.maximumJ){
                      this.maximumJ = j;
                    }
                  }
                }
                else{
                  this.shapes[i][j].type= 1; 
                  this.wallPositions.push( this.shapes[i][j]);     
                }
                           
          }
          this.shapes[i][j].visited = false;
          this.shapes[i][j].cameFrom = undefined;
        }
      }
    }
    if(this.blockList.includes(temp.id)){  // incase the last object
      this.boundaryList.push({
        Object : temp,
        MinimumI : this.minimumI,
        MaximumI : this.maximumI,
        MinimumJ : this.minimumJ,
        MaximumJ : this.maximumJ
      })
    }
    
    
  }
  removeFromArray(arr, element) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == element) {
        arr.splice(i, 1);
      }
    }
  }
  heuristic(a, b) {
    let d = (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
    return d;
  }


  // Calculate object's center coordinates for rotating,moving,showing on table list and editing
centerCoor(object){
  return {
    x : object.dragPosition.x + object.width/2,
    y : object.dragPosition.y + object.height/2
  }
}
// Calculate object's dragPosition coordinates to draw/redraw
initialCoor (object){
  return {
    x: object.centerCoor.x - object.width/2,
    y: object.centerCoor.y - object.height/2
  }
}


  //////// end pathfinding algorithm
  

  //////// start of xlsx
  exportData(): void {
    let data: any = [];
    let exportObject = this.objects.filter(x=>x.type === 1);
    exportObject.forEach((x)=>{
      data.push({id: `${x.id}`,type:`${x.type}`,name: `${x.name}`,
       width: `${x.width}`,height: `${x.height}`,
       x: `${x.dragPosition.x}`,y: `${x.dragPosition.y}`,rotate: `${x.rotate}`, color:`${x.color}`});
    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `map.xlsx`);
}

importData($event: any) {
  const files = $event.target.files;
  if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
          const wb = XLSX.read(event.target.result);
          const sheets = wb.SheetNames;

          if (sheets.length) {
              let rows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
              this.converData(rows)
          }
      }
      reader.readAsArrayBuffer(file);
  }
}

converData(data: any[]) {
  this.objects = this.objects.filter(x=>x.type === 2);
  for (let index = 1; index < data.length; index++) {
    var object = {id: Number(data[index].id),name: data[index].name,width: Number(data[index].width),height: Number(data[index].height),
      type: Number(data[index].type),dragPosition:{x:Number(data[index].x),y:Number(data[index].y)},distance:{x:Number(data[index].x),y:Number(data[index].y)},
      rotate:Number(data[index].rotate), color:data[index].color};
    this.objects.push(object);
    console.log(object);
  }
}
}

