import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PdsApiService } from "./pds-api.service";
import { UserType } from "./models/usertype";
import { APIResult } from "./models/apiresult";
import { SweetService } from "./sweet.service";
import { ViewService } from "./view.service";

@Injectable()
export class AuthService {
  token: string = "";
  user: UserType;
  result: APIResult;
  constructor(
    private router: Router,
    private api: PdsApiService,
    private swServ: SweetService,
    private vServ: ViewService
  ) {}
  ///
  // signInuser(username: string, password: string): Promise<APIResult> {
  //   this.api.loginuser(username, password).subscribe(
  //     (data: APIResult) => {
  //       this.result = data;
  //       let status: Boolean = data.status;
  //       let m: string = data.message;
  //       this.user     = data.userInfo;
  //    ///   if (status) {
  //         //this.user = data.userInfo;
  //         this.token = this.user.token;
  //       } else {
  //         this.token = "";
  //         this.swServ.showErrorMessage("Error!!!", m);
  //       }
  //     },
  //     // (data: APIResult) => {
  //     //   console.log(data);
  //     //   let status: Boolean = data.status;
  //     //   let m: string = data.message;
  //     //   if (status) {
  //     //     this.user = data.userInfo;
  //     //     this.token = this.user.token;
  //     //     console.log(this.user);
  //     //   } else {
  //     //     this.token = "";
  //     //     this.swServ.showErrorMessage("Error!!!", m);
  //     //   }
  //     //return this.user;
  //     // this.router.navigate(["/loginhome"]);
  //     //this.token = token;
  //     // this.swServ.showSuccessMessage("Sucess!!", "we didit");
  //     // this.swServ.showMessage("SomethingWent", "wrong");
  //     // this.swServ.showWarning("Delete it");
  //     // },
  //     err => {
  //       this.token = "";
  //       //console.log(err.message);
  //       this.swServ.showErrorMessage("Network Error!!!", err.message);
  //     }
  //   );
  //   return new Promise(() => {
  //     return this.result;
  //   });
  setToken(tkn: string) {
    this.vServ.setToken(tkn);
    this.token = tkn;
  }
  getToken() {
    this.token = this.vServ.getToken();
    return this.token;
  }
  isAuth() {
    this.token = this.vServ.getToken();
    return this.token != "" && this.token != null;
  }
  logout() {
    // firebase.auth().signOut()    ;
    // this.token = null;
  }
}
