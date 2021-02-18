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
import { Ledger } from "../../models/ledger";
import * as r from "rxjs";
import { ViewService } from "../../view.service";
import { SweetService } from "../../sweet.service";
@Component({
  selector: "app-viewledger",
  templateUrl: "./viewledger.component.html",
  styleUrls: ["./viewledger.component.css"]
})
export class ViewledgerComponent implements OnInit, OnChanges, OnDestroy {
  @Input("") userType: string;
  @ViewChildren("tablist") tablist;
  ledgerIds = [];
  private subsc: r.Subscription;
  private subsc2: r.Subscription;
  isLe: Boolean = false;
  isHe: Boolean = false;
  @Input("") fheVerify: string = "";
  isVerify: Boolean = false;
  fromDate: string = "";
  toDate: string = "";
  location: string = "";
  list: Ledger[] = [
    {
      Id: 101,
      VoucherDate: "09-04-2021",
      VoucherNumber: "PDS/2021/GTKl/10/001",
      Particulars: "Petty Cash to Station-ops",
      Credit: "XXX",
      Debit: "XXX",
      Balance: "10000",
      Status: "A",
      VStatus: false,
      CheckVal: false
    },
    {
      Id: 102,
      VoucherDate: "09-09-2021",
      VoucherNumber: "PDS/2021/GTKl/10/002",
      Particulars: "Petty Cash to Station-ops",
      Credit: "XXX",
      Debit: "XXX",
      Balance: "9000",
      Status: "A",
      VStatus: false,
      CheckVal: false
    },
    {
      Id: 103,
      VoucherDate: "09-18-2021",
      VoucherNumber: "PDS/2021/GTKl/10/003",
      Particulars: "Petty Cash to Station-ops",
      Credit: "XXX",
      Debit: "XXX",
      Balance: "12000",
      Status: "R",
      VStatus: false,
      CheckVal: false
    }
  ];
  constructor(
    private vServ: ViewService,
    private route: ActivatedRoute,
    private swSwrv: SweetService
  ) {
    // console.log(this.route.snapshot["_routerState"].url);
    //this.ngOnInit();
    route.paramMap.subscribe(val => {
      this.ngOnInit();
      // put the code  When you want to router navigate on the same page and want to call ngOnInit()
    });
  }

  ngOnInit() {
    this.list.forEach(obj => {
      obj.VStatus = obj.Status == "A" ? true : false;
    });
    this.subsc = this.vServ.data.subscribe((val: string) => {
      this.userType = val;
    });

    this.subsc2 = this.vServ.verify.subscribe((val: string) => {
      this.fheVerify = val;
    });

    var index = this.userType.indexOf("le");
    if (index !== -1) {
      this.isLe = true;
      this.isVerify = false;
    } else {
      this.isHe = true;
      if (this.fheVerify == "fhe") {
        this.isVerify = true;
      } else {
        this.isVerify = false;
      }
    }
  }
  ngOnChanges() {
    console.log("page reloading");
    // this.ngOnInit();
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
  }
  onAccept() {
    // // filter only checked element;
    const cbsChecked = this.tablist._results.filter(cb => {
      return cb.nativeElement.checked;
    });

    for (var val2 of cbsChecked) {
      this.ledgerIds.push(val2.nativeElement.id);
    }
    if (this.ledgerIds.length > 0) {
    } else {
      this.swSwrv.showErrorMessage(
        "Invalid Input!!",
        "Please Select atleast one of the CheckBoxes!!"
      );
    }
  }
  onReject() {
    const cbsChecked = this.tablist._results.filter(cb => {
      return cb.nativeElement.checked;
    });

    for (var val2 of cbsChecked) {
      this.ledgerIds.push(val2.nativeElement.id);
    }
    if (this.ledgerIds.length > 0) {
    } else {
      this.swSwrv.showErrorMessage(
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
      this.swSwrv.showErrorMessage(
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
