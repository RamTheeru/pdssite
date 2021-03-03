import { Component, VERSION, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PdsApiService } from "./pds-api.service";
import { AuthService } from "./auth.service";
import { SweetService } from "./sweet.service";
import { ViewService } from "./view.service";
import { UserType } from "./models/usertype";
import { APIResult } from "./models/apiresult";
import { Subscription } from "rxjs";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from "@angular/router";
import { Environment } from "./environment";
import swal from "sweetalert2";
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  url = "";
  sess: number = 0;
  userInfo: UserType;
  footerText: string = "";
  isLogin: Boolean = false;
  tabView: Boolean = true;
  name = "Angular " + VERSION.major;
  text = "Welcome to PENNA DELIVERY SERVICES!!!!!!";
  // Sets initial value to true to show loading spinner on first load
  load = true;
  users: any;
  private subsc: Subscription;
  //subsc : r.Subscription;
  constructor(
    private router: Router,
    private api: PdsApiService,
    private auth: AuthService,
    private swServ: SweetService,
    private vServ: ViewService,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    });
  }
  ngOnInit() {
    this.url = this.route["_routerState"].snapshot.url;
    this.footerText = Environment.FooterText;

    // this.api.getConstants().subscribe(
    //   data => {
    //     console.log(data);
    //     // this.swServ.showSuccessMessage("Sucess!!", "we didit");
    //     // this.swServ.showMessage("SomethingWent", "wrong");
    //     // this.swServ.showWarning("Delete it");
    //   },
    //   err => {
    //     //console.log(err.message);
    //     this.swServ.showErrorMessage(err.message);
    //   },
    //   () => {
    //     console.log("completed");
    //   }
    // );
  }

  // // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    //this.load = true;

    if (event instanceof NavigationStart) {
      this.load = true;
    }
    if (event instanceof NavigationEnd) {
        //console.log(event);
        this.url = event.urlAfterRedirects;
        var index = this.url.indexOf("loginhome");
        var reset = this.url.indexOf("ResetPassword");
        var updatesession = setInterval(() => {
          this.updateSession();
        }, 1200000);
        if (index !== -1) {
          this.sess = 1;
          var ind = this.url.indexOf("loginhome");
          if (ind !== -1) {
            this.subsc = this.vServ.userInfo.subscribe((res: UserType) => {
              this.userInfo = res;
            });
            if (this.userInfo == null || this.userInfo == undefined) {
              var u = this.vServ.getValue("userProp");
              this.userInfo = JSON.parse(u);
            }
          }
        } else {
            this.sess = 0;
          clearInterval(updatesession);
        }
        if (this.url == "/404") {
          this.tabView = false;
          this.isLogin = false;
        } else if (this.url == "/register" || reset != -1) {
          this.tabView = false;
          this.isLogin = false;
        } else if (index !== -1) {
          this.isLogin = true;
          this.tabView = false;
        } else {
          this.tabView = true;
          this.isLogin = false;
          // clearInterval(updatesession);
        }
        // if (this.url == "/login") {
        //  // this.sess = 0;
        //   //clearInterval(updatesession);
        // }
        setTimeout(() => {
          // here
          this.load = false;
        }, 2000);
    }
    //testing
    //

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      setTimeout(() => {
        // here
        this.load = false;
      }, 2000);
    }
    if (event instanceof NavigationError) {
      setTimeout(() => {
        // here
        this.load = false;
      }, 2000);
    }
    //  setTimeout( () => {
    //   this.load = false;

    //  },7000)
    //   setTimeout( () => { /*Your Code*/
    //   if (event instanceof NavigationStart) {
    //     this.loading = true
    //   }
    //   if (event instanceof NavigationEnd) {
    //     this.loading = false
    //   }

    //   // Set loading state to false in both of the below events to hide the spinner in case a request fails
    //   if (event instanceof NavigationCancel) {
    //     this.loading = false
    //   }
    //   if (event instanceof NavigationError) {
    //     this.loading = false
    //   }
    //   }, 7000 );
  }
  showload(): void {
    this.load = true;
  }
  hideload(): void {
    this.load = false;
  }
  updateSession() {
    if (
      this.userInfo != null &&
      this.userInfo != undefined &&
      this.userInfo.employeeId != 0 &&
      this.userInfo.userTypeId > 0 &&
      this.sess === 1
    ) {
      swal({
        title: "Are you sure?",
        text: "Do you want to continue the session?",
        type: "warning",
        showConfirmButton: true,
        showCancelButton: true
      }).then(willDelete => {
        if (willDelete.value) {
          this.api
            .updateSession(this.userInfo.userTypeId, this.userInfo.employeeId)
            .subscribe(
              (data: APIResult) => {
                let status: Boolean = data.status;
                let m: string = data.message;
                if (status) {
                  let tkn = data.userInfo.token;
                  this.vServ.setValue(data.userInfo.user);
                  this.vServ.setUser(data.userInfo);
                  this.auth.setToken(tkn);
                  this.vServ.setToken(tkn);
                  this.swServ.showSuccessMessage("Success!!", m);
                } else {
                  this.swServ.showErrorMessage("Failed!!", m);
                  this.vServ.removeValue("usrtoken");
                  this.vServ.removeValue("userProp");
                  this.vServ.removeValue("storedProp");
                  this.vServ.removeValue("fheverify");
                  this.vServ.removeValue("edleverify");
                  this.vServ.removeValue("evheverify");
                  this.vServ.removeValue("hrvheverify");
                  this.auth.setToken("");
                  this.router.navigate(["/login"]);
                }
                // console.log(data);
                // this.swServ.showSuccessMessage("Sucess!!", "we didit");
                // this.swServ.showMessage("SomethingWent", "wrong");
                // this.swServ.showWarning("Delete it");
              },
              err => {
                //console.log(err.message);
                this.swServ.showErrorMessage("Network Error!!", err.message);
              },
              () => {
                console.log("completed");
              }
            );
          // this.openApproveForm(e.RegisterId, Number(this.selectedStation));
          // this.api.approveUser(e.RegisterId, status);
        } else {
          this.swServ.showErrorMessage(
            "Canelled",
            "Please dont forget to signout or you will be signout automatically."
          );
        }
      });
    } else {
      this.swServ.showErrorMessage(
        "Something went wrong!!",
        "Unable to get details to continue session, Please Sign-in again."
      );
    }
  }
  ngOnDestroy() {
    //
    this.subsc.unsubscribe();
  }
}
