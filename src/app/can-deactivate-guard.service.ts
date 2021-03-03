//import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CanDeactivate,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import swal from "sweetalert2";
// @Injectable({
//   providedIn: 'root'
// })
export interface CanComponentDeactivate {
  canDeactivate:()=>Observable<boolean>|Promise<boolean>|boolean;
}
export class CanDeactivateGuardService implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component :CanComponentDeactivate,currentRoute : ActivatedRouteSnapshot,currentState : RouterStateSnapshot,nextState?:RouterStateSnapshot):
  Observable<boolean>|Promise<boolean>|boolean{
    //return component.canDeactivate();
  //  this.location.go(currentState.url);
let result:boolean = false;
    swal({
      title: "If you refresh the page you willbe signed out.",
      text: 'Are you sure?',
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true
    }).then(willDelete => {
      if (willDelete.value) {
        result = true;
        return true;
      } else {
        result = false;
        return false;
      }
    });
   return false;
  }
  }