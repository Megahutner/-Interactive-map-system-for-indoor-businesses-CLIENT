import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import notify from "devextreme/ui/notify";


@Injectable({
  providedIn: "root",
})
@Injectable()
export class GlobalService {
  public serverUrl: string;
  public imageUrl : string;
  public stripeKey: string;

  constructor(private http: HttpClient, private router: Router) {
    this.getConfig().subscribe((data) => {
      console.log(data);
      this.serverUrl = data.serverApi;
      this.imageUrl = data.imagePrefix;
      this.stripeKey = data.stripeKey;
      console.log(this.stripeKey)
    });
  }

  public getConfig(): Observable<any> {
    return this.http.get("../../../assets/config.txt");
  } 
  public showNotify(content: string, status: string) {
    notify(
      {
        message: content,
        width: 1500,
      },
      status,
      2000
    );
  }


  public FormatDatetimeShow(data: any) {
    if (data === null || data === undefined || data === "") return "";
    var date = new Date(data);
    var dateconvert: any;
    var hours = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var month = date.getMonth() + 1;
    var dates = date.getDate();
    dateconvert = `${month >= 10 ? month : "0" + month}-${
      dates >= 10 ? dates : "0" + dates
    }-${date.getFullYear()} ${hours >= 10 ? hours : "0" + hours}:${
      minute >= 10 ? minute : "0" + minute
    }:${second >= 10 ? second : "0" + second}`;
    return dateconvert;
  }

  public imageLink(data){
    if(data ==='' || data === null || data === undefined){
      return 'https://as1.ftcdn.net/v2/jpg/03/35/13/14/1000_F_335131435_DrHIQjlOKlu3GCXtpFkIG1v0cGgM9vJC.jpg';
    }
    return this.imageUrl + data;
  }
  public getStripeKey(){
    return this.stripeKey;
  }
}
