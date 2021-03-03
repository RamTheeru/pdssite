import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import { SweetService } from "../../sweet.service";
import { ViewService } from "../../view.service";
import { PdsApiService } from "../../pds-api.service";
import { APIResult } from "../../models/apiresult";
import { Station } from "../../models/station";
import { CommercialConstant } from "../../models/commercialconstant";
import { Subscription } from "rxjs";
var cc: CommercialConstant = new CommercialConstant();
@Component({
  selector: "app-commercialconstant",
  templateUrl: "./commercialconstant.component.html",
  styleUrls: ["./commercialconstant.component.css"]
})
export class CommercialconstantComponent implements OnInit, OnDestroy {
  ccForm: FormGroup;
  stations: Station[];
  tkn: string = "";
  private subsc: Subscription;
  constructor(
    private _fb: FormBuilder,
    private api: PdsApiService,
    private vServ: ViewService,
    private _swServ: SweetService
  ) {}
  apiResult: APIResult;
  oncancel() {
    this.initForm();
  }
  ngOnInit() {
    this.subsc = this.vServ.utoken.subscribe((val: string) => {
      this.tkn = val;
    });
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.tkn = this.vServ.getToken();
    }
    this.initForm();
    this.api.getConstants().subscribe(
      (data: APIResult) => {
        let status: Boolean = data.status;
        let m: string = data.message;
        if (status) {
          this.stations = data.stations;
        } else {
          this._swServ.showErrorMessage("Error!!", m);
        }
      },
      err => {
        this._swServ.showErrorMessage("Network Error!!!", err.message);
      }
    );
  }
  handleUnauthorizedrequest() {
    this._swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
  initForm() {
    this.ccForm = this._fb.group({
      station: new FormControl(""),
      delv: new FormControl(""),
      petr: new FormControl(""),
      inc: new FormControl({ value: "0", disabled: true })
    });
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
  }
  getdetails(evt){
   console.log(evt.value);
   let sta = evt.value;
   if(sta != ""){
     let statId = sta.stationId;
     if(statId > 0)
     {
      this.api
      .getCDADeliverybyStation(statId, this.tkn)
      .subscribe((data: APIResult) => {
        let status = data.status;
        let message = data.message;
        if (status) {
          cc = data.commercialConstant;
          // console.log(data);
          this.ccForm = this._fb.group({
            station: new FormControl({ value: sta, disabled: false }),
            delv: new FormControl({ value: cc.deliveryRate, disabled: false }),
            petr: new FormControl({ value: cc.petrolAllowance, disabled: false }),
            inc: new FormControl({ value: "0", disabled: true })
          });
          //this.standardRate = cc.deliveryRate;
         // this.petrolallowance = cc.petrolAllowance;
        } else {
          this._swServ.showErrorMessage("Failure!!!", message);
        }
      });

     }
     else{
      this._swServ.showErrorMessage("Something went wrong!!", 
      "Unable to get previous values for this station.But you can update now.");
     }
   }else{
     this.initForm();
   }

  }
  onSubmit() {
    let st = this.ccForm.value["station"];
    let delvr = this.ccForm.value["delv"];
    let petrl = this.ccForm.value["petr"];
    let incen = this.ccForm.value["inc"];
    cc.stationId = st.stationId;
    cc.deliveryRate = Number(delvr);
    cc.petrolAllowance = Number(petrl);
    cc.incentives = Number(incen);
    if (
      cc.incentives == NaN ||
      cc.incentives == undefined ||
      cc.incentives == null
    ) {
      cc.incentives = 0;
    }
    if (
      cc.stationId == 0 ||
      cc.stationId == undefined ||
      cc.stationId == null
    ) {
      this._swServ.showErrorMessage("Invalid Input!!", "Please Select Station");
    } else if (
      cc.deliveryRate == 0 ||
      cc.deliveryRate == NaN ||
      cc.deliveryRate == undefined ||
      cc.deliveryRate == null
    ) {
      this._swServ.showErrorMessage(
        "Invalid Input!!",
        "Please Enter Delivery Rate"
      );
    } else if (
      cc.petrolAllowance == 0 ||
      cc.petrolAllowance == NaN ||
      cc.petrolAllowance == undefined ||
      cc.petrolAllowance == null
    ) {
      this._swServ.showErrorMessage(
        "Invalid Input!!",
        "Please Enter PetrolAllowance Rate"
      );
    } else if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.handleUnauthorizedrequest();
    } else {
      //submit      to API
      this.api.createconstant(cc, this.tkn).subscribe(
        (data: APIResult) => {
          let status: Boolean = data.status;
          let m: string = data.message;
          if (status) {
            this._swServ.showSuccessMessage("Success!!!", m);
            cc = new CommercialConstant();
            this.initForm();
          } else {
            this._swServ.showErrorMessage("Error!!", m);
          }
        },
        err => {
          //console.log(err)      ;
          this._swServ.showErrorMessage("Network Error!!!", err.message);
        }
      );
    }
  }
}
