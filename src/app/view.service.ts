import { Injectable } from "@angular/core";
import { UserType } from "./models/usertype";
import { AuthService } from "./auth.service";
import * as r from "rxjs";

@Injectable()
export class ViewService {
  //view = new r.Subject<Boolean>();
  usr: UserType;
  utoken = new r.BehaviorSubject<string>("");
  data = new r.BehaviorSubject<string>("");
  verify = new r.BehaviorSubject<string>("");
  verify2 = new r.BehaviorSubject<string>("");
  verify3 = new r.BehaviorSubject<string>("");
  userInfo = new r.BehaviorSubject<UserType>(new UserType());
  constructor() {
    let verifyval = localStorage.getItem("fheverify");
    if (verifyval == undefined || verifyval == "" || verifyval == null)
      this.setVerify(verifyval, true);
    else this.setVerify(verifyval, false);

    let verifyval2 = localStorage.getItem("edleverify");
    if (verifyval2 == undefined || verifyval2 == "" || verifyval2 == null)
      this.setVerify(verifyval2, true);
    else this.setVerify(verifyval2, false);

    let verifyval3 = localStorage.getItem("evheverify");
    if (verifyval3 == undefined || verifyval3 == "" || verifyval3 == null)
      this.setVerify(verifyval3, true);
    else this.setVerify(verifyval3, false);

    let verifyval4 = localStorage.getItem("hrvheverify");
    if (verifyval4 == undefined || verifyval4 == "" || verifyval4 == null)
      this.setVerify(verifyval4, true);
    else this.setVerify(verifyval4, false);

    let storedProp = localStorage.getItem("storedProp");
    if (storedProp == undefined || storedProp == "" || storedProp == null)
      this.setValue(storedProp, true);
    else this.setValue(storedProp, false);

    let usrtoken = localStorage.getItem("usrtoken");
    if (usrtoken == undefined || usrtoken == "" || usrtoken == null)
      this.setToken(usrtoken, true);
    else this.setToken(usrtoken, false);

    var u = localStorage.getItem("userProp");
    this.usr = JSON.parse(u);
    if (this.usr == null || this.usr == undefined) this.setUser(this.usr, true);
    else this.setUser(this.usr, false);
  }
  setValue(val: string, storeProp: boolean = true) {
    this.data = new r.BehaviorSubject<string>("");
    if (storeProp) localStorage.setItem("storedProp", val);
    this.data.next(val);
  }
  setToken(val: string, urtoken: boolean = true) {
    this.utoken = new r.BehaviorSubject<string>("");
    if (urtoken) localStorage.setItem("usrtoken", val);
    this.utoken.next(val);
  }
  setUser(obj: UserType, val: boolean = true) {
    // sfdgfsaf
    this.userInfo = new r.BehaviorSubject<UserType>(new UserType());
    if (val) localStorage.setItem("userProp", JSON.stringify(obj));
    this.userInfo.next(obj);
  }
  getToken() {
    let tkn: string = "";
    tkn = localStorage.getItem("usrtoken");
    return tkn;
  }
  getValue(key) {
    return localStorage.getItem(key);
  }
  removeValue(key: string) {
    localStorage.removeItem(key);
    if (key == "fheverify") this.verify.next("");
    else if (key == "edleverify") this.verify.next("");
    else if (key == "evheverify") this.verify2.next("");
    else if (key == "hrvheverify") this.verify3.next("");
    else if (key == "storedProp") this.data.next("");
    else if (key == "usrtoken") this.utoken.next("");
    else if (key == "userProp") this.userInfo.next(new UserType());
  }
  setVerify(val: string, storeProp: boolean = true) {
    // this.verify = new r.BehaviorSubject<string>("");
    if (storeProp && val == "fhe") {
      localStorage.setItem("fheverify", val);
      this.verify.next(val);
    } else if (storeProp && val == "edle") {
      localStorage.setItem("edleverify", val);
      this.verify.next(val);
    } else if (storeProp && val == "evhe") {
      localStorage.setItem("evheverify", val);
      this.verify2.next(val);
    } else if (storeProp && val == "hrvhe") {
      localStorage.setItem("hrvheverify", val);
      this.verify3.next(val);
    }

    //hkugk
  }

  // setValue(value: string) {
  //   this.data.next(value);
  // }
  // getValue() {
  //   return this.data;
  // }
  //value = true;
  // updateView(val){
  //     this.view.next(val);
  // }
}
