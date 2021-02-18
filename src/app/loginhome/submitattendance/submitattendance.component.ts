import { Component, OnInit, OnDestroy } from "@angular/core";
import { ViewService } from "../../view.service";
import * as r from "rxjs";
@Component({
  selector: "app-submitattendance",
  templateUrl: "./submitattendance.component.html",
  styleUrls: ["./submitattendance.component.css"]
})
export class SubmitattendanceComponent implements OnInit, OnDestroy {
  userType: string;
  private subsc: r.Subscription;
  isLe: Boolean = false;
  isHe: Boolean = false;
  isUpload: Boolean = false;
  filename: string = "nov-2020.xlx"; // private subsc2: r.Subscription;
  // hruaheVerify: string = ""
  constructor(private vServ: ViewService) {}

  ngOnInit() {
    this.subsc = this.vServ.data.subscribe((val: string) => {
      this.userType = val;
    });

    // this.subsc2 = this.vServ.verify3.subscribe((val: string) => {
    //   this.hruaheVerify = val;
    // });
    var index = this.userType.indexOf("le");
    if (index !== -1) {
      this.isLe = true;
    } else {
      this.isHe = true;
      // if (this.hruaheVerify == "hruahe") {
      //   this.isUpload = true;
      // } else {
      //   this.isUpload = false;
      // }
    }
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    //this.subsc2.unsubscribe();
  }
}
