import { Component, VERSION, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PdsApiService } from "./pds-api.service";
import { AuthService } from "./auth.service";
import { SweetService } from "./sweet.service";
import { ViewService } from "./view.service";
import { UserType } from "./models/usertype";
import { APIResult } from "./models/apiresult";
import { fromEvent,Observable,Subscription } from "rxjs";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from "@angular/router";
import { Environment } from "./environment";

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
  public onlineEvent: Observable<Event>;
  public offlineEvent: Observable<Event>;
  public connectionStatusMessage: string;
  public connectionStatus: boolean;
  internetCheck:any;
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
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.internetCheck = setInterval(() => {
      this.checkinternet();
    }, 10000);
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
 checkinternet(){
  this.onlineEvent.subscribe(event => {
    this.connectionStatusMessage = 'Connected to internet! You are online';
    if(!this.connectionStatus)
    {
      this.swServ.showSuccessMessage('Success!!!',this.connectionStatusMessage);
    }
    this.connectionStatus = true;
});
  this.offlineEvent.subscribe(e => {
    this.connectionStatusMessage = 'Connection lost! You are offline';
    this.connectionStatus = false;
    this.swServ.showErrorMessage('OOPS!!!',this.connectionStatusMessage);
});
 }
  ngOnDestroy() {
    //
    this.subsc.unsubscribe();
  }
}
