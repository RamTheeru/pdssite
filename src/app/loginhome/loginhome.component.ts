import { Component, Input, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { MatSidenav } from "@angular/material";
import * as r from "rxjs";
import { ViewledgerComponent } from "./viewledger/viewledger.component";
import { ViewService } from "../view.service";
import { PdsApiService } from "../pds-api.service";
import { SweetService } from "../sweet.service";
import { UserType } from "../models/usertype";
import { AuthService } from "../auth.service";
import { APIResult } from "../models/apiresult";
// const navigationExtras: NavigationExtras = {
//   state: {
//     transd: 'TRANS001',
//     workQueue: false,
//     services: 10,
//     code: '003'
//   }
// };
@Component({
  selector: "app-loginhome",
  templateUrl: "./loginhome.component.html",
  styleUrls: ["./loginhome.component.css"]
})
export class LoginhomeComponent implements OnInit, OnDestroy {
  @Input("") user: string;
  private subsc: r.Subscription;
  private subsc2: r.Subscription;
  userInfo: UserType;
  loginInfo: string = "";
  loginUsername: string = "";
  userType: number = 0;
  isFle: Boolean = false;
  shoesidenav: Boolean = false;
  shownotify: Boolean = false;
  actTab: Boolean = false;
  @ViewChild("sidenav") sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  act1SubMenu: boolean = false;
  act2SubMenu: boolean = false;
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  //should   Run = [/(^|\.)plnkr\.co$/,    /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  //
  constructor(
    private vServ: ViewService,
    private auth: AuthService,
    private router: Router,
    private api: PdsApiService,
    private swServ: SweetService
  ) {}

  ngOnInit() {
    this.subsc = this.vServ.data.subscribe((val: string) => {
      this.user = val;
    });
    this.subsc2 = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    if (this.user == "" || this.user == null || this.user == undefined) {
      this.user = this.vServ.getValue("storedProp");
    }
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue("userProp");
      this.userInfo = JSON.parse(u);
    }
    console.log(this.user);
    this.loginUsername = this.userInfo.user;
    this.userType = this.userInfo.userTypeId;
    //this.user =    "   fle"
    if (this.userType === 1) {
      // this.userType = 1;
      this.shownotify = false;
      this.loginInfo = "Admin Login";
    } else if (this.userType === 4) {
      //  this.userType = 2;
      this.shownotify = false;
      this.loginInfo = "Finance LE Login";
    } else if (this.userType === 5) {
      //  this.userType = 3;
      this.shownotify = false;
      this.loginInfo = "Finance HE Login";
    } else if (this.userType === 6) {
      // this.userType = 4;
      this.shownotify = false;
      this.loginInfo = "Executive LE Login";
    } else if (this.userType === 7) {
      // this.userType = 5;
      this.shownotify = false;
      this.loginInfo = "Executive HE Login";
    } else if (this.userType === 2) {
      //  this.userType = 6;
      this.shownotify = false;
      this.loginInfo = "HR LE Login";
    } else if (this.userType === 3) {
      // this.userType = 7;
      this.shownotify = false;
      this.loginInfo = "HR HE Login";
    } else {
      //
      this.shownotify = false;
    }
  }
  Onbtnclick() {
    this.shoesidenav = !this.shoesidenav;
  }
  oncreateclk(tab = "") {
    //fdhfgjf  routerLink="/loginhome/downloadinvoice"
    this.shownotify = false;
    if (tab == "si") {
      this.act1SubMenu = true;
      this.act2SubMenu = false;
    } else if (tab == "sl") {
      this.act1SubMenu = false;
      this.act2SubMenu = true;
    } else if (tab == "edle") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("hrvheverify");
      this.vServ.setVerify("edle");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/downloadinvoice"]);
    } else {
      this.act1SubMenu = false;
      this.act2SubMenu = false;
    }
    this.shownotify = false;
  }
  onloghomeclk(tab = "") {
    if (tab == "fh") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      // this.router.navigate["/loginhome"];
    } else if (tab == "ah") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.router.navigate(["/loginhome"]);
    } else if (tab == "a") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.router.navigate(["/loginhome/registeremployees"]);
    } else if (tab == "ar") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.router.navigate(["/loginhome/approvals"]);
    } else if (tab == "lg") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.router.navigate(["/loginhome/employeelogins"]);
    } else if (tab == "fhe") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.vServ.setVerify("fhe");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/verifyvouchers"]);
    } else if (tab == "fihe") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/viewledger"]);
    } else if (tab == "fle") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("hrvheverify");
    } else if (tab == "ele") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("hrvheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("fheverify");
      this.router.navigate(["/loginhome/viewdas"]);
    } else if (tab == "ehe") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("hrvheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("fheverify");
    } else if (tab == "eele") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("hrvheverify");
      this.router.navigate(["/loginhome/createemployee"]);
    } else if (tab == "edle") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("hrvheverify");
      this.vServ.setVerify("edle");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/enrolldeliveryassociate"]);
    } else if (tab == "evhe") {
      // this.shownotify = false;
      // this.act1SubMenu = false;
      // this.act2SubMenu = false;
      // this.vServ.removeValue("edleverify");
      // this.vServ.removeValue("fheverify");
      // this.vServ.setVerify("evhe");
      // this.router.onSameUrlNavigation = "reload";
      // this.router.navigate(["/loginhome/employees"]);
    } else if (tab == "eehe") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/viewdas"]);
    } else if (tab == "hrle") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/createemployee"]);
    } else if (tab == "hrhe") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("hrvheverify");
      this.vServ.removeValue("fheverify");
      //this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.setVerify("evhe");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/confirmemployment"]);
    } else if (tab == "hruahe") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      //this.vServ.setVerify("hruahe");
      //this.router.onSameUrlNavigation = "reload";
      //this.router.navigate(["/loginhome/employees"]);
    } else if (tab == "hrvhe") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.setVerify("hrvhe");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/viewemployees"]);
    } else if (tab == "hrgshe") {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate(["/loginhome/generatesalaryslips"]);
    } else {
      this.shownotify = false;
      this.act1SubMenu = false;
      this.act2SubMenu = false;
      this.vServ.removeValue("fheverify");
      this.vServ.removeValue("evheverify");
      this.vServ.removeValue("edleverify");
      this.vServ.removeValue("hrvheverify");
    }
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
  }
  onLogout() {
    this.subsc2 = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue("userProp");
      this.userInfo = JSON.parse(u);
    }
    if (
      this.userInfo.employeeId > 0 &&
      this.userInfo.userTypeId > 0 &&
      this.userInfo.user != ""
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
              this.swServ.showSuccessMessage("Success!!", m);
              this.vServ.removeValue("usrtoken");
              this.vServ.removeValue("userProp");
              this.vServ.removeValue("storedProp");
              this.vServ.removeValue("fheverify");
              this.vServ.removeValue("edleverify");
              this.vServ.removeValue("evheverify");
              this.vServ.removeValue("hrvheverify");
              this.auth.setToken("");
              this.router.navigate(["/login"]);
            } else {
              this.swServ.showErrorMessage("Error!!", m);
            }
          },
          err => {
            this.swServ.showErrorMessage("Network Error!!!", err.message);
          }
        );
    } else {
      this.swServ.showErrorMessage(
        "Error!!",
        "Unable to logout,Something Went Wrong!!!"
      );
    }
    //bkgk jhk   ugk
    this.router.navigate(["/login"]);
  }
}
