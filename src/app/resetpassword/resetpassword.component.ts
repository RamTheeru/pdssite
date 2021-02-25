import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PdsApiService } from "../pds-api.service";
import { SweetService } from "../sweet.service";
import { APIResult } from "../models/apiresult";
@Component({
  selector: "app-resetpassword",
  templateUrl: "./resetpassword.component.html",
  styleUrls: ["./resetpassword.component.css"]
})
export class ResetpasswordComponent implements OnInit {
  regId: number = 0;
  show: boolean = false;
  load: boolean = false;
  password: string = "";
  cpassword: string = "";
  constructor(
    private route: ActivatedRoute,
    private api: PdsApiService,
    private sweet: SweetService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.regId = Number(params.get("rid"));
      if (
        this.regId > 0 &&
        this.regId !== null &&
        this.regId !== undefined &&
        this.regId !== NaN
      ) {
        this.show = true;
      } else {
        this.show = false;
        this.sweet.showErrorMessage(
          "Failure!!",
          "Something Went Wrong, Please contact support team."
        );
      }
    });
  }
  onCon() {
    if (
      this.password !== "" &&
      this.password !== null &&
      this.password !== undefined &&
      this.cpassword !== "" &&
      this.cpassword !== null &&
      this.cpassword !== undefined
    ) {
      if (this.password === this.cpassword) {
        this.load = true;
        this.api
          .resetPassword(this.regId, this.password)
          .subscribe((data: APIResult) => {
            console.log(data);
            this.load = false;
            let status: Boolean = data.status;
            let m: string = data.message;
            if (status) {
              this.sweet.showSuccessMessage("Success", m);
            } else {
              this.sweet.showErrorMessage("Failed", m);
            }
          });
      } else {
        this.sweet.showErrorMessage(
          "Invalid Input!!",
          "Given passwords are not same."
        );
      }
    } else {
      this.sweet.showErrorMessage(
        "Invalid Input!!",
        "Please give proper input."
      );
    }
  }
}
