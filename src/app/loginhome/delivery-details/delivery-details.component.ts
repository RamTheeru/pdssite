import {
  Component,
  OnInit,
  ViewChildren,
  ElementRef,
  QueryList,
  OnDestroy
} from "@angular/core";
import { APIResult } from "../../models/apiresult";
import { PdsApiService } from "../../pds-api.service";
import { ApiInput } from "../../models/apiinput";
import { SweetService } from "../../sweet.service";
import { ViewService } from "../../view.service";
import { Employee } from "../../models/employee";
import { UserType } from "../../models/usertype";
import { CommercialConstant } from "../../models/commercialconstant";
import { DeliveryDetails } from "../../models/deliverydetails";
import * as r from "rxjs";
import { forEach } from "@angular/router/src/utils/collection";
import swal from "sweetalert2";
const deliverylist: DeliveryDetails[] = [];

@Component({
  selector: "app-delivery-details",
  templateUrl: "./delivery-details.component.html",
  styleUrls: ["./delivery-details.component.css"]
})
export class DeliveryDetailsComponent implements OnInit, OnDestroy {
  petrolallowance: number = 0;
  standardRate: number = 0;
  load: boolean = false;
  @ViewChildren("fil") fil: QueryList<any>;
  cc: CommercialConstant;
  isHide: boolean = true;
  currentmonth: number = 0;
  apiInput: ApiInput;
  inputs: string[] = [];
  stationId: number = 0;
  usrToken: string = "";
  employees: Employee[] = [];
  private subsc: r.Subscription;
  private subsc2: r.Subscription;
  userInfo: UserType;
  pageCount: number = 1;
  pages = [];
  btnallow: boolean = false;
  totalCount: number = 0;
  list: DeliveryDetails[] = [];
  months = [
    { id: 1, name: "January" },
    { id: 2, name: "Febrauary" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" }
  ];
  // list: DeliveryDetails[] = [
  //   {
  //     Id: 101,
  //     EmployeeCode: "180101",
  //     EmployeeName: "Ram",
  //     DeliveryCount: 5,
  //     StandardRate: "Fixed By Admin",
  //     Incentive: 2330,
  //     TotalAmount: 10000
  //   },
  //   {
  //     Id: 102,
  //     EmployeeCode: "180102",
  //     EmployeeName: "Ravi",
  //     DeliveryCount: 7,
  //     StandardRate: "Fixed By Admin",
  //     Incentive: 2230,
  //     TotalAmount: 9000
  //   },
  //   {
  //     Id: 103,
  //     EmployeeCode: "180103",
  //     EmployeeName: "Raju",
  //     DeliveryCount: 9,
  //     StandardRate: "Fixed By Admin",
  //     Incentive: 3230,
  //     TotalAmount: 12000
  //   }
  // ];
  constructor(
    private api: PdsApiService,
    private swServ: SweetService,
    private vServ: ViewService
  ) {}
  handleUnauthorizedrequest() {
    this.swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
  }
  ngOnInit() {
    this.subsc = this.vServ.utoken.subscribe((val: string) => {
      this.usrToken = val;
    });
    if (
      this.usrToken == "" ||
      this.usrToken == undefined ||
      this.usrToken == null
    ) {
      this.usrToken = this.vServ.getToken();
    }
    this.subsc2 = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue("userProp");
      this.userInfo = JSON.parse(u);
    }
    this.stationId = this.userInfo.stationId;
    if (
      this.stationId == 0 ||
      this.stationId == null ||
      this.stationId == undefined
    ) {
      this.swServ.showErrorMessage(
        "Something Went Wrong!!",
        "Unable to get Station, Please try again!!"
      );
    } else if (
      this.usrToken == "" ||
      this.usrToken == undefined ||
      this.usrToken == null
    ) {
      this.handleUnauthorizedrequest();
    } else {
      this.api
        .getCDADeliverybyStation(this.stationId, this.usrToken)
        .subscribe((data: APIResult) => {
          let status = data.status;
          let message = data.message;
          if (status) {
            this.cc = data.commercialConstant;
            // console.log(data);
            this.standardRate = this.cc.deliveryRate;
            this.petrolallowance = this.cc.petrolAllowance;
          } else {
            this.swServ.showErrorMessage("Failure!!!", message);
          }
        });
      // this.apiInput = new ApiInput();
      // this.apiInput.stationId = Number(this.stationId);
      // this.getemployees(this.apiInput);
    }
  }
  getemployeesbyMonth(event) {
    //console.log(this.selectedStation) ;
    if (this.usrToken == "") {
      this.usrToken = this.vServ.getToken();
    }
    if (this.currentmonth == 0) {
      this.swServ.showErrorMessage("Invalid Input!!!", "Please Select Month");
      this.employees = [];
    } else if (
      this.usrToken == "" ||
      this.usrToken == undefined ||
      this.usrToken == null
    ) {
      this.handleUnauthorizedrequest();
    } else if (this.standardRate == 0 || this.petrolallowance == 0) {
      this.swServ.showErrorMessage(
        "Something Went Wrong!!",
        "Unable to get Station Delivery Details, Please try again!!"
      );
    } else {
      this.apiInput = new ApiInput();
      this.apiInput.stationId = Number(this.stationId);
      this.apiInput.currentmonth = this.currentmonth;
      this.getemployees(this.apiInput);
    }
  }
  focusOutFunction(val, event) {
    console.log(event);
    let del = "";
    let v2 = "";
    let id = "0";
    var test = false;
    let title = "Invalid Input!!!";
    let msg = "Please Enter Only Numbers";
    if (val == "dvc") {
      id = event.target.id;
      id = id.toString();
      del = event.target.value;
      del = del.toString();
      if (del == null || del == undefined || del == "") {
        del = "0";
        this.btnallow = true;
        this.swServ.showMessage(
          "Alert!!!",
          "Values that are not given will be taken as ZERO(default)"
        );
      }
      if (del != null || del != "") {
        test = this.api.ValidateNumbers(del);
        if (!test) {
          this.btnallow = false;
          this.swServ.showErrorMessage(title, msg);
        } else {
          this.btnallow = true;
          //  var ind = this.inputs.indexOf(e=>e.startsWith(id+'-delcount'));
          // this.inputs = this.inputs.filter(
          //   e => !e.startsWith(id + "-delcount-")
          // );
          // this.inputs.push(id + "-delcount-" + del);
        }
      }
    } else if (val == "inc") {
      id = event.target.id;
      id = id.toString();
      v2 = event.target.value;
      v2 = v2.toString();
      if (v2 == null || v2 == undefined || v2 == "") {
        v2 = "0";
        this.btnallow = true;
        this.swServ.showMessage(
          "ALert!!!",
          "Values that are not given will be taken as ZERO(default)"
        );
      }
      if (v2 != null || v2 != "") {
        test = this.api.ValidateNumbers(v2);
        if (!test) {
          this.btnallow = false;
          this.swServ.showErrorMessage(title, msg);
        } else {
          this.btnallow = true;
          // this.inputs = this.inputs.filter(e => !e.startsWith(id + "-incent-"));
          // this.inputs.push(id + "-incent-" + v2);
        }
      }
    }
    //console.log(this.inputs);
  }
  getdata(val: number) {
    console.log(val);
    this.apiInput = new ApiInput();
    this.apiInput.page = val;
    this.apiInput.stationId = Number(this.stationId);
    this.apiInput.currentmonth = this.currentmonth;
    this.getemployees(this.apiInput);
  }
  getemployees(input: ApiInput) {
    this.load = true;
    this.api
      .getCDADeliverylist(input, this.usrToken)
      .subscribe((data: APIResult) => {
        let status = data.status;
        let message = data.message;
        if (status) {
          this.load = false;
          this.employees = data.employees;
          this.pageCount = data.queryPages;
          this.totalCount = data.queryTotalCount;
          this.pages = this.api.transform(this.pageCount);
          if (this.employees.length > 0) {
            this.btnallow = true;
          } else {
            this.btnallow = false;
          }
          console.log(data);
        } else {
          this.swServ.showErrorMessage("Failure!!!", message);
        }
      });
  }
  Onsub() {
    // console.log(this.inputs);
    let dd = new DeliveryDetails();
    let sid = this.stationId;
    let sdrate = this.standardRate;
    let ptrrate = this.petrolallowance;
    let mo = this.currentmonth;
    this.fil.forEach(function(e) {
      let ele = e;
      //console.log(e);
      let field = ele.nativeElement.name;
      let c = Number(ele.nativeElement.value);
      let id = Number(ele.nativeElement.id);
      dd = new DeliveryDetails();
      if (c == NaN || c == undefined || c == null) {
        c = 0;
      }
      if (field == "dvc") {
        // dd.DeliveryCount = c;
        let found = deliverylist.some(el => el.EmployeeId === id);
        if (found) {
          deliverylist.find(el => el.EmployeeId == id).DeliveryCount = c;
        } else {
          let d = {
            EmployeeId: id,
            StationId: sid,
            DeliveryRate: sdrate,
            PetrolAllowance: ptrrate,
            CurrentMonth: mo,
            DeliveryCount: c
          };
          dd = d as DeliveryDetails;
          //dd.DeliveryCount = c;
          deliverylist.push(dd);
        }
      } else if (field == "inc") {
        let found = deliverylist.some(el => el.EmployeeId === id);
        if (found) {
          deliverylist.find(el => el.EmployeeId == id).Incentive = c;
        } else {
          let d2 = {
            EmployeeId: id,
            StationId: sid,
            DeliveryRate: sdrate,
            PetrolAllowance: ptrrate,
            CurrentMonth: mo,
            DeliveryCount: c
          };
          dd = d2 as DeliveryDetails;
          // dd.DeliveryCount = c2;
          deliverylist.push(dd);
        }
      } else {
        this.swServ.showErrorMessage(
          "Something went wrong!!!",
          "Please try again"
        );
      }
    });
    // console.log(deliverylist);
    //let dd = new DeliveryDetails();
    //let dd: DeliveryDetails = new DeliveryDetails();
    let count = 0; //this.inputs.length;
    if (this.currentmonth == 0) {
      this.swServ.showErrorMessage(
        "Invalid Input!!!",
        "Please Select Month & get list of employees"
      );
    } else {
      count = deliverylist.length;
      if (count > 0) {
        swal({
          title: "Are you sure?",
          text: "Do you want to Update Details for following users?",
          type: "warning",
          showConfirmButton: true,
          showCancelButton: true
        }).then(willDelete => {
          if (willDelete.value) {
            // console.log(deliverylist);
            this.updateDeilveryDetails(deliverylist, this.usrToken);
            // this.api.approveUser(e.RegisterId, status);
          } else {
            this.swServ.showErrorMessage(
              "Canelled",
              "Please re-enter all details again."
            );
            this.OnCancel();
            this.inputs = [];
          }
        });
      } else {
        this.swServ.showErrorMessage(
          "Invalid Operation!!!",
          "Unable to update  delivery details of employees"
        );
      }
      // this.inputs.forEach(function(val) {
      // let ele = val;
      // //dd = new DeliveryDetails();
      // // dd.StationId = this.stationId;
      // // dd.DeliveryRate = this.standardRate;
      // // dd.PetrolAllowance = this.petrolallowance;
      // // dd.CurrentMonth = this.currentmonth;
      // if (ele.includes("del")) {
      //   var splitted = ele.split("-", 3);
      //   let c = Number(splitted[2]);
      //   let id = Number(splitted[0]);
      //   if (c == NaN || c == undefined) {
      //     c = 0;
      //   }
      //   // dd.DeliveryCount = c;
      //   let found = deliverylist.some(el => el.EmployeeId === id);
      //   if (found) {
      //     deliverylist.find(el => el.EmployeeId == id).DeliveryCount = c;
      //   } else {
      //     let d = {
      //       EmployeeId: id,
      //       StationId: sid,
      //       DeliveryRate: sdrate,
      //       PetrolAllowance: ptrrate,
      //       CurrentMonth: mo,
      //       DeliveryCount: c
      //     };
      //     dd = d as DeliveryDetails;
      //     //dd.DeliveryCount = c;
      //     deliverylist.push(dd);
      //   }
      // } else if (ele.includes("inc")) {
      //   var splitted2 = ele.split("-", 3);
      //   let c2 = Number(splitted2[2]);
      //   let id = Number(splitted2[0]);
      //   if (c2 == NaN || c2 == undefined) {
      //     c2 = 0;
      //   }
      //   let found = deliverylist.some(el => el.EmployeeId === id);
      //   if (found) {
      //     deliverylist.find(el => el.EmployeeId == id).Incentive = c2;
      //   } else {
      //     let d2 = {
      //       EmployeeId: id,
      //       StationId: sid,
      //       DeliveryRate: sdrate,
      //       PetrolAllowance: ptrrate,
      //       CurrentMonth: mo,
      //       DeliveryCount: c2
      //     };
      //     dd = d2 as DeliveryDetails;
      //     // dd.DeliveryCount = c2;
      //     deliverylist.push(dd);
      //   }
      // }
      // });
    }
  }
  updateDeilveryDetails(dvlist, token) {
    this.load = true;
    this.api
      .updateCDADeliverylist(dvlist, token)
      .subscribe((data: APIResult) => {
        this.load = false;
        let status = data.status;
        let message = data.message;
        if (status) {
          this.swServ.showSuccessMessage("Success!!!", message);
          this.ngOnInit();
        } else {
          this.swServ.showErrorMessage("Failure!!!", message);
        }
        deliverylist.length = 0;
      });
  }
  OnCancel() {
    this.fil.forEach(function(e) {
      e.nativeElement.value = "0";
    });
  }
}
