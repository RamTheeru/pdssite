import { Component, OnInit, OnDestroy } from "@angular/core";
import { Employee } from "../../models/employee";
import { APIResult } from "../../models/apiresult";
import { PdsApiService } from "../../pds-api.service";
import { ApiInput } from "../../models/apiinput";
import { SweetService } from "../../sweet.service";
import { UserType } from "../../models/usertype";
import { PDFInput } from "../../models/pdfinput";
import { ViewService } from "../../view.service";
import * as r from "rxjs";
import swal from "sweetalert2";
import { saveAs } from "file-saver";
@Component({
  selector: "app-downloadinvoice",
  templateUrl: "./downloadinvoice.component.html",
  styleUrls: ["./downloadinvoice.component.css"]
})
export class DownloadinvoiceComponent implements OnInit, OnDestroy {
  showPath: boolean = false;
  usrToken: string = "";
  userInfo: UserType;
  selectedEmps = [];
  private subsc: r.Subscription;
  private subsc2: r.Subscription;
  path: string = "";
  pageCount: number = 1;
  filename: string = "CDAInvoice";
  pages = [];
  stationId: number = 0;
  totalCount: number = 0;
  load: boolean = false;
  currentmonth: number = 0;
  apiInput: ApiInput;
  employees: Employee[] = [];
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
  constructor(
    private swServ: SweetService,
    private api: PdsApiService,
    private vServ: ViewService
  ) {}
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
    } else if (this.stationId == 0) {
      this.swServ.showErrorMessage(
        "Something Went Wrong!!",
        "Unable to get Station, Please try again!!"
      );
    } else {
      swal({
        title: "Are you sure?",
        text:
          "Do you want to Download Invoice for all CDAs under this station?",
        type: "warning",
        showConfirmButton: true,
        showCancelButton: true
      }).then(willDelete => {
        if (willDelete.value) {
          this.apiInput = new ApiInput();
          this.apiInput.stationId = Number(this.stationId);
          this.apiInput.currentmonth = this.currentmonth;
          this.getemployees(this.apiInput);
        } else {
          this.swServ.showErrorMessage("Canelled", "");
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
  shwPath() {
    if (!this.showPath) {
      this.showPath = true;
    } else {
      this.currentmonth = 0;
      this.showPath = false;
    }
  }
  getemployees(input: ApiInput) {
    this.load = true;
    this.api
      .getCDADeliverylist(input, this.usrToken)
      .subscribe((data: APIResult) => {
        this.load = false;
        let status = data.status;
        let message = data.message;
        if (status) {
          this.employees = data.employees;
          this.pageCount = data.queryPages;
          this.totalCount = data.queryTotalCount;
          var index = this.filename.indexOf("-");
          if (index == -1) {
            this.filename = this.filename + "-" + data.employeeName;
          }
          //this.filename = this.filename + "-" + data.employeeName;
          this.pages = this.api.transform(this.pageCount);
          if (this.totalCount > 0) {
            let pdf = new PDFInput();
            this.selectedEmps.length = 0;
            pdf.emps = this.selectedEmps;
            pdf.forall = true;
            pdf.stationId = this.stationId;
            pdf.currentmonth = this.currentmonth;
            this.load = true;
            this.api
              .downloadpdffilesforemployees(pdf, this.usrToken)
              .subscribe(data => {
                this.load = false;
                console.log(data);
                if (data instanceof APIResult) {
                  let status = data.status;
                  let message = data.message;
                  if (status) {
                  } else {
                    this.swServ.showErrorMessage("Failure!!!", message);
                  }
                } else {
                  saveAs(data, this.filename);
                  this.swServ.showSuccessMessage(
                    "Success!!!",
                    "Zip file containing " +
                      this.totalCount.toString() +
                      "file(s) Downloaded Successfully"
                  );
                }
              });
          } else {
            this.swServ.showMessage(
              "Warning!!!",
              "No employees found to download file"
            );
          }
        } else {
          this.swServ.showErrorMessage("Failure!!!", message);
        }
        this.currentmonth = 0;
      });
  }
  ngOnInit() {
    this.subsc = this.vServ.utoken.subscribe((val: string) => {
      this.usrToken = val;
    });
    this.subsc2 = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue("userProp");
      this.userInfo = JSON.parse(u);
    }
    if (
      this.usrToken == "" ||
      this.usrToken == undefined ||
      this.usrToken == null
    ) {
      this.usrToken = this.vServ.getToken();
    }
    //console.log(this.userInfo);
    this.stationId = this.userInfo.stationId;
  }
  Onsub() {}
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
  }
}
