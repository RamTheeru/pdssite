import { Injectable } from "@angular/core";
import swal from "sweetalert2";
import * as R from "rxjs";
import { PdsApiService } from "./pds-api.service";

@Injectable()
export class SweetService {
  r: Promise<boolean>;
  constructor() {}

  showSuccessMessage(title, text = "") {
    swal(title, text, "success");
  }
  showErrorMessage(title, text = "") {
    swal(title, text, "error");
  }
  showMessage(title, text = "") {
    swal(title, text, "warning");
  }

  showWarning(text, obj?: any): R.Observable<boolean> {
    let r: Promise<boolean>;
    let result = false;
    swal({
      title: "Are you sure?",
      text: text,
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true
    }).then(willDelete => {
      if (willDelete.value) {
        result = true;
        // r = new Promise<boolean>((resolve,reject) => {
        //   if (willDelete.value) {
        // resolve(true);
        // }else{
        //   reject(false);
        // });
        // if (willDelete.value) {
        //   result = true;
        //   this.r = new Promise<boolean>((resolve, reject) => {
        //     if (result) {
        //       resolve(result);
        //     } else {
        //       reject(result);
        //     }
        //   });
      } else {
        result = false;
        // this.r = new Promise<boolean>((resolve, reject) => {
        //   if (result) {
        //     reject(result);
        //   }
        // });
      }
    });
    return R.Observable.create(observer => {
      observer.next(result);
      observer.complete();
    });
    //this.r = await this.setpromise(result);
    // await this.setpromise(result);
    // await (() => {
    //   return result;
    // });
    // this.r = new Promise<boolean>((resolve, reject) => {
    //   if (result) {
    //     resolve(result);
    //   } else {
    //     reject(result);
    //   }
    // });
    // return this.r;
  }
  setpromise(val: boolean) {
    // console.log("Entered first function");
    return new Promise((resolve, reject) => {
      if (val) {
        resolve(val);
      } else {
        reject(val);
      }
    });
  }
  // getpromise() {
  //   return this.r;
  // }
}
