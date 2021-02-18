import {
  Component,
  OnInit,
  ViewChildren,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { SalaryslipComponent } from "../salaryslip/salaryslip.component";
import { ApproveemployeeComponent } from "../approveemployee/approveemployee.component";
import { RegisterEmployee } from "../../models/registeremployee";
import { Employee } from "../../models/employee";
import { APIResult } from "../../models/apiresult";
import { ViewService } from "../../view.service";
import { PdsApiService } from "../../pds-api.service";
import { SweetService } from "../../sweet.service";
import { Station } from "../../models/station";
import { ApiInput } from "../../models/apiinput";
import * as r from "rxjs";
import swal from "sweetalert2";
@Component({
  selector: "app-employeelist",
  templateUrl: "./employeelist.component.html",
  styleUrls: ["./employeelist.component.css"]
})
export class EmployeelistComponent implements OnInit, OnDestroy {
  @ViewChildren("empCode") empCode;
  employees: RegisterEmployee[] = [];
  pageCount: number = 1;
  pages = [];
  url: string = "";
  isreguser: boolean = true;
  totalCount: number = 0;
  stations: Station[];
  apiInput: ApiInput;
  selectedStation: string = "";
  userType: string = "";
  usrToken: string = "";
  emCode: string = "";
  private subsc: r.Subscription;
  private subsc2: r.Subscription;
  stationCode: string = "";
  apiResult: APIResult;
  isHide = true;
  isHE: Boolean = false;
  empId: number = 0;
  e: Employee;
  //t
  constructor(
    private dialog: MatDialog,
    private api: PdsApiService,
    private swServ: SweetService,
    private vServ: ViewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.url = this.route["_routerState"].snapshot.url;

    var index = this.url.indexOf("logins");
    if (index !== -1) {
      this.isreguser = false;
    } else {
      this.isreguser = true;
    }
    this.subsc = this.vServ.data.subscribe((val: string) => {
      this.userType = val;
    });
    this.subsc2 = this.vServ.utoken.subscribe((val: string) => {
      this.usrToken = val;
    });

    if (this.userType == "" || this.userType == undefined) {
      this.userType = this.vServ.getValue("storedProp");
    }
    if (this.userType == "hrhe") {
      this.isHE = true;
    }
    this.api.getConstants().subscribe(
      (data: APIResult) => {
        let status: Boolean = data.status;
        let m: string = data.message;
        if (status) {
          this.stations = data.stations;
        } else {
          this.swServ.showErrorMessage("Error!!", m);
        }
      },
      err => {
        this.swServ.showErrorMessage("Network Error!!!", err.message);
      }
    );
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
  }
  getemployeesbyStation(event) {
    //console.log(this.selectedStation) ;
    if (this.usrToken == "") {
      this.usrToken = this.vServ.getToken();
    }
    if (this.selectedStation == "") {
      this.swServ.showErrorMessage("Invalid Input!!!", "Please Select Station");
    } else if (
      this.usrToken == "" ||
      this.usrToken == undefined ||
      this.usrToken == null
    ) {
      this.handleUnauthorizedrequest();
    } else {
      this.apiInput = new ApiInput();
      this.apiInput.stationId = Number(this.selectedStation);
      this.registeredUsers(this.apiInput);
    }
  }
  getdata(val: number) {
    console.log(val);
    this.apiInput = new ApiInput();
    this.apiInput.page = val;
    this.apiInput.stationId = Number(this.selectedStation);
    this.registeredUsers(this.apiInput);
  }

  registeredUsers(input: ApiInput) {
    if (this.isreguser) {
      this.api
        .getRegisteredEmployees(input, this.usrToken)
        .subscribe((data: APIResult) => {
          // console.log(data)     ;
          let status = data.status;
          let message = data.message;
          if (status) {
            this.employees = data.registerEmployees;
            this.pageCount = data.queryPages;
            this.totalCount = data.queryTotalCount;
            this.pages = this.api.transform(this.pageCount);
            console.log(data);
          } else {
            this.swServ.showErrorMessage("Failure!!!", message);
          }
        });
    } else {
      this.api
        .getemployeelogins(input, this.usrToken)
        .subscribe((data: APIResult) => {
          console.log(data);
          let status = data.status;
          let message = data.message;
          if (status) {
            this.employees = data.employees;
            this.pageCount = data.queryPages;
            this.totalCount = data.queryTotalCount;
            this.pages = this.api.transform(this.pageCount);
            console.log(data);
          } else {
            this.swServ.showErrorMessage("Failure!!!", message);
          }
        });
    }
  }
  handleUnauthorizedrequest() {
    this.swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
  approveUser(evt: any, status: string) {
    // fsgsdhdhdfhdf nsgshg
    //fjgffhfh fjyfjyf
    //console.log(evt.target.id); safasfasf
    // console.log(this.empCode._results);
    // let elements: ElementRef[] = this.empCode._results;
    var id = evt.target.id;
    let e: RegisterEmployee = new RegisterEmployee();
    //e.EmpCode = this.emCode;
    e.RegisterId = Number(id);
    if (this.usrToken == "") {
      this.usrToken = this.vServ.getToken();
    }
    // if (elements.length > 0) {
    //   elements.forEach(el => {
    //     if (Number(el.nativeElement.id) === e.RegisterId) {
    //       console.log(el.nativeElement.value);
    //       this.emCode = el.nativeElement.value as string;
    //     } else {
    //       this.emCode = "";
    //     }
    //   });
    // } else {
    //   this.swServ.showErrorMessage(
    //     "Something Went Wrong!!!",
    //     "Please refresh the page or login again!!!"
    //   );
    // }
    if (e.RegisterId == 0 || e.RegisterId == undefined) {
      this.swServ.showErrorMessage("Invalid Input!!!", "Please try again!!!");
    }
    // } else if (
    //   status == "r" &&
    //   (e.RegisterId == 0 || e.RegisterId == undefined)
    // ) {
    //   this.swServ.showErrorMessage(
    //     "Invalid Operation!!!",
    //     "Please try again!!!"
    //   );
    // }
    else if (this.usrToken == "" || this.usrToken == undefined) {
      this.handleUnauthorizedrequest();
    } else {
      if (status == "a") {
        swal({
          title: "Are you sure?",
          text: "Do you want to approve this user?",
          type: "warning",
          showConfirmButton: true,
          showCancelButton: true
        }).then(willDelete => {
          if (willDelete.value) {
            this.openApproveForm(e.RegisterId, Number(this.selectedStation));
            // this.api.approveUser(e.RegisterId, status);
          } else {
            this.swServ.showErrorMessage("Canelled", "");
          }
        });
        // this.swServ
        //   .showWarning("Do you want to approve this user?")
        //   .subscribe((data: boolean) => {
        //     console.log(data);
        //     if(data){
        //     // this.api.approveUser(e.RegisterId, status);
        //     this.apiInput = new ApiInput();
        //     this.apiInput.stationId = Number(this.selectedStation);
        //     this.registeredUsers(this.apiInput);
        //     }else{
        //         this.swServ.showErrorMessage("Canelled", "");
        //     }
        //   });
      } else {
        swal({
          title: "Are you sure?",
          text: "Do you want to remove this user?",
          type: "warning",
          showConfirmButton: true,
          showCancelButton: true
        }).then(willDelete => {
          if (willDelete.value) {
            //   this.openApproveForm(e.RegisterId);
            this.api
              .approveUser(e.RegisterId, status, 0, "", this.usrToken)
              .subscribe(
                (data: APIResult) => {
                  //console.log(data);
                  let status: Boolean = data.status;
                  let m: string = data.message;
                  if (status) {
                    // this.userTypes = data.usertypes;
                    // this.designatons = data.designations;
                    // this.stations = data.stations;
                    this.swServ.showSuccessMessage("Success!!", m);
                  } else {
                    this.swServ.showErrorMessage("Error!!", m);
                  }
                  this.isreguser = true;
                  this.apiInput = new ApiInput();
                  this.apiInput.stationId = Number(this.selectedStation);
                  this.registeredUsers(this.apiInput);
                  //this.ngOnInit();
                },
                err => {
                  //console.log(err.message);
                  this.swServ.showErrorMessage("Network Error!!!", err.message);
                }
              );
          } else {
            this.swServ.showErrorMessage("Canelled", "");
          }
        });
        // this.swServ
        //   .showWarning("Do you want to remove this user?")
        //   .subscribe((data: boolean) => {
        //     console.log(data);
        //     if (data) {
        //       // this.api.approveUser(e.RegisterId, status);
        //       this.apiInput = new ApiInput();
        //       this.apiInput.stationId = Number(this.selectedStation);
        //       this.registeredUsers(this.apiInput);
        //     } else {
        //       this.swServ.showErrorMessage("Canelled", "");
        //     }
        //   });

        // async () => {
        //   await this.swServ
        //     .getpromise()
        //     .then((data: boolean) => {
        //       console.log(data);
        //       // this.api.approveUser(e.RegisterId, status);
        //       this.apiInput = new ApiInput();
        //       this.apiInput.stationId = Number(this.selectedStation);
        //       this.registeredUsers(this.apiInput);
        //     })
        //     .catch(() => {
        //       this.swServ.showErrorMessage("Canelled", "");
        //     });
        // };
      }
    }
  }
  openApproveForm(regId: number, stationId: number) {
    const config2 = new MatDialogConfig();
    config2.disableClose = true;
    config2.autoFocus = true;
    config2.width = "60%";
    config2.closeOnNavigation = true;
    config2.data = {
      registerId: regId,
      stationId: stationId,
      token: this.usrToken
    };
    const dialogRef = this.dialog.open(ApproveemployeeComponent, config2);
    dialogRef.afterClosed().subscribe(result => {
      console.log("dialog result....");
      // this.ngOnInit();
      //  this.selectedStation="";
      //  this.employees.length =0;
      this.isreguser = true;
      this.apiInput = new ApiInput();
      this.apiInput.stationId = Number(this.selectedStation);
      this.registeredUsers(this.apiInput);

      // if (result.status) {
      // } else {
      // }
    });
  }
  onSalCreate(val: any) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.width = "60%";
    config.closeOnNavigation = true;
    config.data = {
      empId: val.target.id
    };
    this.dialog.open(SalaryslipComponent, config);
  }
  // getstaticEmployees() {
  //   const emp: Employee = new Employee();
  //   const errorTitle: string = "INVALID INPUT!!!";
  //   emp.EmployeeId = 10001;
  //   emp.FirstName = "Ram";
  //   emp.LastName = "k";
  //   emp.MiddleName = "";
  //   emp.Phone = "62463732424";

  //   emp.Age = 29;

  //   emp.BloodGroup = "O+";
  //   emp.Gender = "m";
  //   emp.Marital = "married";

  //   emp.Address1 = "D.NO2-65";
  //   emp.Address2 = "pragathi nagar";
  //   emp.Place = "atp";
  //   emp.State = "AP";
  //   // emp.PostalCode = ;
  //   emp.AAdharNumber = "236264657";
  //   emp.PANNumber = "Aj24u23985";
  //   emp.Guard_FullName = "Ramdas";

  //   emp.Gaurd_PhoneNumber = "5353463473";
  //   emp.DOB = "09-09-1990";
  //   emp.DOJ = "09-09-2020";
  //   emp.Designation = "Office Assisstnat";
  //   emp.StationCode = "gtkl";
  //   emp.LocationName = "Guntakal";
  //   emp.DLLRStatus = "NO";
  //   emp.VehicleNumber = "";
  //   emp.DLLRNumber = "";
  //   emp.BankAccountNumber = "35643637537";
  //   emp.BankName = "Kotak";
  //   emp.IFSCCode = "KTKB43523";
  //   emp.BranchName = "Madhapur";

  //   return emp;
  // }
}
