import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import * as r from "rxjs";
import { APIResult } from "../../models/apiresult";
import { PdsApiService } from "../../pds-api.service";
import { SweetService } from "../../sweet.service";
import { ViewService } from "../../view.service";
import { Station } from "../../models/station";
import { Ledger } from "../../models/ledger";
var ledge: Ledger = new Ledger();
@Component({
  selector: "app-entercreditdetails",
  templateUrl: "./entercreditdetails.component.html",
  styleUrls: ["./entercreditdetails.component.css"]
})
export class EntercreditdetailsComponent implements OnInit {
  creditForm: FormGroup;
  stations : Station[]=[];
  private subsc: r.Subscription;
  stationId : number = 0;
  tkn:string = "";
  //ledger:Ledger;
  editMode: Boolean = false;
  formText: string = "Enter Credit Details:";
  constructor(private _fb: FormBuilder
    ,private swServ:SweetService
    ,private api:PdsApiService
    ,private vServ:ViewService) {}

  ngOnInit() {
    //this.initForm();
    this.api.getConstants().subscribe(
      (data: APIResult) => {
        //console.log(data);
        let status: Boolean = data.status;
        let m: string = data.message;
        if (status) {
          this.stations = data.stations;
        } else {
          this.swServ.showErrorMessage("Error!!", m);
        }
      },
      err => {
        //console.log(err.message);
        this.swServ.showErrorMessage("Network Error!!!", err.message);
      }
    );
    this.subsc = this.vServ.utoken.subscribe((val: string) => {
      this.tkn = val;
    });
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.tkn = this.vServ.getToken();
    }
    if (this.editMode) {
      this.formText = "Edit Credit Details:";
    } else {
      this.formText = "Enter Credit Details:";
    }
    if(this.tkn == "" || this.tkn == undefined || this.tkn == null) 
    {
      this.swServ.showErrorMessage("Error!!", 'Unable to get session details, Please try again');
    }
  }
  initForm() {
    if (this.editMode) {
      this.creditForm = this._fb.group({
        location: new FormControl("gtk"),
        lmcredit: new FormControl("4500"),
        lmtdebit: new FormControl("3200"),
        balance: new FormControl("300"),
        tmcredit: new FormControl("1000")
      });
    } else {

      this.creditForm = this._fb.group({
        location: new FormControl(""),
        lmcredit: new FormControl({ value: "", disabled: true }),
        lmtdebit: new FormControl({ value: "", disabled: true }),
        balance: new FormControl({ value: "", disabled: true }),
        tmcredit: new FormControl()
      });
    }
  }
  onSelectStation(evnt) {
    let val = evnt.value;
    // ntamnt = this.creditForm.value["netamnt"];
    if (val !== "") {
      this.stationId = Number(val);
      this.api.previousmonthCreditDetails(this.stationId,this.tkn).subscribe(
        (data:APIResult)=>{
          let status: Boolean = data.status;
          let m: string = data.message;
          if(status){
          ledge = data.ledger;
          
          }
          else{
            this.swServ.showErrorMessage("Error!!", m);
          }
        },
        err => {
          //console.log(err);
          this.swServ.showErrorMessage("Network Error!!!", err.message);
        }
      );
      //  this.creditForm.controls.taxamnt.setValue(txamnt);
      this.creditForm = this._fb.group({
        location: new FormControl(this.stationId),
        lmcredit: new FormControl({ value: ledge.Credit, disabled: true }),
        lmtdebit: new FormControl({ value: ledge.Debit, disabled: true }),
        balance: new FormControl({ value: ledge.Balance, disabled: true }),
        tmcredit: new FormControl()
      });
    } else {
      this.swServ.showErrorMessage("Error!!", 'Please select Station');
      // this.creditForm = this._fb.group({
      //   location: new FormControl(""),
      //   lmcredit: new FormControl({ value: "", disabled: true }),
      //   lmtdebit: new FormControl({ value: "", disabled: true }),
      //   balance: new FormControl({ value: "", disabled: true }),
      //   tmcredit: new FormControl()
      // });
    }
  }
  onSubmit() {
    let camount = this.api.convert(this.creditForm.value["tmcredit"]);
    ledge.Credit=Number(camount);
  if(ledge.Credit == null || ledge.Credit == 0||ledge.Credit == undefined||ledge.Credit==NaN){
    this.swServ.showErrorMessage("Error!!", 'Please Enter Amount');
  }else if(this.tkn == "" || this.tkn == undefined || this.tkn == null) 
  {
    this.swServ.showErrorMessage("Error!!", 'Unable to get session details, Please try again');
  }else if (
    ledge.StationId == 0 ||
    ledge.StationId == null ||
    ledge.StationId == undefined 
  ) {
    this.swServ.showErrorMessage("Error!!", 'Unable to get Station details, Please try again');
  }else{
    var test = this.api.ValidateNumbers(camount);
    if(!test)
    {
      this.swServ.showErrorMessage("Error!!", 'Please Enter only Numbers');
    }else{
      this.api.insertCredit(ledge,this.tkn).subscribe((data:APIResult)=>{
        //console.log(data);
         let status: Boolean = data.status;
         let m: string = data.message;
         if (status) {
           this.swServ.showSuccessMessage("Success!!!", m);
           ledge = new Ledger();
         } else {
           this.swServ.showErrorMessage("Error!!", m);
         }
       },
       err => {
         //console.log(err);
         this.swServ.showErrorMessage("Network Error!!!", err.message);
       }
     );

    }
  }

  }
}
