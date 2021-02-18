import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { SweetService } from "./sweet.service";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private swServ: SweetService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isAuth()) {
      this.swServ.showErrorMessage(
        "Failed!!",
        "You are not authorized to see this page!!!"
      );
    }
    return this.auth.isAuth();
  }
}
