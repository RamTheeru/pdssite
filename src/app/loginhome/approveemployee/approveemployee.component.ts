import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogRef, MatDialogConfig } from "@angular/material";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material";
import { PdsApiService } from "../../pds-api.service";
import { ViewService } from "../../view.service";
import { SweetService } from "../../sweet.service";
import { Profession } from "../../models/profession";
import { APIResult } from "../../models/apiresult";
import { ApiInput } from "../../models/apiinput";
import { RegisterEmployee } from "../../models/registeremployee";
import { Subscription } from "rxjs";
@Component({
  selector: "app-approveemployee",
  templateUrl: "./approveemployee.component.html",
  styleUrls: ["./approveemployee.component.css"]
})
export class ApproveemployeeComponent implements OnInit, OnDestroy {
  registerId: number = 0;
  stationId: number = 0;
  employees: RegisterEmployee[] = [];
  apiInput: ApiInput;
  aprvForm: FormGroup;
  usrToken: string = "";
  professions: Profession[];
  empCode: string;
  profid: number = 0;
  tkn: string = "";
  private subsc: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private api: PdsApiService,
    private _swServ: SweetService,
    private vServ: ViewService,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<ApproveemployeeComponent>
  ) {
    this.registerId = data.registerId;
    this.stationId = data.stationId;
    this.usrToken = data.token;
  }

  ngOnInit() {
    this.subsc = this.vServ.utoken.subscribe((val: string) => {
      this.tkn = val;
    });
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.tkn = this.vServ.getToken();
    }
    if (this.registerId > 0) {
      this.api.getConstants().subscribe(
        (data: APIResult) => {
          // ,jbgkgg
          //console.log(data);
          let status: Boolean = data.status;
          let m: string = data.message;
          if (status) {
            // this.userTypes = data.usertypes;
            // this.designatons = data.designations;
            this.professions = data.professions;
            // console.log(this.professions);
            // this.stations = data.stations;
            // this._swServ.showSuccessMessage("Success!!", m);
          } else {
            this._swServ.showErrorMessage("Error!!", m);
          }
        },
        err => {
          //console.log(err.message);
          this._swServ.showErrorMessage("Network Error!!!", err.message);
        }
      );
    } else {
      this._swServ.showErrorMessage(
        "Error!!!",
        "Please close it and try again!!!!"
      );
    }
  }
  onClose() {
    this.initForm();
    this.dialogRef.close();
  }
  initForm() {
    // this.aprvForm = this._fb.group({
    //   prof: new FormControl(""),
    //   empc: new FormControl()
    // });
    // this.aprvForm = new FormGroup({
    //   prof: new FormControl(""),
    //   empc: new FormControl()
    // });
    //
    this.profid = 0;
    this.empCode = "";
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
  }
  onCancel() {
    this.initForm();
    // let dialogRef = this.matDialog.open(ApproveemployeeComponent);
    // dialogRef.close();
  }
  handleUnauthorizedrequest() {
    this._swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
  onSubmit() {
    // var p = this.aprvForm.value["prof"];
    // let empCode = this.aprvForm.value["empc"];
    let p = this.profid;
    //console.log(this.registerId, this.empCode, p);
    if (
      this.registerId == 0 ||
      p == 0 ||
      p == undefined ||
      this.empCode == "" ||
      this.empCode == undefined ||
      this.empCode == null ||
      this.usrToken == "" ||
      this.stationId == 0
    ) {
      this._swServ.showErrorMessage("Error!!", "Invalid Input!!!");
    } else if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.handleUnauthorizedrequest();
    } else {
      let pid = Number(p);
      this.api
        .approveUser(this.registerId, "a", pid, this.empCode, this.tkn)
        .subscribe(
          (data: APIResult) => {
            //
            //     console.log(data)     ;
            let status: Boolean = data.status;
            let m: string = data.message;
            if (status) {
              this._swServ.showSuccessMessage("Success!!", m);
              //   this.professions = data.professions;
              // this.apiInput = new ApiInput();
              // this.apiInput.stationId = Number(this.stationId);
              // this.api
              //   .getRegisteredEmployees(this.apiInput, this.usrToken)
              //   .subscribe((data: APIResult) => {
              //     // console.log(data)     ;
              //     let status = data.status;
              //     let message = data.message;
              //     if (status) {
              //       this.employees = data.registerEmployees;
              //     } else {
              //       this._swServ.showErrorMessage("Failure!!!", message);
              //     }
              //   });
            } else {
              this._swServ.showErrorMessage("Error!!", m);
            }
            this.dialogRef.close({ status: status, message: m });
            // let dialogRef = this.matDialog.open(ApproveemployeeComponent);
            //dialogRef.close();
          },
          err => {
            //console.log(err.message);
            this._swServ.showErrorMessage("Network Error!!!", err.message);
          }
        );
      this.initForm();
    }
  }
}
