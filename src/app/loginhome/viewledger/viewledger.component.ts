import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  ElementRef,
  OnChanges,
  OnDestroy
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Station } from "../../models/station";
import { Ledger } from "../../models/ledger";
import { APIResult } from "../../models/apiresult";
import { ApiInput } from "../../models/apiinput";
import * as r from "rxjs";
import { PdsApiService } from "../../pds-api.service";
import { ViewService } from "../../view.service";
import { SweetService } from "../../sweet.service";
import { UserType } from "../../models/usertype";
import { Voucher } from "src/app/models/voucher";
@Component({
  selector: "app-viewledger",
  templateUrl: "./viewledger.component.html",
  styleUrls: ["./viewledger.component.css"]
})
export class ViewledgerComponent implements OnInit, OnChanges, OnDestroy {
  @Input("") userType: string;
  @ViewChildren("tablist") tablist;
  ledgerIds = [];
  vouchers:Voucher[]=[];
  isLedger: boolean = true;
  isLeVoucher : boolean = false;
  stations : Station[] = [];
  currentmonth : number = 0;
  usrToken:string="";
  private subsc: r.Subscription;
  private subsc2: r.Subscription;
  private subsc3: r.Subscription;
  private subsc4: r.Subscription;
  stationId : number=0;
  isLe: Boolean = false;
  isHe: Boolean = false;
  @Input("") fheVerify: string = "";
  isVerify: Boolean = false;
  fromDate: string = "";
  toDate: string = "";
  location: string = "";
  list = [];
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
  statuses = [{val:'P',name:'Pending'},{val:'A',name:'Approved'},{val:'R',name:'Rejected'},{val:'al',name:'All'}];
  userInfo: UserType;
  apiInput:ApiInput;
  activePage:number=1;
  totalCount: number = 0;
  pageCount: number = 1;
  pages = [];
  url:string="";
  load:boolean=false;
  vStatus:string="";
  //   {
  //     Id: 101,
  //     VoucherDate: "09-04-2021",
  //     VoucherNumber: "PDS/2021/GTKl/10/001",
  //     Particulars: "Petty Cash to Station-ops",
  //     Credit: "XXX",
  //     Debit: "XXX",
  //     Balance: "10000",
  //     Status: "A",
  //     VStatus: false,
  //     CheckVal: false
  //   },
  //   {
  //     Id: 102,
  //     VoucherDate: "09-09-2021",
  //     VoucherNumber: "PDS/2021/GTKl/10/002",
  //     Particulars: "Petty Cash to Station-ops",
  //     Credit: "XXX",
  //     Debit: "XXX",
  //     Balance: "9000",
  //     Status: "A",
  //     VStatus: false,
  //     CheckVal: false
  //   },
  //   {
  //     Id: 103,
  //     VoucherDate: "09-18-2021",
  //     VoucherNumber: "PDS/2021/GTKl/10/003",
  //     Particulars: "Petty Cash to Station-ops",
  //     Credit: "XXX",
  //     Debit: "XXX",
  //     Balance: "12000",
  //     Status: "R",
  //     VStatus: false,
  //     CheckVal: false
  //   }
  // ];
  constructor(
    private vServ: ViewService,
    private route: ActivatedRoute,
    private swServ: SweetService,
    private api :PdsApiService
  ) {
    // console.log(this.route.snapshot["_routerState"].url);
    //this.ngOnInit();
    route.paramMap.subscribe(val => {
     // this.ngOnInit();
      // put the code  When you want to router navigate on the same page and want to call ngOnInit()
    });
  }

  ngOnInit() {
    //viewvouchers
    this.url = this.route["_routerState"].snapshot.url;
    var vouch = this.url.indexOf("viewvouchers");
    var isHevouch = this.url.indexOf("verifyvouchers");
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
      this.userType = this.vServ.getValue("storedProp");
    }
    this.subsc2 = this.vServ.verify.subscribe((val: string) => {
      this.fheVerify = val;
    });
    if(this.fheVerify == ""||this.fheVerify == null || this.fheVerify == undefined)
    {
      this.fheVerify =this.vServ.getValue("fheverify");
    }
    this.subsc3 = this.vServ.utoken.subscribe((val: string) => {
      this.usrToken = val;
    });
    if (this.usrToken == null || this.usrToken == undefined || this.usrToken == "") {
      this.usrToken = this.vServ.getToken();
    }
    this.subsc4 = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue("userProp");
      this.userInfo = JSON.parse(u);
    }
    var index = this.userType.indexOf("le");
    if (index !== -1) {
      this.stationId = this.userInfo.stationId;
      this.isLe = true;
      if(vouch !== -1)
      {
        this.isLeVoucher = true;
      //  this.route.snapshot.queryParamMap.get('station');
      }else{
        this.isLeVoucher = false;
      }
      this.isVerify = false;
    } else {
      this.isHe = true;
      this.isLeVoucher = false;
      if (this.fheVerify == "fhe") {
        this.isVerify = true;
      } else {
        this.isVerify = false;
        
      }
      if(isHevouch !== -1){
        this.isVerify = true;
      }else{
        this.isVerify = false;
      }
    }
    if(this.isLe){
      if(this.stationId == 0 || this.stationId == undefined || this.stationId == null || this.stationId == NaN) 
      {
        this.swServ.showErrorMessage("Error!!", 'Unable to get station details, Please try again');
      }
    }
    // if(this.isLe == true && vouch !== -1)
    // {
    //     this.isLeVoucher = true;
    // }
  }
  getledgersbyMonth(event) {
    console.log(this.isLeVoucher) ;
    if (this.usrToken == "") {
      this.usrToken = this.vServ.getToken();
    }
    if(this.isHe)
    {
      this.stationId = Number(this.location);
    }
    if (this.currentmonth == 0 &&  this.isLe==true && this.isLeVoucher == false) {
      this.swServ.showErrorMessage("Invalid Input!!!", "Please Select Month");
      this.list = [];
    } else if (this.vStatus == "" && this.isLeVoucher == true) {
      this.swServ.showErrorMessage("Invalid Input!!!", "Please Select Voucher Status");
      this.list = [];
    } else if(this.stationId == 0 || this.stationId == undefined || this.stationId == null || this.stationId == NaN) 
    {
      this.swServ.showErrorMessage("Error!!", 'Unable to get station details, Please try again');
    } else if (
      this.usrToken == "" ||
      this.usrToken == undefined ||
      this.usrToken == null
    ) {
      this.handleUnauthorizedrequest();
    }  else {
      if(this.isLeVoucher)
      {
           if(this.toDate!="" && this.toDate != undefined && this.toDate != null)
          {
            
            this.apiInput = new ApiInput();
            if(this.vStatus == "al")
            {
              this.apiInput.status = "";
            }
            else{
              this.apiInput.status = this.vStatus;
            }
            
            this.apiInput.stationId = Number(this.stationId);
            this.apiInput.vEndDate = this.api.convert(this.toDate);
            //this.apiInput.currentmonth = this.currentmonth;
            console.log(this.apiInput);
            this.getvouchers(this.apiInput);
          }else{
            this.swServ.showErrorMessage(
              "Invalid Request!!!",
              "Please select Date!!!"
            );
          }
      }
      else{
        //console.log(this.stationId);
      this.apiInput = new ApiInput();
      if(this.isHe == true && this.isLe == false && this.toDate!="" && this.toDate != undefined && this.toDate != null && this.fromDate!="" && this.fromDate != undefined && this.fromDate != null)
      {
        this.apiInput.stationId = Number(this.stationId);
      //  this.apiInput.currentmonth = this.currentmonth;
        let  std = this.api.getmonthFromDate(this.fromDate);
        let  etd = this.api.getmonthFromDate(this.toDate);
        if(Number(std)==Number(etd))
        {
        this.apiInput.vEndDate = this.api.convert(this.toDate);
        this.apiInput.vstartDate = this.api.convert(this.fromDate);
        console.log(this.apiInput);
        if(this.isVerify)
        {
          this.apiInput.status = "P";
          this.getvouchers(this.apiInput);
        }
        else{
          this.getledgers(this.apiInput);
        }
        
        }else{
          this.swServ.showErrorMessage(
            "Invalid Request!!!",
            "Please select from and to Dates in same month!!!"
          ); 
        }
      }
      else if(this.isLe == true && this.isHe == false)
      {
        this.apiInput.stationId = Number(this.stationId);
        this.apiInput.currentmonth = this.currentmonth;
        console.log(this.apiInput);
        this.getledgers(this.apiInput);
      }
      else{
        this.swServ.showErrorMessage(
          "Invalid Request!!!",
          "Please select from and to Dates!!!"
        );
      }
      // if(this.toDate!="")
      // {
      //   this.apiInput.vEndDate = this.toDate;
      // }

      }
    }
  }
  getdata(val: number) {
    console.log(val);
    this.apiInput = new ApiInput();
    this.apiInput.page = val;
    this.activePage = val;
    this.apiInput.stationId = Number(this.stationId);

    if(this.isLe == true && this.isLeVoucher){
    //  this.apiInput.s
    this.apiInput.status = this.vStatus;
      this.apiInput.vEndDate = this.toDate;
      this.getvouchers(this.apiInput);
    }
    else{
      this.apiInput.currentmonth = this.currentmonth;
      this.getledgers(this.apiInput);
    }
    
  }
  ngOnChanges() {
    console.log("page reloading");
    // this.ngOnInit();
  }
  handleUnauthorizedrequest() {
    this.swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
    this.subsc3.unsubscribe();
    this.subsc4.unsubscribe();
  }
  getvouchers(input: ApiInput) {
    //this.load = true;
    this.api
      .getVouchers(input, this.usrToken)
      .subscribe((data: APIResult) => {
        let status = data.status;
        let message = data.message;
        if (status) {
         // this.load = false;
          this.list = data.vouchers;
          this.pageCount = data.queryPages;
          this.totalCount = data.queryTotalCount;
          this.pages = this.api.transform(this.pageCount);
          console.log(data);
    //          this.list.forEach(obj => {
    //   obj.VStatus = obj.Status == "A" ? true : false;
    // });
    if(this.list == undefined || this.list == null)
    {
      this.swServ.showMessage("Warning!","No records found for this request.");
  }else{
    if(this.list.length == 0){
      this.swServ.showMessage("Warning!","No records found for this request.");
    }
  }
        } else {
          this.swServ.showErrorMessage("Failure!!!", message);
        }
      });
  }
  getledgers(input: ApiInput) {
  //  this.load = true;
    this.api
      .getLedgersformonth(input, this.usrToken)
      .subscribe((data: APIResult) => {
        let status = data.status;
        let message = data.message;
        if (status) {
        //  this.load = false;
          this.list = data.ledgers;
          this.pageCount = data.queryPages;
          this.totalCount = data.queryTotalCount;
          this.pages = this.api.transform(this.pageCount);
          console.log(data);
          if(this.list == undefined || this.list == null)
          {
            this.swServ.showMessage("Warning!","No records found for this request.");
        }else{
          if(this.list.length == 0){
            this.swServ.showMessage("Warning!","No records found for this request.");
          }
        }
        } else {
          this.swServ.showErrorMessage("Failure!!!", message);
        }
      });
  }
  onAccept() {
    // // filter only checked element;
    this.vouchers.length = 0;
    const cbsChecked = this.tablist._results.filter(cb => {
      return cb.nativeElement.checked;
    });

    for (var val2 of cbsChecked) {
      let i = Number(val2.nativeElement.id);
      let vochr = new Voucher();
  if(i===NaN||i==0||i==undefined){
    i=0;
  }
  vochr.VoucherId = i; 
  this.vouchers.push(vochr);
}
    if (this.vouchers.length > 0) {
      this.api.approvevouchers(this.vouchers,this.usrToken).subscribe(
        (data: APIResult) => {
          //console.log(data);
          let status: Boolean = data.status;
          let m: string = data.message;
          if (status) {
            this.swServ.showSuccessMessage("Success!!!", m);
           this.refreshVoucherList();
          } else {
            this.swServ.showErrorMessage("Error!!", m);
          }
        },
        err => {
          //console.log(err);
          this.swServ.showErrorMessage("Network Error!!!", err.message);
        }
      );
    } else {
      this.swServ.showErrorMessage(
        "Invalid Input!!",
        "Please Select atleast one of the CheckBoxes!!"
      );
    }
  }
  refreshVoucherList(){
    this.apiInput = new ApiInput();
    this.apiInput.stationId = Number(this.stationId);
    this.apiInput.vEndDate = this.api.convert(this.toDate);
    this.apiInput.vstartDate = this.api.convert(this.fromDate);
    this.apiInput.status = "P";
    this.apiInput.page = this.activePage;
    this.getvouchers(this.apiInput);
  }
  onReject() {
    this.vouchers.length = 0;
    const cbsChecked = this.tablist._results.filter(cb => {
      return cb.nativeElement.checked;
    });

    for (var val2 of cbsChecked) {
      let i = Number(val2.nativeElement.id);
      let vochr = new Voucher();
  if(i===NaN||i==0||i==undefined){
    i=0;
  }
      vochr.VoucherId = i; 
      this.vouchers.push(vochr);

    }
    if (this.vouchers.length > 0) {
      this.api.rejectVouchers(this.vouchers,this.usrToken).subscribe(
        (data: APIResult) => {
          //console.log(data);
          let status: Boolean = data.status;
          let m: string = data.message;
          if (status) {
            this.refreshVoucherList();
            this.swServ.showSuccessMessage("Success!!!", m);
          } else {
            this.swServ.showErrorMessage("Error!!", m);
          }
        },
        err => {
          //console.log(err);
          this.swServ.showErrorMessage("Network Error!!!", err.message);
        }
      );
    } else {
      this.swServ.showErrorMessage(
        "Invalid Input!!",
        "Please Select atleast one of the CheckBoxes!!"
      );
    }
  }
  onDownload() {
    const cbsChecked = this.tablist._results.filter(cb => {
      return cb.nativeElement.checked;
    });

    for (var val2 of cbsChecked) {
      this.ledgerIds.push(val2.nativeElement.id);
    }
    if (this.ledgerIds.length > 0) {
    } else {
      this.swServ.showErrorMessage(
        "Invalid Input!!",
        "Please Select atleast one of the CheckBoxes!!"
      );
    }
  }
  toggleEditable(event) {
    if (event.target.checked) {
      event.target.value = true;
    }
  }
  getlist(event) {}
}
