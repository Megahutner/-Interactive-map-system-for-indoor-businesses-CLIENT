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

  public NamePattern = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;

  constructor(private http: HttpClient, private router: Router) {
  }

  public getConfig(): Observable<any> {
    return this.http.get("../../../assets/config.txt");
  }

  public showNotify(content: string, status: string) {
    notify(
      {
        message: content,
        width: 1000,
      },
      status,
      2000
    );
  }

  public FormatDateSendServer(date: Date) {
    var dateconvert: any;
    var month = date.getMonth() + 1;
    var dates = date.getDate();
    dateconvert = `${date.getFullYear()}-${month >= 10 ? month : "0" + month}-${
      dates >= 10 ? dates : "0" + dates
    }`;
    return dateconvert;
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

  public YYYYMMDD(data: any) {
    if (data === null || data === undefined || data === "") return "";
    var date = new Date(data);
    var dateconvert: any;
    var hours = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var month = date.getMonth() + 1;
    var dates = date.getDate();
    dateconvert = `${date.getFullYear()}-${month >= 10 ? month : "0" + month}-${
      dates >= 10 ? dates : "0" + dates
    } ${hours >= 10 ? hours : "0" + hours}:${
      minute >= 10 ? minute : "0" + minute
    }:${second >= 10 ? second : "0" + second}`;
    return dateconvert;
  }

  public DDMMYYYY(data: any) {
    if (data === null || data === undefined || data === "") return "";
    var date = new Date(data);
    var dateconvert: any;
    var month = date.getMonth() + 1;
    var dates = date.getDate();
    dateconvert = `${dates >= 10 ? dates : "0" + dates}-${
      month >= 10 ? month : "0" + month
    }-${date.getFullYear()}`;
    return dateconvert;
  }

  public FormatDateYMD(data: any) {
    if (data === null || data === undefined || data === "") return "";
    var date = new Date(data);
    var dateconvert: any;
    var month = date.getMonth() + 1;
    var dates = date.getDate();
    dateconvert = `${date.getFullYear()}-${month >= 10 ? month : "0" + month}-${
      dates >= 10 ? dates : "0" + dates
    }`;
    return dateconvert;
  }

  public passWordRegex(data: any) {
    if (data === null || data === undefined || data === "") return "";
    var checkPass: any;
    checkPass = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.-])[A-Za-z\d!@#$%^&*.-]{15,}$/
    );
    return checkPass.test(data);
  }

  public GetTimeSpan(data: any) {
    if (data === null || data === undefined || data === "") return "00:00:00";
    var date = new Date(data);
    var dateconvert: any;
    var hours = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    dateconvert = `${hours >= 10 ? hours : "0" + hours}:${
      minute >= 10 ? minute : "0" + minute
    }:${second >= 10 ? second : "0" + second}`;
    return dateconvert;
  }

  // public calculateFilterExpression(value, selectedFilterOperation, target) {
  //   function converTime(valueTime) {
  //     var date = new Date(valueTime);
  //     var dateconvert: any;
  //     var hours = date.getHours();
  //     var minute = date.getMinutes();
  //     var second = date.getSeconds();
  //     var month = date.getMonth() + 1;
  //     var dates = date.getDate();
  //     dateconvert = `${date.getFullYear()}-${
  //       month >= 10 ? month : "0" + month
  //     }-${dates >= 10 ? dates : "0" + dates} ${
  //       hours >= 10 ? hours : "0" + hours
  //     }:${minute >= 10 ? minute : "0" + minute}:${
  //       second >= 10 ? second : "0" + second
  //     }`;
  //     return dateconvert;
  //   }
  //   console.log(value);
  //   console.log(selectedFilterOperation);
  //   console.log(target);
  //   const column = this as any;
  //   if (selectedFilterOperation !== "between") {
  //     return [column.dataField, selectedFilterOperation, converTime(value)];
  //   } else {
  //     if (value[0] !== undefined && value[1] !== undefined) {
  //       return [
  //         [column.dataField, ">=", converTime(value[0])],
  //         "and",
  //         [column.dataField, "<=", converTime(value[1])],
  //       ];
  //     }
  //   }
  // }

  public numberOnly(data: any) {
    if (data === null || data === undefined || data === "") return "";
    var check: any;
    check = new RegExp(/^[A-Za-z0-9\s!@#$%^&*.-]$/);
    return check.test(data);
  }

  public AlphanumericOnly(data: any) {
    if (data === null || data === undefined || data === "") return "";
    var check: any;
    check = new RegExp(/^[a-zA-Z0-9\-_+[\]|:,.]*$/);
    return check.test(data);
  }

  public formatEmail(data) {
    if (data === null || data === undefined || data === "") return "";
    var check: any;
    check = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    return check.test(data);
  }

  public formatMobile(data) {
    if (data === null || data === undefined || data === "") return "";
    var check: any;
    check = new RegExp(/^[0]\d{9}$/);
    return check.test(data);
  }

  public CardReaderType = [
    { Id: 0, Name: "Standard Hexadecimal" },
    { Id: 1, Name: "Standard Decimal" },
    { Id: 2, Name: "Standard Hexadecimal Reverse" },
    { Id: 3, Name: "Standard Decimal Reverse" },
  ];

  public CardReaderDevice = [
    { Id: 1, Name: "Required LMS Agent" },
    { Id: 2, Name: "No required LMS Agent" },
  ];

  public ConverToHexData(drawData: any, currentCarReaderType: any = undefined) {
    var converData = drawData;
    if (drawData != undefined && drawData != null && drawData.length > 0) {
      var carReaderType = JSON.parse(localStorage.getItem("card-reader"))?.type;
      if (currentCarReaderType == undefined) {
        currentCarReaderType = 0;
        if (carReaderType !== undefined && carReaderType != null)
          currentCarReaderType = Number(carReaderType);
      }
      console.log(drawData + currentCarReaderType);
      switch (currentCarReaderType) {
        case 1:
          converData = Number(drawData).toString(16);
          break;
        case 2:
          if (drawData != undefined && drawData.length < 8)
            drawData = drawData.padStart(8, "0");
          converData =
            drawData.substring(6, 8) +
            drawData.substring(4, 6) +
            drawData.substring(2, 4) +
            drawData.substring(0, 2);
          break;
        case 3:
          var tempData = Number(drawData).toString(16);
          if (tempData != undefined && tempData.length < 8)
            tempData = tempData.padStart(8, "0");
          converData =
            tempData.substring(6, 8) +
            tempData.substring(4, 6) +
            tempData.substring(2, 4) +
            tempData.substring(0, 2);
          break;
      }
    }
    if (
      converData != undefined &&
      converData.length > 0 &&
      converData.length < 8
    )
      converData = converData.padStart(8, "0");
    return converData;
  }

  convertUTCToLocalDateIgnoringTimezone(utcDate: Date) {
    return new Date(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate(),
      utcDate.getUTCHours(),
      utcDate.getUTCMinutes(),
      utcDate.getUTCSeconds(),
      utcDate.getUTCMilliseconds()
    );
  }
}
