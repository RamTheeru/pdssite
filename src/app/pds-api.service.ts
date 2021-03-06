import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from "@angular/common/http";
import { Router } from "@angular/router";
import * as R from "rxjs";
import { catchError } from "rxjs/internal/operators";
import swal from "sweetalert2";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/retry"; // don't forget the imports
import { Observable, EMPTY, throwError, of } from "rxjs";
import { APIResult } from "./models/apiresult";
import { AppComponent } from "./app.component";
export const CurrentUrls = {
  constants: "Constants",
  approve: "ApproveUser",
  employeelist: "employees",
  daemployeelist: "DAEmployees",
  registeremployee: "RegisterEmployee",
  registeremployees: "RegisteredUsers",
  createemployee: "CreateEmployee",
  createDAemployee: "CreateDAEmployee",
  createPDSemployee: 'CreatePDSEmployee',
  pdsunapprovedemployees: 'PDSUnApprovedEmployees',
  pdsemployees: 'PDSEmployees',
  checkempCode:"CheckEmpCode",
  checkcdaCode :"CheckCDACode",
  login: "Login",
  employeelogins: "Logins",
  checkUsername: "CheckUserName",
  adminDetails: "AdminDetails",
  createconstant: "CreateCC",
  getCDADeliverylist: "CDAGetDeiveryDetails",
  getCDADeliveryStation: "CDAStationDeiveryDetails",
  updateCDADeliverylist: "CDAUpdateDeiveryDetails",
  PDFFileDownload: "DownloadCDADeiveryDetails",
  backuplist: "Backups",
  updatesession: "SessionUpdate",
  restore: "RestoreDb",
  voucherCreate:"InsertVoucher",
  voucherUpdate:"UpdateVoucher",
  voucherDetails:"VoucherDetails",
  previousmonthCredit:"PreviousMonthCredit",
  creditInsert:"InsertCredit",
  resetPassword: "ResetPassword",
  legders:"Ledgers",
  vouchers:"Vouchers",
  approveVouchers:"ApproveVoucher",
  rejectvouchers:"RejectVoucher",
  downloadLedger:"DownloadLedgerDetails",
  uploadfile:"upload",
  downloadattendance : "DownloadAttendance",
  logout: "DeleteSession"
};
@Injectable()
export class PdsApiService {
  // Base url
  baseurl = "https://www.kleenandshine.com/v1/api/";
  //baseurl = "https://localhost:9900/api/";
  usrToken: string = "";
  apiResult: APIResult;
  //constantsUrl: string = "Constants";
  financeUrl: string = "Finance/";
  employeesUrl: string = "Employee/";
  config = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");
  constructor(private http: HttpClient, private router: Router) {}
  posthttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    })
  };
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      //"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods:": "GET,POST,OPTIONS,DELETE,PUT",
      "Access-Control-Allow-Headers": "*"
    })
  };
  //   getUserTypes() :  R.Observable<any>  {
  //     console.log(this.baseurl + this.userTypesUrl);
  //   return this.http.get(this.baseurl + this.userTypesUrl,this.httpOptions)
  //
  // }
  // showloading() {
  //   this.app.showload();
  // }
  // hideloading() {
  //   //
  //   this.app.hideload();
  // }
  ValidateAlpha(txt: string): boolean {
    var val = false;
    var regexp = new RegExp("^[A-Za-z ]+$");
    val = regexp.test(txt);
    return val;
  }
  ValidateNumbers(txt: string): boolean {
    var val = false;
    var regexp = new RegExp("^[0-9]+$");
    val = regexp.test(txt);
    return val;
  }
  getmonthFromDate(str)
  {
    var mnth = "0";
    if(str != null && str!= "" && str != undefined){
    var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    console.log(mnth);
    }
    return mnth;
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  transform(value): any {
    let res = [];
    for (let i = 1; i <= value; i++) {
      res.push(i);
    }
    return res;
  }
  getConstants(): R.Observable<any> {
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.constants);
    return this.http.get(
      this.baseurl + this.employeesUrl + CurrentUrls.constants,
      this.httpOptions
    );
  }
  //upload attendance file
  uploadAttendanceFile(data: any): R.Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: headers
    };
    return this.http
      .post(
        this.baseurl + this.employeesUrl + CurrentUrls.uploadfile,
        data,
        httpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          let obj: never;
          obj = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
// download attendance file for station
downloadattedancefileforStation(input: any, tkn: string): R.Observable<any> {
  var body = JSON.stringify(input);
  const phttpOptions = {
    responseType: "blob",
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + tkn
    })
    //   observe:"body",
    //   reportProgress:false,
    //  responseType: "blob"
  };
  // console.log(this.baseurl + this.employeesUrl + CurrentUrls.PDFFileDownload);
  // console.log(body);
  return this.http
    .post(
      this.baseurl + this.employeesUrl + CurrentUrls.downloadattendance,
      body,
      {
        responseType: "blob",
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + tkn
        })
      }
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let obj : never = this.handlehttpError(error,"DA") as never;
        return new Observable(function(x) {
          x.next(obj);
        });
      })
    );
}
  //get admin details
  getadmindetails(tkn:string): R.Observable<any> {
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.adminDetails);
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    return this.http.get(
      this.baseurl + this.employeesUrl + CurrentUrls.adminDetails,
      phttpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        let obj: never;
        obj= this.handlehttpError(error) as never;
        return new Observable(function(x) {
          x.next(obj);
        });
      })
    );
  }
  //Employee login
  loginuser(username: string, password: string) {
    let input: string = "?username=" + username + "&password=" + password;
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.login + input);
    return this.http
      .get(
        this.baseurl + this.employeesUrl + CurrentUrls.login + input,
        this.httpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj: never;
          obj= this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
    //Employee Reset password
    resetPassword(employeeId: number, password: string) {
      let input: string = "?employeeId=" + employeeId + "&password=" + password;
      console.log(
        this.baseurl + this.employeesUrl + CurrentUrls.resetPassword + input
      );
      return this.http
        .get(
          this.baseurl + this.employeesUrl + CurrentUrls.resetPassword + input,
          this.httpOptions
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            let obj: never;
            obj= this.handlehttpError(error) as never;
            return new Observable(function(x) {
              x.next(obj);
            });
          })
        );
    }
    //Employee login update session
    updateSession(userTypeId: Number, employeeId: Number) {
      let input: string =
        "?usertypeId=" + userTypeId + "&employeeId=" + employeeId;
      console.log(
        this.baseurl + this.employeesUrl + CurrentUrls.updatesession + input
      );
      return this.http
        .get(
          this.baseurl + this.employeesUrl + CurrentUrls.updatesession + input,
          this.httpOptions
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            let obj: never;
          obj= this.handlehttpError(error) as never;
            return new Observable(function(x) {
              x.next(obj);
            });
          })
        );
    }
     //get list of UnApproved PDS Employees
  getpdsunApprovedEmployees(input: any, tkn: string): R.Observable<any> {
    var body = JSON.stringify(input);
    const phttpOptions2 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,GET,POST,DELETE',
        Authorization: 'Bearer ' + tkn
      })
    };
    console.log(tkn);
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.pdsunapprovedemployees
    );
    return this.http
      .post(
        this.baseurl + this.employeesUrl + CurrentUrls.pdsunapprovedemployees,
        body,
        phttpOptions2
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          let obj: never;
          obj = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //get list of PDS Employees
  getPDSEmployees(input: any, tkn: string): R.Observable<any> {
    var body = JSON.stringify(input);
    const phttpOptions2 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,GET,POST,DELETE',
        Authorization: 'Bearer ' + tkn
      })
    };
    console.log(tkn);
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.pdsemployees);
    return this.http
      .post(
        this.baseurl + this.employeesUrl + CurrentUrls.pdsemployees,
        body,
        phttpOptions2
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          let obj: never;
          obj = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //get list of Delivery Associates
  getdeliveryassociates(input: any, tkn: string): R.Observable<any> {
    var body = JSON.stringify(input);
    const phttpOptions2 = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT,GET,POST,DELETE",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(tkn);
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.daemployeelist);
    return this.http
      .post(
        this.baseurl + this.employeesUrl + CurrentUrls.daemployeelist,
        body,
        phttpOptions2
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          let obj :never;
          obj= this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //logins list of   employees
  getemployeelogins(input: any, tkn: string): R.Observable<any> {
    var body = JSON.stringify(input);
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.employeelogins);
    return this.http
      .post(
        this.baseurl + this.employeesUrl + CurrentUrls.employeelogins,
        body,
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //registered employees
  getRegisteredEmployees(input: any, tkn: string): R.Observable<any> {
    var body = JSON.stringify(input);
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    //this.posthttpOptions.headers=headers;
    //this.httpOptions.headers.append("Authorization", "Bearer " + tkn);
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.registeremployees
    );
    return this.http
      .post(
        this.baseurl + this.employeesUrl + CurrentUrls.registeremployees,
        body,
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  private handlehttpError(err: HttpErrorResponse,url="") {
    let obj:any ;
    if (err.status === 401) {
      this.handleAuthError(err);
    } else {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.

        swal(
          "Client Side Error!!!",
          "An error occurred :" + err.error.message.toString(),
          "error"
        );
      } else {
        let apierrResult: APIResult = new APIResult();
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        let m: string = "";
        m = `Backend returned code ${err.status}`;
        //  console.log(err);
        obj = err.error;

        if(this.isBlobError(err) && url.includes("DA"))
        {
          m = m + "Something went wrong!!! Unable to download file, file either corrupted or not exists!!!"
          apierrResult.status = false;
          apierrResult.message = m;
        }
        else{
        if ("title" in obj) {
          m = obj.title;
          apierrResult.status = false;
          apierrResult.message = m;
          //obj = apierrResult;
        }
       if ("errors" in obj) {
          m = m + " Reason : " + JSON.stringify(this.printObject(obj.errors));
          apierrResult.status = false;
          apierrResult.message = m;
         // obj = apierrResult;
        }
        if ("commandType" in obj || "status" in obj || "message" in obj) {
          m = m + " Reason : " + obj.message;
          apierrResult.status = false;
          apierrResult.message = m;
          obj = apierrResult;
        } else {
          m = m + " Reason : " + JSON.stringify(obj);
          apierrResult.status = false;
          apierrResult.message = m;
         
        }
      }
        obj = apierrResult;
      }

      // ...optionally return a default fallback value so app can continue (pick one)
      // which could be a default value
      // return Observable.of<any>({my: "default value..."});
      // or simply an empty observable
      //return Observable.empty<T>();
    }
    return obj;
  }
  isBlobError(err: any) {
    return err instanceof HttpErrorResponse && err.error instanceof Blob && err.error.type === 'application/json';
  }
  printObject(obj: any) {
    const keys = Object.keys(obj);
    const values = keys.map(key => `${key}: ${Reflect.get(obj, key)}`);
    return values;
  }
  //unauthorized error display
  private handleAuthError(err: HttpErrorResponse) {
    //handle your auth error or rethrow

    //navigate /delete cookies or whatever
    console.log("handled error " + err.status);
    swal(
      "UnAuthorized Request!!!",
      "Session Expired, please refresh the page and login again!!!",
      "error"
    );
    this.router.navigate([`/login`]);
    // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
  }
  // get emloyees
  getEmployees(stationCode: string = ""): R.Observable<any> {
    let input = "?stationCode=" + stationCode;
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.employeelist + input
    );
    return this.http
      .get(
        this.baseurl + this.employeesUrl + CurrentUrls.employeelist + input,
        this.httpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //signout user
  signOut(userName: string, employeeId: number, usertypeId: number) {
    let input =
      "?userName=" +
      userName +
      "&employeeId=" +
      employeeId +
      "&userTypeId=" +
      usertypeId;
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.logout + input);
    return this.http
      .get(
        this.baseurl + this.employeesUrl + CurrentUrls.logout + input,
        this.httpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let ob:never;
          ob = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(ob);
          });
        })
      );
  }
  //approve registered        user
  approveUser(
    id: any,
    status: string,
    pId: number,
    empCode: string,
    tkn
  ): R.Observable<any> {
    let input =
      "?registerId=" +
      id +
      "&status=" +
      status +
      "&pId=" +
      pId +
      "&empCode=" +
      empCode;
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(tkn);
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.approve + input);
    return this.http
      .get(
        this.baseurl + this.employeesUrl + CurrentUrls.approve + input,
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //check user name for employee registration
  checkUserName(userName: string): R.Observable<any> {
    let input = "?userName=" + userName;
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.checkUsername + input
    );
    return this.http
      .get(
        this.baseurl + this.employeesUrl + CurrentUrls.checkUsername + input,
        this.httpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //check Employee Code for approve employee
  checkEmpCode(empCode: string): R.Observable<any> {
    let input = "?empCode=" + empCode;
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.checkempCode + input
    );
    return this.http
      .get(
        this.baseurl + this.employeesUrl + CurrentUrls.checkempCode + input,
        this.httpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //check CDA Code for cda enroll
  checkCDACode(cdaCode: string): R.Observable<any> {
    let input = "?cdaCode=" + cdaCode;
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.checkcdaCode + input
    );
    return this.http
      .get(
        this.baseurl + this.employeesUrl + CurrentUrls.checkcdaCode + input,
        this.httpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //register employee POST

  registeremployee(input): R.Observable<any> {
    console.log(JSON.stringify(input));
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.registeremployee
    );
    console.log(JSON.stringify(input));
    return this.http
      .post<any>(
        this.baseurl + this.employeesUrl + CurrentUrls.registeremployee,
        JSON.stringify(input),
        this.posthttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }

  //Create employee POST

  createemployee(input, tkn): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.createemployee);
    return this.http
      .post<any>(
        this.baseurl + this.employeesUrl + CurrentUrls.createemployee,
        JSON.stringify(input),
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }

  //create DA employee POST

  createDAemployee(input, tkn): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.createDAemployee
    );
    return this.http
      .post<any>(
        this.baseurl + this.employeesUrl + CurrentUrls.createDAemployee,
        JSON.stringify(input),
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //Get CDA delivery deatils by station GET

  getCDADeliverybyStation(stationId, tkn): R.Observable<any> {
    let input = "?stationId=" + stationId;
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(
      this.baseurl +
        this.employeesUrl +
        CurrentUrls.getCDADeliveryStation +
        input
    );
    return this.http
      .get<any>(
        this.baseurl +
          this.employeesUrl +
          CurrentUrls.getCDADeliveryStation +
          input,
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
    //create PDS employee POST

    createPDSemployee(input, tkn): R.Observable<any> {
      const phttpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + tkn
        })
      };
      console.log(
        this.baseurl + this.employeesUrl + CurrentUrls.createPDSemployee
      );
      return this.http
        .post<any>(
          this.baseurl + this.employeesUrl + CurrentUrls.createPDSemployee,
          JSON.stringify(input),
          phttpOptions
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            let obj: never = this.handlehttpError(error) as never;
            console.log(obj);
            return new Observable(function(x) {
              x.next(obj);
            });
          })
        );
    }
  //Get CDA employee list POST

  getCDADeliverylist(input, tkn): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.getCDADeliverylist
    );
    return this.http
      .post<any>(
        this.baseurl + this.employeesUrl + CurrentUrls.getCDADeliverylist,
        JSON.stringify(input),
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //Update CDA employee list POST

  updateCDADeliverylist(input, tkn): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(
      this.baseurl + this.employeesUrl + CurrentUrls.updateCDADeliverylist
    );
    console.log(JSON.stringify(input));
    return this.http
      .post<any>(
        this.baseurl + this.employeesUrl + CurrentUrls.updateCDADeliverylist,
        JSON.stringify(input),
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //  create Constants for station by admin
  createconstant(input, tkn): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(tkn);
    console.log(JSON.stringify(input));
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.createconstant);
    return this.http
      .post<any>(
        this.baseurl + this.employeesUrl + CurrentUrls.createconstant,
        JSON.stringify(input),
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //PDF Files download for CDA
  downloadpdffilesforemployees(input: any, tkn: string): R.Observable<any> {
    var body = JSON.stringify(input);
    const phttpOptions = {
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
      //   observe:"body",
      //   reportProgress:false,
      //  responseType: "blob"
    };
    // console.log(this.baseurl + this.employeesUrl + CurrentUrls.PDFFileDownload);
    // console.log(body);
    return this.http
      .post(
        this.baseurl + this.employeesUrl + CurrentUrls.PDFFileDownload,
        body,
        {
          responseType: "blob",
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + tkn
          })
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }

   //PDF Files download for Ledger details
   downloadpdffilesforledgerDetailsbyStation(input: any, tkn: string): R.Observable<any> {
    var body = JSON.stringify(input);
    const phttpOptions = {
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
      //   observe:"body",
      //   reportProgress:false,
      //  responseType: "blob"
    };
    // console.log(this.baseurl + this.employeesUrl + CurrentUrls.PDFFileDownload);
    // console.log(body);
    return this.http
      .post(
        this.baseurl + this.financeUrl + CurrentUrls.downloadLedger,
        body,
        {
          responseType: "blob",
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + tkn
          })
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }
  //DB Backups
  getBackups(tkn: string): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.backuplist);
    return this.http.get(
      this.baseurl + this.employeesUrl + CurrentUrls.backuplist,
      phttpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        let obj : never = this.handlehttpError(error) as never;
        console.log(obj);
        return new Observable(function(x) {
          x.next(obj);
        });
      })
    );
  }
  //DB Backup restore
  restore(filename: string, tkn: string): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    let input = "?file=" + filename;
    console.log(this.baseurl + this.employeesUrl + CurrentUrls.restore);
    return this.http.get(
      this.baseurl + this.employeesUrl + CurrentUrls.restore + input,
      phttpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        let obj : never = this.handlehttpError(error) as never;
        console.log(obj);
        return new Observable(function(x) {
          x.next(obj);
        });
      })
    );
  }

  //Voucher Create for station

 createVoucher(input,tkn): R.Observable<any> {
  console.log(JSON.stringify(input));
  const phttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + tkn
    })
  };
  console.log(this.baseurl + this.financeUrl + CurrentUrls.voucherCreate);
  return this.http
    .post<any>(
      this.baseurl + this.financeUrl + CurrentUrls.voucherCreate,
      JSON.stringify(input),
      phttpOptions
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let obj : never = this.handlehttpError(error) as never;
        console.log(obj);
        return new Observable(function(x) {
          x.next(obj);
        });
      })
    );
  
}
// get voucher details
getvoucherdetails(voucherId,tkn): R.Observable<any> {
  const phttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + tkn
    })
  };
  let input = "?voucherId=" + voucherId;
  console.log(this.baseurl + this.financeUrl + CurrentUrls.voucherDetails+ input);
  return this.http.get(
    this.baseurl + this.financeUrl + CurrentUrls.voucherDetails + input,
    phttpOptions
  ).pipe(
    catchError((error: HttpErrorResponse) => {
      let obj : never = this.handlehttpError(error) as never;
      console.log(obj);
      return new Observable(function(x) {
        x.next(obj);
      });
    })
  );
}
//Voucher Update for station

updateVoucher(input,tkn): R.Observable<any> {
  console.log(JSON.stringify(input));
  const phttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + tkn
    })
  };
  console.log(this.baseurl + this.financeUrl + CurrentUrls.voucherUpdate);
  return this.http
    .post<any>(
      this.baseurl + this.financeUrl + CurrentUrls.voucherUpdate,
      JSON.stringify(input),
      phttpOptions
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let obj : never = this.handlehttpError(error) as never;
        console.log(obj);
        return new Observable(function(x) {
          x.next(obj);
        });
      })
    );
  
}
//previous month credit details balance
previousmonthCreditDetails(stationId:number,tkn):R.Observable<any>{
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    let input = "?stationId=" + stationId;
    console.log(this.baseurl + this.financeUrl + CurrentUrls.previousmonthCredit+ input);
    return this.http.get(
      this.baseurl + this.financeUrl + CurrentUrls.previousmonthCredit + input,
      phttpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        let obj : never = this.handlehttpError(error) as never;
        console.log(obj);
        return new Observable(function(x) {
          x.next(obj);
        });
      })
    );
}
  //Insert credit details for station

  insertCredit(input,tkn): R.Observable<any> {
    console.log(JSON.stringify(input));
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(this.baseurl + this.financeUrl + CurrentUrls.creditInsert);
    return this.http
      .post<any>(
        this.baseurl + this.financeUrl + CurrentUrls.creditInsert,
        JSON.stringify(input),
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
    
  }
  //get ledgers
    getLedgersformonth(input: any, tkn: string): R.Observable<any> {
      var body = JSON.stringify(input);
      const phttpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + tkn
        })
      };
      //this.posthttpOptions.headers=headers;
      //this.httpOptions.headers.append("Authorization", "Bearer " + tkn);
      console.log(
        this.baseurl + this.financeUrl + CurrentUrls.legders
      );
      return this.http
        .post(
          this.baseurl + this.financeUrl + CurrentUrls.legders,
          body,
          phttpOptions
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            let obj : never = this.handlehttpError(error) as never;
            return new Observable(function(x) {
              x.next(obj);
            });
          })
        );
    }
      //get ledgers
      getVouchers(input: any, tkn: string): R.Observable<any> {
        var body = JSON.stringify(input);
        const phttpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + tkn
          })
        };
        //this.posthttpOptions.headers=headers;
        //this.httpOptions.headers.append("Authorization", "Bearer " + tkn);
        console.log(
          this.baseurl + this.financeUrl + CurrentUrls.vouchers
        );
        return this.http
          .post(
            this.baseurl + this.financeUrl + CurrentUrls.vouchers,
            body,
            phttpOptions
          )
          .pipe(
            catchError((error: HttpErrorResponse) => {
              let obj : never = this.handlehttpError(error) as never;
              return new Observable(function(x) {
                x.next(obj);
              });
            })
          );
      }

       //Update Voucher with approve request POST

  approvevouchers(input, tkn): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(
      this.baseurl + this.financeUrl + CurrentUrls.approveVouchers
    );
    console.log(JSON.stringify(input));
    return this.http
      .post<any>(
        this.baseurl + this.financeUrl + CurrentUrls.approveVouchers,
        JSON.stringify(input),
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }

    //Update Voucher with reject request POST

   rejectVouchers(input, tkn): R.Observable<any> {
    const phttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + tkn
      })
    };
    console.log(
      this.baseurl + this.financeUrl + CurrentUrls.rejectvouchers
    );
    console.log(JSON.stringify(input));
    return this.http
      .post<any>(
        this.baseurl + this.financeUrl + CurrentUrls.rejectvouchers,
        JSON.stringify(input),
        phttpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let obj : never = this.handlehttpError(error) as never;
          console.log(obj);
          return new Observable(function(x) {
            x.next(obj);
          });
        })
      );
  }

}

