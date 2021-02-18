import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Employee } from "../../models/employee";
import { APIResult } from "../../models/apiresult";
import { Station } from "../../models/station";
import { UserType } from "../../models/usertype";
import { PdsApiService } from "../../pds-api.service";
import { Profession } from "../../models/profession";
import { SweetService } from "../../sweet.service";
import { ViewService } from "../../view.service";
import * as r from "rxjs";
var emp: Employee = new Employee();
@Component({
  selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styleUrls: ["./create-employee.component.css"]
})
export class CreateEmployeeComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input("") userType: string;
  professions: Profession[];
  @ViewChild("someInput") someInput: ElementRef;
  url: string = "";
  stations: Station[];
  stationId: number = 0;
  private subsc: r.Subscription;
  private subsc2: r.Subscription;
  private subsc3: r.Subscription;
  private subsc4: r.Subscription;
  checkMarried: boolean = false;
  checkUnMarried: boolean = false;
  checkPermanent: boolean = false;
  checkContract: boolean = false;
  usrToken: string = "";
  userInfo: UserType;
  fvalid: boolean = true;
  edleVerify: string = "";
  isEdle: Boolean = true;
  isLe: Boolean = false;
  isHe: Boolean = false;
  apiResult: APIResult;
  tab1Id = "pills-home";
  tab2Id = "pills-profile";
  tab3Id = "pills-contact";
  hidPrev: Boolean = true;
  hidNext: Boolean = false;
  empId: number;
  formText: string = "Create Employee Form:";
  editMode = false;
  indiView = false;
  activeTab: number;
  childClassess = [];
  empForm2: FormGroup;
  hidTab1: Boolean = false;
  hidTab2: Boolean = true;
  hidTab3: Boolean = true;
  maritals = ["married", "unmarried"];
  empTypes = ["permanent", "contract"];
  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private api: PdsApiService,
    private swServ: SweetService,
    private vServ: ViewService
  ) {
    this.initForm();
    if (this.editMode) {
      this.formText = "Edit CDA Form:";
    } else {
      this.formText = "Enroll CDA  Form:";
    }
  }
  onCancel() {
    //
    this.initForm();
  }
  ngAfterViewInit() {
    //console.log("ElementRef");
    this.childClassess = this.someInput.nativeElement.children;

    for (var val of this.childClassess) {
      //console.log(val.id)
      //console.log(val.className)
      var index = val.className.indexOf("active");
      if (this.tab1Id == val.id && index !== -1) {
        this.activeTab = 1;
        this.showtab(1);
        this.hidPrev = true;
        this.hidNext = false;
      } else if (this.tab2Id == val.id && index !== -1) {
        this.activeTab = 2;
        this.showtab(2);
        this.hidPrev = false;
        this.hidNext = false;
      } else if (this.tab3Id == val.id && index !== -1) {
        this.activeTab = 3;
        this.showtab(3);
        this.hidPrev = false;
        this.hidNext = true;
      }
      // if (this.isEdle) {
      //   if (this.tab1Id == val.id && index !== -1) {
      //     this.activeTab = 1;
      //     this.showtab(1);
      //     this.hidPrev = true;
      //     this.hidNext = false;
      //   } else if (this.tab2Id == val.id && index !== -1) {
      //     this.activeTab = 2;
      //     this.showtab(2);
      //     this.hidPrev = false;
      //     this.hidNext = false;
      //   } else if (this.tab3Id == val.id && index !== -1) {
      //     this.activeTab = 3;
      //     this.showtab(3);
      //     this.hidPrev = false;
      //     this.hidNext = true;
      //   }
      // } else {
      //   if (this.tab1Id == val.id && index !== -1) {
      //     this.activeTab = 1;
      //     this.showtab(1);
      //     this.hidPrev = false;
      //     this.hidNext = false;
      //   } else if (this.tab2Id == val.id && index !== -1) {
      //     this.activeTab = 2;
      //     this.showtab(2);
      //     this.hidPrev = false;
      //     this.hidNext = false;
      //   }
      // }
    }
  }
  onchangetab(text: string) {
    if (text == "p") {
      this.activeTab = this.activeTab - 1;
    } else {
      this.activeTab = this.activeTab + 1;
    }
    if (this.activeTab == 3) {
      this.hidPrev = false;
      this.hidNext = true;
    } else if (this.activeTab == 1) {
      this.hidPrev = true;
      this.hidNext = false;
    } else if (this.activeTab == 2) {
      this.hidPrev = false;
      this.hidNext = false;
    }
    // if (this.isEdle) {
    //   if (text == "p") {
    //     this.activeTab = this.activeTab - 1;
    //   } else {
    //     this.activeTab = this.activeTab + 1;
    //   }
    //   if (this.activeTab == 3) {
    //     this.hidPrev = false;
    //     this.hidNext = true;
    //   } else if (this.activeTab == 1) {
    //     this.hidPrev = true;
    //     this.hidNext = false;
    //   } else if (this.activeTab == 2) {
    //     this.hidPrev = false;
    //     this.hidNext = false;
    //   }
    // } else {
    //   if (text == "p") {
    //     this.activeTab = 2;
    //     this.activeTab = this.activeTab - 1;
    //   } else {
    //     this.activeTab = 1;
    //     this.activeTab = this.activeTab + 1;
    //   }
    //   this.hidPrev = false;
    //   this.hidNext = false;
    // }

    // console.log(this.activeTab);
    this.showtab(this.activeTab);
  }

  showtab(tabNum) {
    if (tabNum == 1) {
      this.hidTab1 = false;
      this.hidTab2 = true;
      this.hidTab3 = true;
    } else if (tabNum == 2) {
      this.hidTab1 = true;
      this.hidTab2 = false;
      this.hidTab3 = true;
    } else if (tabNum == 3) {
      this.hidTab1 = true;
      this.hidTab2 = true;
      this.hidTab3 = false;
    }
  }

  ngOnInit() {
    this.url = this.route["_routerState"].snapshot.url;

    var index = this.url.indexOf("createdelivery");
    if (index !== -1) {
      //  this.isreguser = false;
    } else {
      //this.isreguser = true;
    }
    this.api.getConstants().subscribe(
      (data: APIResult) => {
        //console.log(data);
        let status: Boolean = data.status;
        let m: string = data.message;
        if (status) {
          this.stations = data.stations;
          this.professions = data.professions;
        } else {
          this.swServ.showErrorMessage("Error!!", m);
        }
      },
      err => {
        //console.log(err.message);
        this.swServ.showErrorMessage("Network Error!!!", err.message);
      }
    );
    this.hidTab1 = false;
    this.hidTab2 = true;
    this.hidTab3 = true;
    this.subsc3 = this.vServ.userInfo.subscribe((res: UserType) => {
      this.userInfo = res;
    });
    this.subsc = this.vServ.data.subscribe((val: string) => {
      this.userType = val;
    });

    this.subsc2 = this.vServ.verify.subscribe((val: string) => {
      this.edleVerify = val;
    });
    this.subsc4 = this.vServ.utoken.subscribe((val: string) => {
      this.usrToken = val;
    });
    if (this.userInfo == null || this.userInfo == undefined) {
      var u = this.vServ.getValue("userProp");
      this.userInfo = JSON.parse(u);
    }
    //console.log(this.userInfo);
    this.stationId = this.userInfo.stationId;
    var index = this.userType.indexOf("le");
    if (index !== -1) {
      this.isLe = true;
      this.isHe = false;
      this.isEdle = true;
      // console.log("edle : " + this.edleVerify);
      // if (this.edleVerify == "edle") {
      //   this.isEdle = false;
      //   this.hidPrev = false;
      //   this.hidNext = false;
      //   this.showtab(1);
      // } else {
      //   this.isEdle = true;
      // }
    } else {
      this.isHe = true;
      this.isEdle = false;
    }
    this.route.params.subscribe((params: Params) => {
      this.empId = +params["id"];
      let vw = this.route.url["_value"];
      let str = vw[0].path;
      let index = str.indexOf("individual");
      // console.log(index);
      // if(index!=="-1")
      // {
      //   this.showbtns = true;
      // }
      // else{
      //   this.showbtns = false;
      // }
      this.editMode = params["id"] != null;
      this.initForm();
    });
  }
  private initForm() {
    let staVal = {};
    if (this.stationId > 0) {
      staVal = new FormControl(
        this.stations.find(e => e.stationId == this.stationId)
      );
    } else {
      staVal = new FormControl("");
    }
    if (this.editMode) {
      let eDate = new FormControl(new Date("09/15/1990"));
      this.empForm2 = this._fb.group({
        firstName: new FormControl("testfirst"),
        lastName: new FormControl("testlast"),
        middleName: new FormControl("middleNametest"),
        birthdate: eDate, //new FormControl('09/15/1990'),
        joindate: eDate, //new FormControl('09/15/2020'),
        //  day: new FormControl(),
        //   month: new FormControl(''),
        //    year: new FormControl(),
        age: new FormControl("28"),
        bg: new FormControl("BPositive"),
        gender: new FormControl("male"),
        married: new FormControl(),
        unmarried: new FormControl("true"),
        permanent: new FormControl("true"),
        contract: new FormControl(),
        // mars:new FormArray([]),
        ad1: new FormControl("testad1"),
        ad2: new FormControl("testad2"),
        place: new FormControl("testplace"),
        state: new FormControl("teststate"),
        postal: new FormControl("testpostal"),
        aad: new FormControl("aadtest"),
        pan: new FormControl("pantest"),
        //typs : new FormArray([]),
        phone: new FormControl("313131"),
        gName: new FormControl("stestgnamde"),
        gphone: new FormControl("313131"),
        //    day2: new FormControl(),
        // month2: new FormControl(''),
        //  year2: new FormControl(),
        // ut: new FormControl(''),
        // desg: new FormControl("Su"),
        empc: new FormControl("Emp123"),
        //prof: new FormControl("3"),
        station: staVal, //new FormControl(staVal),
        location: new FormControl("testloaction"),
        account: new FormControl("3242533"),
        ifsc: new FormControl("ICIC21421"),
        bank: new FormControl("ICIC"),
        bbranch: new FormControl("Hitech"),
        veh: new FormControl("testvehicle"),
        dllr: new FormControl("testdl"),
        dlstat: new FormControl("DL")
      });
    } else {
      this.empForm2 = this._fb.group({
        firstName: new FormControl(),
        lastName: new FormControl(),
        middleName: new FormControl(),
        birthdate: new FormControl(),
        joindate: new FormControl(),
        //  day: new FormControl(),
        //   month: new FormControl(''),
        //    year: new FormControl(),
        age: new FormControl(),
        bg: new FormControl(),
        // prof: new FormControl(""),
        gender: new FormControl(""),
        married: new FormControl(),
        unmarried: new FormControl(),
        permanent: new FormControl(),
        contract: new FormControl(),
        // mars:new FormArray([]),
        ad1: new FormControl(),
        ad2: new FormControl(),
        place: new FormControl(),
        state: new FormControl(),
        postal: new FormControl(),
        aad: new FormControl(),
        pan: new FormControl(),
        phone: new FormControl(),
        //typs : new FormArray([]),
        gName: new FormControl(),
        gphone: new FormControl(),
        empc: new FormControl(),
        //    day2: new FormControl(),
        // month2: new FormControl(''),
        //  year2: new FormControl(),
        //   ut: new FormControl(''),
        // desg: new FormControl(""),
        station: staVal,
        location: new FormControl(),
        account: new FormControl(),
        ifsc: new FormControl(),
        bank: new FormControl(),
        bbranch: new FormControl(),
        veh: new FormControl(),
        dllr: new FormControl(),
        dlstat: new FormControl("")
      });
    }
  }
  onSubmit() {
    const errorTitle: string = "INVALID INPUT!!!";
    //this.loaded = true;
    // const selectedmaritals = this.empForm.value.mars
    //   .map((checked, i) => checked ? this.maritals[i].name : null)
    //   .filter(v => v !== null);
    //   console.log('checkboxes')
    //   console.log(selectedmaritals);

    //   const selectempTypes = this.empForm.value.typs
    //   .map((checked, i) => checked ? this.empTypes[i].name : null)
    //   .filter(v => v !== null);
    //   console.log('checkboxes')
    //   console.log(selectempTypes);
    emp.FirstName = this.empForm2.value["firstName"];
    emp.LastName = this.empForm2.value["lastName"];
    emp.MiddleName = this.empForm2.value["middleName"];
    emp.Phone = this.empForm2.value["phone"];
    //  emp.Day = this.empForm2.value['day'];
    //  emp.Month = this.empForm2.value['month'];
    //  emp.Year = this.empForm2.value['year'];

    emp.EmpAge = this.empForm2.value["age"];
    emp.BloodGroup = this.empForm2.value["bg"];
    emp.Gender = this.empForm2.value["gender"];
    let db = this.convert(this.empForm2.value["birthdate"]);
    let dj = this.convert(this.empForm2.value["joindate"]);
    let st = this.empForm2.value["station"];
    // let prf = this.empForm2.value["prof"];
    //  if(selectedmaritals.length>0)
    //  {
    //   emp.Marital = selectedmaritals[0];
    //   if(emp.Marital == "Married"){
    //     emp.MaritalStatus = true;
    //   }
    //   else{emp.MaritalStatus= false;}
    //  }
    //  else{
    //    emp.MaritalStatus= false;
    //      var txt = '';
    //     var f = 'Employee Marital Status';
    //      this.showrequiredMessage(f,'',errorTitle);
    //    }

    //  if(selectempTypes.length>0)
    //  {
    //     emp.Employeetype = selectempTypes[0];
    //     if(emp.Employeetype == "Permanent"){
    //     emp.IsPermanent = true;
    //   }
    //   else{emp.IsPermanent= false;}
    //  }
    //  else
    //  {
    //    emp.IsPermanent= false;
    //     var txt = '';
    //     var f = 'Employee Type ';
    //     this.showrequiredMessage(f,'',errorTitle);

    //    }

    emp.Address1 = this.empForm2.value["ad1"];
    emp.Address2 = this.empForm2.value["ad2"];
    emp.Place = this.empForm2.value["place"];
    emp.State = this.empForm2.value["state"];
    emp.PostalCode = this.empForm2.value["postal"];
    emp.AAdharNumber = this.empForm2.value["aad"];
    emp.PANNumber = this.empForm2.value["pan"];
    emp.Gaurd_FirstName = this.empForm2.value["gName"];
    emp.UserName = emp.FirstName;
    emp.Gaurd_PhoneNumber = this.empForm2.value["gphone"];
    emp.DOB = db;
    emp.DOJ = dj;
    emp.StationId = st.stationId;
    emp.StationCode = st.stationCode;
    emp.PId = 3;
    //this.empForm2.value["birthdate"]; //this.empForm2.value["joindate"];
    // emp.Day2 = this.empForm2.value['day2'];
    // emp.Month2 = this.empForm2.value['month2'];
    // emp.Year2 = this.empForm2.value['year2'];
    //  emp.LoginType = this.empForm2.value["ut"];
    // emp.Designation = this.empForm2.value["desg"];empc
    emp.EmpCode = this.empForm2.value["empc"];
    // emp.StationCode = this.empForm2.value["station"];
    emp.LocationName = this.empForm2.value["location"];
    emp.DLLRStatus = this.empForm2.value["dlstat"];
    emp.VehicleNumber = this.empForm2.value["veh"];
    emp.DLLRNumber = this.empForm2.value["dllr"];
    emp.BankAccountNumber = this.empForm2.value["account"];
    emp.BankName = this.empForm2.value["bank"];
    emp.IFSCCode = this.empForm2.value["ifsc"];
    emp.BranchName = this.empForm2.value["bbranch"];
    console.log("on submit.....");

    if (
      emp.LocationName == "" ||
      emp.LocationName == null ||
      emp.LocationName == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Location Name", "", errorTitle);
    } else if (
      emp.StationId == 0 ||
      emp.StationCode == "" ||
      emp.StationId == null ||
      emp.StationCode == "" ||
      emp.StationId == undefined ||
      emp.StationCode == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Station", "", errorTitle);
    } else if (
      emp.PId == 0 ||
      emp.PId == NaN ||
      emp.PId == null ||
      emp.PId == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Profession Type", "", errorTitle);
    }
    // else {
    //   this.showrequiredMessage("Employee User Name", emp.UserName, errorTitle);
    // }
    else if (emp.DOJ == "" || emp.DOJ == null || emp.DOJ == undefined) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Date Of Join", "", errorTitle);
    } else if (
      emp.Employeetype == "" ||
      emp.Employeetype == null ||
      emp.Employeetype == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Type Status", "", errorTitle);
    } else if (
      emp.Marital == "" ||
      emp.Marital == null ||
      emp.Marital == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Marital Status", "", errorTitle);
    } else if (this.checkContract == true && this.checkPermanent == true) {
      this.fvalid = false;
      this.showrequiredMessage(
        "Employee Type Status",
        "Please Select Proper option",
        errorTitle
      );
    } else if (this.checkMarried == true && this.checkUnMarried == true) {
      this.fvalid = false;
      this.showrequiredMessage(
        "Employee Marital Status",
        "Please Select Proper option",
        errorTitle
      );
    } else if (
      emp.PANNumber == "" ||
      emp.PANNumber == null ||
      emp.PANNumber == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee PAN", "", errorTitle);
    } else if (
      emp.BankAccountNumber == "" ||
      emp.BankAccountNumber == null ||
      emp.BankAccountNumber == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Account Number", "", errorTitle);
    } else if (
      emp.BankName == "" ||
      emp.BankName == null ||
      emp.BankName == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Bank Name", "", errorTitle);
    } else if (
      emp.IFSCCode == "" ||
      emp.IFSCCode == null ||
      emp.IFSCCode == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee IFSC Code", "", errorTitle);
    } else if (
      emp.BranchName == "" ||
      emp.BranchName == null ||
      emp.BranchName == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Branch Name", "", errorTitle);
    } else if (
      emp.DLLRStatus == "" ||
      emp.DLLRStatus == null ||
      emp.DLLRStatus == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee DL/LLR Status", "", errorTitle);
    } else if (
      emp.DLLRNumber == "" ||
      emp.DLLRNumber == null ||
      emp.DLLRNumber == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage(
        "Employee Driving or Lisence Number",
        "",
        errorTitle
      );
    } else if (
      emp.VehicleNumber == "" ||
      emp.VehicleNumber == null ||
      emp.VehicleNumber == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Vehicle Number", "", errorTitle);
    } else if (
      emp.AAdharNumber == "" ||
      emp.AAdharNumber == null ||
      emp.AAdharNumber == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee AAdhar", "", errorTitle);
    } else if (
      emp.PostalCode == "" ||
      emp.PostalCode == null ||
      emp.PostalCode == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee PostalCode", "", errorTitle);
    } else if (emp.State == "" || emp.State == null || emp.State == undefined) {
      this.fvalid = false;
      this.showrequiredMessage("Employee State", "", errorTitle);
    } else if (emp.Place == "" || emp.Place == null || emp.Place == undefined) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Place", "", errorTitle);
    } else if (
      emp.Address1 == "" ||
      emp.Address2 == "" ||
      emp.Address1 == null ||
      emp.Address2 == null ||
      emp.Address1 == undefined ||
      emp.Address2 == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Address", "", errorTitle);
    } else if (emp.DOB == "" || emp.DOB == null || emp.DOB == undefined) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Date Of Birth", "", errorTitle);
    } else if (
      emp.Gender == "" ||
      emp.Gender == null ||
      emp.Gender == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Gender", "", errorTitle);
    } else if (
      emp.FirstName == "" ||
      emp.FirstName == null ||
      emp.FirstName == undefined
    ) {
      this.fvalid = false;
      this.showrequiredMessage("Employee First Name", "", errorTitle);
    } else if (emp.Phone == "" || emp.Phone == null || emp.Phone == undefined) {
      this.fvalid = false;
      this.showrequiredMessage("Employee Contact Number", "", errorTitle);
    } else if (
      emp.EmpAge == "" ||
      emp.EmpAge == null ||
      emp.EmpAge == undefined
    ) {
      //
      this.fvalid = false;
      this.showrequiredMessage("Employee AGE", "", errorTitle);
    } else if (this.fvalid) {
      if (this.usrToken == "") {
        this.usrToken = this.vServ.getToken();
      }
      if (
        this.usrToken == "" ||
        this.usrToken == undefined ||
        this.usrToken == null
      ) {
        this.handleUnauthorizedrequest();
      } else {
        this.submittoAPI(emp, this.usrToken);
      }
    } else {
      this.swServ.showErrorMessage(
        "Invalid Form!!",
        "Please Check Provided Details."
      );
    }

    console.log(JSON.stringify(emp));

    //  setTimeout(function(){
    //     this.loaded=false;

    //  },2000);
  }
  submittoAPI(employ, tkn: string): void {
    this.api.createDAemployee(employ, tkn).subscribe(
      (data: APIResult) => {
        //console.log(data);
        let status: Boolean = data.status;
        let m: string = data.message;
        if (status) {
          this.swServ.showSuccessMessage("Success!!!", m);
          emp = new Employee();
          this.initForm();
          // this.ngAfterViewInit();
          this.ngOnInit();
          this.activeTab = 1;
          this.showtab(1);
          this.hidPrev = true;
          this.hidNext = false;
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
  handleUnauthorizedrequest() {
    this.swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  focusOutFunction(field, event: any): void {
    const errorTitle: string = "INVALID INPUT!!!";
    var txt = event.target.value;
    if (field == "fname") {
      var f = "First Name";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "phone") {
      var f = "Employee Contact Number";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "age") {
      var f = "Employee AGE";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "ad1") {
      var f = "Employee Address";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "place") {
      var f = "Employee Place";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "state") {
      var f = "Employee State";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "post") {
      var f = "Employee PostalCode";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "aad") {
      var f = "Employee AAdhar Code";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "pan") {
      var f = "Employee PAN Number";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "usr") {
      var f = "Employee User Name";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "loc") {
      var f = "Employee Location Name";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "veh") {
      var f = "Employee Vehicle Number";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "dllr") {
      var f = "Employee Drving or Learning Liscense";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "acc") {
      var f = "Employee Bank Account Number";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "bank") {
      var f = "Employee Bank Name";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "ifsc") {
      var f = "Employee Bank IFSC Code";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "bb") {
      var f = "Employee Bank  Branch Name";
      this.showrequiredMessage(f, txt, errorTitle);
    } else if (field == "g") {
      var f = "Employee Location Name";
      this.fvalid = true;
    }
  }
  checkValue(event: any, field) {
    // console.log(event.checked);
    // console.log(event.source.value);

    const errorTitle: string = "INVALID INPUT!!!";
    if (field == "m") {
      let v = event.source.value;
      if (!event.checked) {
        var txt = "";
        this.checkMarried = false;
        this.checkUnMarried = false;
        var f = "Employee Marital Status";
        this.showrequiredMessage(f, "", errorTitle);
      } else {
        emp.Marital = v;
        if (v == "married") {
          this.checkMarried = true;
          emp.MaritalStatus = true;
        } else if (v == "unmarried") {
          this.checkUnMarried = true;
          emp.MaritalStatus = false;
        }
      }
    } else if (field == "e") {
      let v = event.source.value;
      if (!event.checked) {
        var txt = "";
        this.checkPermanent = false;
        this.checkContract = false;
        var f = "Employee Type Status";
        this.showrequiredMessage(f, "", errorTitle);
      } else {
        emp.Employeetype = v;
        if (v == "permanent") {
          this.checkPermanent = true;
          emp.IsPermanent = true;
        } else if (v == "contract") {
          this.checkContract = true;
          emp.IsPermanent = false;
        }
      }
    }
  }
  showrequiredMessage(field, txt, title) {
    var test = false;
    if (txt == "" || txt == null) {
      var msg = field + " " + " field required!!";
      this.fvalid = false;
      this.swServ.showErrorMessage(title, msg);
    } else if (field == "Employee Contact Number" || field == "Employee AGE") {
      var msg = field + " " + " contains Only Numbers!!";
      test = this.ValidateNumbers(txt);
      if (!test) {
        this.fvalid = false;
        this.swServ.showErrorMessage(title, msg);
      } else {
        this.fvalid = true;
      }
    } else if (
      field == "Employee Type Status" ||
      field == "Employee Marital Status"
    ) {
      this.fvalid = false;
      this.swServ.showErrorMessage(title, txt);
    } else if (field == "Employee User Name") {
      this.api.checkUserName(txt).subscribe(
        (data: APIResult) => {
          //   console.log(data);
          let status: Boolean = data.status;
          let m: string = data.message;
          if (status) {
            this.fvalid = true;
            this.swServ.showSuccessMessage("Success!!!", m);
          } else {
            this.fvalid = false;
            this.swServ.showErrorMessage("Error!!", m);
          }
        },
        err => {
          this.fvalid = false;
          this.swServ.showErrorMessage("Network Error!!!", err.message);
        }
      );
    } else {
      this.fvalid = true;
    }
  }

  ValidateNumbers(txt: string): boolean {
    var val = false;
    var regexp = new RegExp("^[0-9]+$");
    val = regexp.test(txt);
    return val;
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
    this.subsc2.unsubscribe();
    this.subsc3.unsubscribe();
    this.subsc4.unsubscribe();
  }
}
