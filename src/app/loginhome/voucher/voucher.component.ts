import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
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
import { Voucher } from "../../models/voucher";
import { UserType } from "../../models/usertype";
var vouch: Voucher = new Voucher();
@Component({
  selector: "app-voucher",
  templateUrl: "./voucher.component.html",
  styleUrls: ["./voucher.component.css"]
})
export class VoucherComponent implements OnInit, OnDestroy {
  userType: string= "";
  private subsc: r.Subscription;
  private subsc2 : r.Subscription;
  private subsc3 : r.Subscription;
  fValid:boolean=false;
  isLe: Boolean = false;
  userInfo: UserType;
  isHe: Boolean = false;
  voucherForm: FormGroup;
  stationId : number=0;
  tkn :string="";
  voucherId: number = 0;
  stations : Station[] = [];
  editMode: Boolean = false;
  formText: string = "Enter Voucher Details:";
  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private api : PdsApiService,
    private vServ: ViewService,
    private swServ : SweetService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.voucherId = +params["id"];
      // let vw = this.route.url["_value"];
      // let str = vw[0].path;
      // let index = str.indexOf("individual");
      // console.log(index);
      // if(index!=="-1")
      // {
      //   this.showbtns = true;
      // }
      // else{
      //   this.showbtns = false;
      // }
      this.editMode = params["id"] != null;
      //this.initForm();
    });
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
    this.subsc = this.vServ.data.subscribe((val: string) => {
      this.userType = val;
    });
    if(this.userType == ""||this.userType == null || this.userType == undefined)
    {
      this.vServ.getValue("storedProp");
    }
    this.subsc2 = this.vServ.utoken.subscribe((val: string) => {
      this.tkn = val;
    });
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.tkn = this.vServ.getToken();
    }
    this.subsc3 = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue("userProp");
      this.userInfo = JSON.parse(u);
    }
    
    var index = this.userType.indexOf("le");
    if (index !== -1) {
      this.isLe = true;
    } else {
      this.isHe = true;
    }
    if (this.editMode) {
      if(this.voucherId > 0){
      this.formText = "Edit Voucher Details:";
      vouch.VoucherId =  this.voucherId;
      this.api.getvoucherdetails(this.voucherId,this.tkn).subscribe(
        (data:APIResult)=>{
          let status: Boolean = data.status;
          let m: string = data.message;
          if(status){
          vouch = data.voucher;
          
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
      }
      else{
        this.swServ.showErrorMessage("Error!!!", 'Unable to get voucher details with given input. Please try again');
      }
    } else {
      this.formText = "Enter Voucher Details:";
    }
    if(this.isLe)
    {
      this.stationId = this.userInfo.stationId;
       if(this.stationId == 0 || this.stationId == undefined || this.stationId == null || this.stationId == NaN) 
       {
         this.swServ.showErrorMessage("Error!!", 'Unable to get station details, Please try again');
       }
    }
    if(this.tkn == "" || this.tkn == undefined || this.tkn == null) 
    {
      this.swServ.showErrorMessage("Error!!", 'Unable to get session details, Please try again');
    }
    this.initForm();
  }
  initForm() {
    if (this.editMode) {
      if(this.isLe && this.stationId > 0)
      {
        let etax="";
        if(vouch.TaxAmount > 0 && vouch.TaxAmount != null && vouch.TaxAmount != NaN && vouch.TaxAmount != undefined){
          etax = "gst";
        }
        let eDate = new FormControl(vouch.V_Date);
        this.voucherForm = this._fb.group({
          location: new FormControl(vouch.StationId),
          voucherdate: eDate,
          vno: new FormControl(vouch.VoucherNumber),
          paidto: new FormControl(vouch.PartyName),
          purpose: new FormControl(vouch.PurposeOfPayment),
          netamnt: new FormControl(vouch.NetAmount),
          taxamnt: new FormControl({value:vouch.TaxAmount,disabled:true}),
          tax: new FormControl(etax),
          totalamnt: new FormControl({value:vouch.TotalAmount,disabled:true})
        });

      }
      else{
        this.swServ.showErrorMessage("Error!!", 'Unable to get input details to edit voucher process, Please try again');
      // let eDate = new FormControl(new Date("09/15/2020"));
      // this.voucherForm = this._fb.group({
      //   location: new FormControl("gtk"),
      //   voucherdate: eDate,
      //   vno: new FormControl("PDS/2021/GTKl/10/001"),
      //   paidto: new FormControl("Gtk"),
      //   purpose: new FormControl("Transport"),
      //   netamnt: new FormControl("1000"),
      //   taxamnt: new FormControl("200"),
      //   tax: new FormControl("gst"),
      //   totalamnt: new FormControl("1200")
      // });
    }
    } else {
      if(this.isLe)
      {
        if(this.stationId>0)
        {
         // let stat = this.stations.find(e=>e.stationId==this.stationId);
          this.voucherForm = this._fb.group({
            location: new FormControl(this.stationId),
            voucherdate: new FormControl(),
            vno: new FormControl(),
            paidto: new FormControl(),
            purpose: new FormControl(),
            netamnt: new FormControl(),
            taxamnt: new FormControl({value:"",disabled:true}),
            tax: new FormControl(""),
            totalamnt: new FormControl({value:"",disabled:true}),
            remark: new FormControl()
          });
        }
        else{
          this.swServ.showErrorMessage("Error!!", 'Unable to get input details to create voucher process, Please try again');
        }

      }
      else{
      this.voucherForm = this._fb.group({
        location: new FormControl(""),
        voucherdate: new FormControl(),
        vno: new FormControl(),
        paidto: new FormControl(),
        purpose: new FormControl(),
        netamnt: new FormControl(),
        taxamnt: new FormControl({value:"",disabled:true}),
        tax: new FormControl(""),
        totalamnt: new FormControl({value:"",disabled:true}),
        remark: new FormControl()
      });
    }
    }
  }
  onSelectTax(evnt) {
    let val = evnt.value;
    let txamnt: number = 0;
    let ntamnt: number = 0;
    let result: number = 0;
    ntamnt = this.voucherForm.value["netamnt"];
    if (val !== "" && ntamnt !== 0) {
      txamnt = ntamnt * (18 / 100);
      result = parseInt(ntamnt.toString()) + parseInt(txamnt.toString());
      this.voucherForm.controls.taxamnt.setValue(txamnt);
      this.voucherForm.controls.totalamnt.setValue(result);
    } else {
      this.voucherForm.controls.taxamnt.setValue(txamnt);
      this.voucherForm.controls.totalamnt.setValue(txamnt);
    }
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
    this.subsc3.unsubscribe();
  }
  onSubmit() {
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.tkn = this.vServ.getToken();
    }
    const errorTitle: string = "INVALID INPUT!!!";
    //  this.fvalid = false;
    if(this.editMode)
    {
      vouch.VoucherId =  this.voucherId;
    }
    vouch.StationId = this.voucherForm.value["station"];
    let vd = this.api.convert(this.voucherForm.value["voucherdate"]);
    vouch.V_Date = vd;
    vouch.VoucherNumber=this.voucherForm.value["vno"];
    vouch.PartyName = this.voucherForm.value["paidto"];
    vouch.PurposeOfPayment = this.voucherForm.value["purpose"];
    vouch.NetAmount = this.voucherForm.value["netamnt"];
    vouch.Tax = this.voucherForm.value["tax"];
    vouch.TaxAmount = this.voucherForm.value["taxamnt"];
    vouch.TotalAmount = this.voucherForm.value["totalamnt"];

    if (
      vouch.VoucherNumber == "" ||
      vouch.VoucherNumber == null ||
      vouch.VoucherNumber == undefined
    ) {
      this.fValid = false;
      this.showrequiredMessage("Voucher Number", "", errorTitle);
    } else if (
      vouch.StationId == 0 ||
      vouch.StationId == null ||
      vouch.StationId == undefined 
    ) {
      this.fValid = false;
      this.showrequiredMessage("Voucher Location", "", errorTitle);
    }else if (vouch.V_Date == "" || vouch.V_Date == null || vouch.V_Date == undefined) {
      this.fValid = false;
      this.showrequiredMessage("Voucher Created Date", "", errorTitle);
    }else if (
      vouch.PartyName == "" ||
      vouch.PartyName == null ||
      vouch.PartyName == undefined
    ) {
      this.fValid = false;
      this.showrequiredMessage("Voucher PartyName", "", errorTitle);
    }else if (
      vouch.PurposeOfPayment == "" ||
      vouch.PurposeOfPayment == null ||
      vouch.PurposeOfPayment == undefined
    ) {
      this.fValid = false;
      this.showrequiredMessage("Voucher Purpose", "", errorTitle);
    } else if (
      vouch.NetAmount == 0 ||
      vouch.NetAmount == null ||
      vouch.NetAmount == undefined 
    ) {
      this.fValid = false;
      this.showrequiredMessage("Voucher NetAmount", "", errorTitle);
    }else if(this.tkn == "" || this.tkn == undefined || this.tkn == null) 
    {
      this.swServ.showErrorMessage("Error!!", 'Unable to get session details, Please try again');
    } else{
      if(vouch.TaxAmount == 0 || vouch.TaxAmount == NaN || vouch.TaxAmount == undefined || vouch.TaxAmount == null)
      {
        vouch.TotalAmount = vouch.NetAmount;
      } 
      if (
        vouch.TotalAmount == 0 ||
        vouch.TotalAmount == null ||
        vouch.TotalAmount == undefined 
      ) {
        this.fValid = false;
        this.showrequiredMessage("Voucher TotalAmount", "", errorTitle);
      }else{
        if(this.editMode){
          if(vouch.VoucherId == 0 || vouch.VoucherId == null || vouch.VoucherId == NaN || vouch.VoucherId == undefined){
            this.swServ.showErrorMessage('Error!!', 'Unable to get details to edit the voucher');
          }else{
            this.api.updateVoucher(vouch,this.tkn).subscribe((data:APIResult)=>{
              //console.log(data);
               let status: Boolean = data.status;
               let m: string = data.message;
               if (status) {
                 this.swServ.showSuccessMessage("Success!!!", m);
                 vouch = new Voucher();
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

        }else{
          this.api.createVoucher(vouch,this.tkn).subscribe((data:APIResult)=>{
                 //console.log(data);
                  let status: Boolean = data.status;
                  let m: string = data.message;
                  if (status) {
                    this.swServ.showSuccessMessage("Success!!!", m);
                    vouch = new Voucher();
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
  focusOutFunction(field, event: any): void {
    const errorTitle: string = "INVALID INPUT!!!";
    var txt = event.target.value;
    if (field == "vno") {
      var f = "Voucher Number";
      this.showrequiredMessage(f, txt, errorTitle);
    }else  if (field == "vpto") {
      var f = "Voucher PaidTo";
      this.showrequiredMessage(f, txt, errorTitle);
    }else  if (field == "vpu") {
      var f = "Voucher Purpose";
      this.showrequiredMessage(f, txt, errorTitle);
    }else  if (field == "vna") {
      var f = "Voucher NetAmount";
      this.showrequiredMessage(f, txt, errorTitle);
    }else  if (field == "vta") {
      var f = "Voucher TotalAmount";
      this.showrequiredMessage(f, txt, errorTitle);
    }
  }
  showrequiredMessage(field, txt, title) {
    var test = false;
    if (txt == "" || txt == null) {
      var msg = field + " " + " field required!!";
      this.fValid = false;
      this.swServ.showErrorMessage(title, msg);
    }
    else if (field == "Voucher NetAmount" || field == "Voucher TotalAmount" || field == "Voucher TaxAmount") {
      var msg = field + " " + " contains Only Numbers!!";
      test = this.api.ValidateNumbers(txt);
      if (!test) {
        this.fValid = false;
        this.swServ.showErrorMessage(title, msg);
      }else{
        this.fValid=true;
        if(field == "Voucher NetAmount")
        {
          var val = this.voucherForm.value["tax"];;
          let txamnt: number = 0;
          let ntamnt: number = 0;
          let result: number = 0;
          ntamnt = Number(txt);
              if (val !== "" && ntamnt !== 0) {
              txamnt = ntamnt * (18 / 100);
              result = parseInt(ntamnt.toString()) + parseInt(txamnt.toString());
              this.voucherForm.controls.taxamnt.setValue(txamnt);
              this.voucherForm.controls.totalamnt.setValue(result);
            } else {
              this.voucherForm.controls.taxamnt.setValue(txamnt);
              this.voucherForm.controls.totalamnt.setValue(txamnt);
            }
        }
      }
    }
    else{
      this.fValid=true;
    }
  }
}
