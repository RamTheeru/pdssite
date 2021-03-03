import { Component, OnInit ,OnDestroy} from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { Environment } from "../environment";
import { UserType } from "../models/usertype";
import { PdsApiService } from "../pds-api.service";
import { AuthService } from "../auth.service";
import { ViewService } from "../view.service";
import { SweetService } from "../sweet.service";
import { APIResult } from "../models/apiresult";
import * as r from "rxjs";
@Component({
  selector: "app-pds-main",
  templateUrl: "./pds-main.component.html",
  styleUrls: ["./pds-main.component.css"]
})
export class PdsMainComponent implements OnInit,OnDestroy {
  img: string;
  private subsc: r.Subscription;
  load: boolean = false;
  userName: string;
  password: string;
  user: UserType;
  url:string;
  view: Boolean = true;
  userInfo: UserType;
  constructor(
    private router: Router,
    private vServ: ViewService,
    private sweet: SweetService,
    private api: PdsApiService,
    private autServ: AuthService,
    private route: ActivatedRoute
  ) {}
ngOnDestroy(){
  this.subsc.unsubscribe();
}
  ngOnInit() {
    this.url = this.route["_routerState"].snapshot.url;

    var force = this.url.indexOf("force");
    this.subsc = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue("userProp");
      this.userInfo = JSON.parse(u);
    }
    if(this.userInfo != null && this.userInfo != undefined )
    {
    if (
      this.userInfo.employeeId > 0 &&
      this.userInfo.userTypeId > 0 &&
      this.userInfo.user != "" && force == -1
    ) {
      this.api
      .signOut(
        this.userInfo.user,
        this.userInfo.employeeId,
        this.userInfo.userTypeId
      )
      .subscribe(
        (data: APIResult) => {
          let status: Boolean = data.status;
          let m: string = data.message;
          if (status) {
            this.sweet.showSuccessMessage("Success!!", m);
            this.vServ.removeValue("usrtoken");
            this.vServ.userInfo.next(new UserType());
            this.vServ.removeValue("userProp");
            this.vServ.removeValue("storedProp");
            this.vServ.removeValue("fheverify");
            this.vServ.removeValue("edleverify");
            this.vServ.removeValue("evheverify");
            this.vServ.removeValue("hrvheverify");
            this.autServ.setToken("");
           // this.router.navigate(["/login"]);
          } else {
            this.sweet.showErrorMessage("Error!!", m);
          }
        },
        err => {
          this.sweet.showErrorMessage("Network Error!!!", err.message);
        }
      );
    }
  }
    //
    this.vServ.removeValue("usrtoken");
    this.vServ.removeValue("userProp");
    this.vServ.removeValue("storedProp");
    this.vServ.removeValue("fheverify");
    this.vServ.removeValue("edleverify");
    this.vServ.removeValue("evheverify");
    this.vServ.removeValue("hrvheverify");
    this.autServ.setToken("");
    this.img = Environment.MainLogo;
  }
  onLogin() {
    this.load = true;
    this.api.loginuser(this.userName, this.password).subscribe(
      (data: APIResult) => {
        this.load = false;
        let status: Boolean = data.status;
        let m: string = data.message;
        this.user = data.userInfo;
        var index = m.indexOf("already");
        let userInfo = this.user.screen;
        let tkn: string = this.user.token;
        if (status) {
          if (index !== -1 && this.user != null && this.user != undefined) {
            this.autServ.setToken(tkn);
            let userTypeId = this.user.userTypeId;
            if (userTypeId == 1) {
              userInfo = "admin";
            }
            // if (userTypeId == 1) {
            //   userInfo = "admin";
            // } else if (userTypeId == 2) {
            //   userInfo = "financele";
            // } else if (userTypeId == 3) {
            //   userInfo = "financehe";
            // } else if (userTypeId == 4) {
            //   userInfo = "executivele";
            // } else if (userTypeId == 5) {
            //   userInfo = "executivehe";
            // } else if (userTypeId == 6) {
            //   userInfo = "hrle";
            // } else if (userTypeId == 7) {
            //   userInfo = "hrhe";
            // }
            //sf  tysd
            this.vServ.setToken(tkn);
            this.vServ.setValue(userInfo);
            this.vServ.setUser(this.user);
            this.sweet.showErrorMessage("Warning!!", m);
            this.router.navigate(["/loginhome"]);
          } else {
            if (this.user != null && this.user != undefined) {
              if (this.user.token != "" && this.user.userTypeId > 0) {
                if (tkn != null && tkn != "") {
                  this.autServ.setToken(tkn);
                  this.vServ.setToken(tkn);
                  let userTypeId = this.user.userTypeId;
                  if (userTypeId == 1) {
                    userInfo = "admin";
                  }
                  // else if (userTypeId == 2) {
                  //   userInfo = "financele";
                  // } else if (userTypeId == 3) {
                  //   userInfo = "financehe";
                  // } else if (userTypeId == 4) {
                  //   userInfo = "executivele";
                  // } else if (userTypeId == 5) {
                  //   userInfo = "executivehe";
                  // } else if (userTypeId == 6) {
                  //   userInfo = "hrle";
                  // } else if (userTypeId == 7) {
                  //   userInfo = "hrhe";
                  // }
                  this.vServ.setValue(userInfo);
                  this.vServ.setUser(this.user);
                  this.router.navigate(["/loginhome"]);
                } else {
                  this.sweet.showErrorMessage(
                    "Error!!",
                    "Login failed, Please try again."
                  );
                }
              } else {
                this.sweet.showErrorMessage(
                  "Error!!",
                  "Something went wrong!!, Please try again."
                );
              }
            } else {
              this.sweet.showErrorMessage("Failed!!", "Ivalid Login");
            }
          }
        } else {
          this.sweet.showErrorMessage("Error!!", m);
        }
      },
      err => {
        //console.log(err);
        this.sweet.showErrorMessage("Network Error!!!", err.message);
      }
    );

    // if (this.user == "financele" && this.password == "1234") {
    //   this.vServ.setValue(this.user);
    //   this.router.navigate(["/loginhome"]);
    // } else if (this.user == "financehe" && this.password == "1234") {
    //   this.vServ.setValue(this.user);
    //   this.router.navigate(["/loginhome"]);
    // } else if (this.user == "executivele" && this.password == "1234") {
    //   this.vServ.setValue(this.user);
    //   this.router.navigate(["/loginhome"]);
    // } else if (this.user == "executivehe" && this.password == "1234") {
    //   this.vServ.setValue(this.user);
    //   this.router.navigate(["/loginhome"]);
    // } else if (this.user == "hrle" && this.password == "1234") {
    //   this.vServ.setValue(this.user);
    //   this.router.navigate(["/loginhome"]);
    // } else if (this.user == "hrhe" && this.password == "1234") {
    //   this.vServ.setValue(this.user);
    //   this.router.navigate(["/loginhome"]);
    // } else {
    //   this.sweet.showErrorMessage("Fail!!", "Ivalid Login");
    // }
  }

  // onRegister() {
  //   this.view = false;
  //     this.vServ.updateView(this.view);
  // }
}
