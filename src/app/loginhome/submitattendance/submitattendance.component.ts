import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewService } from '../../view.service';
import { SweetService } from '../../sweet.service';
import { PdsApiService } from '../../pds-api.service';
import { APIResult } from '../../models/apiresult';
import { ApiInput } from '../../models/apiinput';
import { Station } from '../../models/station';
import { UserType } from '../../models/usertype';
import { saveAs } from 'file-saver';
import * as r from 'rxjs';
@Component({
  selector: 'app-submitattendance',
  templateUrl: './submitattendance.component.html',
  styleUrls: ['./submitattendance.component.css']
})
export class SubmitattendanceComponent implements OnInit, OnDestroy {
  userType: string;
  private subsc: r.Subscription;
  private subsc2: r.Subscription;
  private subsc3: r.Subscription;
  isLe: Boolean = false;
  isHe: Boolean = false;
  apiInput: ApiInput;
  isUpload: Boolean = false;
  usrToken: string = '';
  stations: Station[] = [];
  selectedMonth: string = '';
  location: string = '';
  month: number = 0;
  stationId: number = 0;
  userInfo: UserType;
  filename: string = '';
  yearmentioned: number = 0;
  year: string = '';
  months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'Febrauary' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ];
  constructor(
    private vServ: ViewService,
    private swServ: SweetService,
    private api: PdsApiService
  ) {}

  ngOnInit() {
    this.subsc = this.vServ.data.subscribe((val: string) => {
      this.userType = val;
    });
    this.subsc2 = this.vServ.utoken.subscribe((val: string) => {
      this.usrToken = val;
    });
    this.subsc3 = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue('userProp');
      this.userInfo = JSON.parse(u);
    }
    this.api.getConstants().subscribe(
      (data: APIResult) => {
        //console.log(data);
        let status: Boolean = data.status;
        let m: string = data.message;
        if (status) {
          this.stations = data.stations;
        } else {
          this.swServ.showErrorMessage('Error!!', m);
        }
      },
      err => {
        //console.log(err.message);
        this.swServ.showErrorMessage('Network Error!!!', err.message);
      }
    );

    // this.subsc2 = this.vServ.verify3.subscribe((val: string) => {
    //   this.hruaheVerify = val;
    // });
    var index = this.userType.indexOf('le');
    if (index !== -1) {
      this.isLe = true;
      this.isHe = false;
      this.stationId = this.userInfo.stationId;
    } else {
      this.isHe = true;
      this.isLe = false;
      // if (this.hruaheVerify == "hruahe") {
      //   this.isUpload = true;
      // } else {
      //   this.isUpload = false;
      // }
    }
  }
  onDownloadle() {
    let currentDate = new Date();
    let cmonth = this.api.getmonthFromDate(currentDate);
    this.month = Number(cmonth);
    this.yearmentioned = currentDate.getFullYear();
    if (this.month > 0 && this.month != NaN && this.month != undefined) {
      if (
        this.stationId == 0 ||
        this.stationId == undefined ||
        this.stationId == null ||
        this.stationId == NaN
      ) {
        this.swServ.showErrorMessage(
          'Error!!',
          'Unable to get station details'
        );
      } else {
        if (
          this.usrToken == '' ||
          this.usrToken == undefined ||
          this.usrToken == null
        ) {
          this.usrToken = this.vServ.getToken();
        }
        if (
          this.usrToken == '' ||
          this.usrToken == undefined ||
          this.usrToken == null
        ) {
          this.handleUnauthorizedrequest();
        } else {
          let monthName = this.months[this.month - 1];
          this.apiInput = new ApiInput();
          this.apiInput.stationId = this.stationId;
          this.apiInput.currentmonth = this.month;
          this.dowloadfile(
            this.apiInput,
            this.usrToken,
            this.stationId,
            monthName.name,
            this.yearmentioned
          );
        }
      }
    } else {
      this.swServ.showErrorMessage(
        'Error!!',
        'Unable to get current month details'
      );
    }
  }
  onDownload() {
    this.month = Number(this.selectedMonth);
    this.stationId = Number(this.location);
    this.yearmentioned = Number(this.year);
    let currentDate = new Date();
    let cyear = 0;
    if (
      this.yearmentioned == 0 ||
      this.yearmentioned == 2 ||
      this.yearmentioned == NaN
    ) {
      cyear = currentDate.getFullYear();
    } else {
      let yearId = this.yearmentioned == 1 ? 1 : 0;
      cyear = currentDate.getFullYear() - yearId;
    }
    if (this.month > 0 && this.month != NaN && this.month != undefined) {
      if (
        this.stationId == 0 ||
        this.stationId == undefined ||
        this.stationId == null ||
        this.stationId == NaN
      ) {
        this.swServ.showErrorMessage('Error!!', 'Please Select Location');
      } else {
        if (
          this.usrToken == '' ||
          this.usrToken == undefined ||
          this.usrToken == null
        ) {
          this.usrToken = this.vServ.getToken();
        }
        if (
          this.usrToken == '' ||
          this.usrToken == undefined ||
          this.usrToken == null
        ) {
          this.handleUnauthorizedrequest();
        } else {
          let monthName = this.months[this.month - 1];

          this.apiInput = new ApiInput();
          this.apiInput.stationId = this.stationId;
          this.apiInput.currentmonth = this.month;
          this.apiInput.currentYear = this.yearmentioned;
          this.dowloadfile(
            this.apiInput,
            this.usrToken,
            this.stationId,
            monthName.name,
            cyear
          );
        }
      }
    } else {
      this.swServ.showErrorMessage('Error!!', 'Please Select Month');
    }
  }
  dowloadfile(input, tkn, stationId, monthName, yearname) {
    this.api.downloadattedancefileforStation(input, tkn).subscribe(data => {
      console.log(data);
      if (data instanceof APIResult) {
        let status = data.status;
        let message = data.message;
        if (status) {
          this.swServ.showWarning(message);
        } else {
          this.swServ.showErrorMessage('Failure!!!', message);
        }
      } else {
        console.log(this.stations);
        console.log(stationId);
        // let stCode = this.stations.forEach(s => {
        //   if (s.stationId == stationId) {
        //     console.log(s.stationCode);
        //     return s.stationCode;
        //   }
        // });
        let stCode = this.stations.find(s => s.stationId == stationId)
          .stationCode;
        console.log(stCode);
        this.filename = stCode + '-' + monthName + '-' + yearname + '.xlsx';
        saveAs(data, this.filename);
        this.swServ.showSuccessMessage(
          'Success!!!',
          'File Dowloaded Successfully!!'
        );
      }
    });
  }
  handleUnauthorizedrequest() {
    this.swServ.showErrorMessage(
      'Invalid Request!!!',
      'Unable to process request with invalid token, Please login again!!!'
    );
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
    this.subsc3.unsubscribe();
  }
}
