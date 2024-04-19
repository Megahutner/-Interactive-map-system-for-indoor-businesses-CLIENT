import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { GlobalService } from "./global.service";
import { sort_model } from "../../model/sort-model";
import { pagging_model } from "../../model/pagging-model";


@Injectable({
  providedIn: "root",
})
@Injectable()
export class ApiService {
  public token: string;
  // public url: string = "http://54.255.241.14:8085/
  public urlBridgeService: string;
  private url: string;
  private url_image: string;


  GetHeader(): any {
    var httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-PINGOTHER": "pingpong"
      }),
    };
    return httpOptions;
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private global: GlobalService,
  ) {
    this.getConfig().subscribe(data => {
      this.url = data.serverApi;
      this.url_image = data.imagePrefix
     });
    
  }

  
  error(err) {
    if ( err.code = null) {
      //this.auth.logoutUser();
    }
  }

  private getConfig(): Observable<any> {
    return this.http.get("../../../assets/config.txt");
  }

  async getUrl(): Promise<any> {
    return await this.getConfig()
      .toPromise()
      .then((res) => {
        this.url = res.serverApi;
        this.url_image = res.serverImage;
        this.urlBridgeService = res.bridgeServiceApi;
        return res;
      });
  }

  async GetWithBody(api: string, body: any): Promise<any> {
    if (this.url === null || this.url === undefined) {
      return await this.getUrl().then((res) => {
        return this.http
          .get<any>(this.url + api, body)
          .toPromise()
          .then((data) => {
            return data;
          });
      });
    } else {
      return await this.http
        .get<any>(this.url + api, this.GetHeader())
        .toPromise()
        .then((res) => {
          return res;
        });
    }
  }

  async Get(api: string): Promise<any> {
    if (this.url === null || this.url === undefined) {
      return await this.getUrl().then((res) => {
        return this.http
          .get<any>(this.url + api, this.GetHeader())
          .toPromise()
          .then((data) => {
            return data;
          });
      });
    } else {
      return await this.http
        .get<any>(this.url + api, this.GetHeader())
        .toPromise()
        .then((res) => {
          return res;
        });
    }
  }

  async Post(api: string, json?: any): Promise<any> {
    if (this.url === null || this.url === undefined) {
      return await this.getUrl().then((res) => {
        return this.http
          .post<any>(this.url + api, json, this.GetHeader())
          .toPromise()
          .then((data) => {
            return data;
          });
      });
    } else {
      return await this.http
        .post<any>(this.url + api, json, this.GetHeader())
        .toPromise()
        .then((res) => {
          return res;
        });
    }
  }

  async Put(api: string, json?: any): Promise<any> {
    if (this.url === null || this.url === undefined) {
      return await this.getUrl().then((res) => {
        return this.http
          .put<any>(this.url + api, json, this.GetHeader())
          .toPromise()
          .then((data) => {
            return data;
          });
      });
    } else {
      return await this.http
        .put<any>(this.url + api, json, this.GetHeader())
        .toPromise()
        .then((res) => {
          return res;
        });
    }
  }

  async Delete(api: string): Promise<any> {
    if (this.url === null || this.url === undefined) {
      return await this.getUrl().then((res) => {
        return this.http
          .delete<any>(this.url + api, this.GetHeader())
          .toPromise()
          .then((data) => {
            return data;
          });
      });
    } else {
      return await this.http
        .delete<any>(this.url + api, this.GetHeader())
        .toPromise()
        .then((res) => {
          return res;
        });
    }
  }

  async PostUploadFile(api: string, formdata: any): Promise<any> {
    var httpOptions = {
      headers: new HttpHeaders({
        enctype: "multipart/form-data",
        Accept: "text/plain",
        "Cache-Control": "no-cache",
        "X-PINGOTHER": "pingpong",
      }),
    };
    if (this.url === null || this.url === undefined) {
      return await this.getUrl().then((res) => {
        return this.http
          .post<any>(this.url + api, formdata, httpOptions)
          .toPromise()
          .then((data) => {
            return data;
          });
      });
    } else {
      return await this.http
        .post<any>(this.url + api, formdata, httpOptions)
        .toPromise()
        .then((res) => {
          return res;
        });
    }
  }

  UploadFile(formdata: any, type: any, cmsId: any = 0) {
    //0: CMS
    //1: system
    if (type === 0)
      return this.PostUploadFile(
        `api/MediaInfo/upload-file?type=${type}&cmsId=${cmsId}`,
        formdata
      );
    else
      return this.PostUploadFile(
        `api/MediaInfo/upload-file?type=${type}`,
        formdata
      );
  }

 
  //Zone
  CreateZone(data) {
    return this.Post("zone/create", data);
  }

  GetZones() {
    return this.Get("zone/get");
  }

  GetZoneEnum(id){
    return this.Get(`zone/enum?id=${id}`);
   }

  DeleteZone(id) {
    return this.Delete(`zone/delete?id=${id}`);
  }
  GetZoneDetails(id) {
    return this.Get(`zone/get-zone-details?id=${id}`);
  }
  UpdateDrawZone(data) {
    return this.Post(`zone/update-draw-zone`, data);
  }
  UploadBG(formdata: any, zoneid: any) {
    return this.PostUploadFile(
      `zone/update/background?id=${zoneid}`,
      formdata
    );
  }
  //End Zone/////////////////////////////////////////////////////////////////////


    // Category APIs
    GetCategories(){
     return this.Get("category/get");
    }
    GetCategoryEnum(){
      return this.Get("category/enum");
     }
    CreateCategory(data) {
      return this.Post("category/create", data);
    }
    DeleteCategory(id) {
      return this.Delete(`category/delete?id=${id}`);
    }
    // End Category

}

