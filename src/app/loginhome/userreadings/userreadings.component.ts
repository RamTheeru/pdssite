import { Component, OnInit,OnDestroy } from "@angular/core";
import { PdsApiService } from "../../pds-api.service";
import { SweetService } from "../../sweet.service";
import { ViewService } from "../../view.service";
import { APIResult } from "../../models/apiresult";
import { RequestDetail } from "../../models/requestdetail";
import { Environment } from "../../environment";
import { Subscription } from "rxjs";
@Component({
  selector: "app-userreadings",
  templateUrl: "./userreadings.component.html",
  styleUrls: ["./userreadings.component.css"]
})
export class UserreadingsComponent implements OnInit,OnDestroy {
  blck1Text: string = "";
  blck2Text: string = "";
  blck3Text: string = "";
  tkn: string = "";
  private subsc: Subscription;
  registeredUsersCount: number = 0;
  detailrequests: RequestDetail[];
  constructor(private api: PdsApiService, private _swServ: SweetService,private vServ:ViewService) {}

  ngOnInit() {
    this.subsc = this.vServ.utoken.subscribe((val: string) => {
      this.tkn = val;
    });
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.tkn = this.vServ.getToken();
    }
    this.blck1Text = Environment.Block1Text;
    this.blck2Text = Environment.Block2Text;
    this.blck3Text = Environment.Block3Text;
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.handleUnauthorizedrequest();
    }
    else{
    this.api.getadmindetails(this.tkn).subscribe(
      (data: APIResult) => {
        //console.log(data);
        let status: Boolean = data.status;
        let m: string = data.message;
        if (status) {
          this.detailrequests = data.requests;
          for (var index in this.detailrequests) {
            this.registeredUsersCount = this.detailrequests[index].count; // prints indexes: 0, 1, 2, 3
          }
        } else {
          this._swServ.showErrorMessage("Error!!", m);
        }
      },
      err => {
        //console.log(err.message);
        this._swServ.showErrorMessage("Network Error!!!", err.message);
      }
    );
    }
  }
  ngOnDestroy(){
this.subsc.unsubscribe();
  }
  handleUnauthorizedrequest() {
    this._swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
}
