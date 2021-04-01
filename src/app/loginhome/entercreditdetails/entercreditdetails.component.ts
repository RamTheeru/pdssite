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
import swal from "sweetalert2";
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
  checkforUpdate : boolean = false;
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
      this.handleUnauthorizedrequest();
    }
    this.initForm();
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
          console.log(data);
          let status: Boolean = data.status;
          let m: string = data.message;
          if(status){
          //ledge = data.ledger;
          let c = data.ledger.credit;
          let d = data.ledger.debit;
          let b = data.ledger.balance;
          let currcred = data.ledger.currentCreditAmount;
          let currdebt = data.ledger.currentDebitAmount;
          let currbal = data.ledger.currentBalanceAmount;
         console.log(this.creditForm);
          let nc = Number(currcred);
          let nd = Number(currdebt);
          let nb = Number(currbal);
          if(nc == null || nc == undefined || nc == NaN )
          {
              nc = 0;
          }
          if(nb == null || nb == undefined || nb == NaN )
          {
              nb=0;
          }
          if(nd == null || nd == undefined || nd == NaN )
          {
               nd = 0;
          }
          if(nc > 0)
          {
            this.checkforUpdate = true;
          }
            m = m + " and amount already credited in this month for this station : ("+nc+"); Amount debited in this amount : ("+nd+"); Balance amount remaining for current month : ("+nb+");"; 
          
          this.swServ.showMessage("Success!!", m);
         // this.voucherForm.controls.taxamnt.setValue(txamnt);
          // this.creditForm = this._fb.group({
          //   location: new FormControl(this.stationId),
          //   lmcredit: new FormControl({ value: "", disabled: true }),
          //   lmtdebit: new FormControl({ value: "", disabled: true }),
          //   balance: new FormControl({ value: "", disabled: true }),
          //   tmcredit: new FormControl()
          // });
          console.log(c,d,b);
          // this.creditForm.value["lmcredit"]=ledge.credit;
          // this.creditForm.value["lmtdebit"]=ledge.debit;
          // this.creditForm.value["balance"]=ledge.balance;
          this.creditForm.controls.lmcredit.setValue(c);
          this.creditForm.controls.lmtdebit.setValue(d);
          this.creditForm.controls.balance.setValue(b);
         // this.creditForm.controls.tmcredit.setValue(curr);
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
  handleUnauthorizedrequest() {
    this.swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
  onSubmit() {
    ledge.StationId = this.stationId;
    let camount = this.creditForm.value["tmcredit"];
    ledge.Credit=Number(camount);
  if(ledge.Credit == null || ledge.Credit == 0||ledge.Credit == undefined||ledge.Credit==NaN){
    this.swServ.showErrorMessage("Error!!", 'Please Enter Amount');
  }else if(this.tkn == "" || this.tkn == undefined || this.tkn == null) 
  {
    this.handleUnauthorizedrequest();
  }else if (
    ledge.StationId == 0 ||
    ledge.StationId == null ||
    ledge.StationId == undefined 
  ) {
    this.swServ.showErrorMessage("Error!!", 'Unable to get Station details, Please try again');
  }else{
   // console.log(camount);
    var test = this.api.ValidateNumbers(camount);
    if(!test)
    {
      this.swServ.showErrorMessage("Error!!", 'Please Enter only Numbers');
    }else{
      ledge.Debit = 0;
      ledge.Balance = 0;
      if(this.checkforUpdate)
      {
        swal({
          title: "Are you sure?",
          text:  "the total credit amount you entered again for this station in current month will be added to existing amount you already entered this month and also update the debits in ledger table for this month, ARE YOU SURE?",
          type: "warning",
          showConfirmButton: true,
          showCancelButton: true
        }).then(willDelete => {
          if (willDelete.value) {
            this.submitoAPI(ledge);
            // this.api.approveUser(e.RegisterId, status);
          } else {
            this.swServ.showErrorMessage("Canelled", "");
          }
        });
      }
      else{
        this.submitoAPI(ledge);
      }
       

    }
  }

  }
  submitoAPI(ledge:Ledger)
  {
    this.api.insertCredit(ledge,this.tkn).subscribe((data:APIResult)=>{
      //console.log(data);
       let status: Boolean = data.status;
       let m: string = data.message;
       if (status) {
         this.swServ.showSuccessMessage("Success!!!", m);
         this.initForm();
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
