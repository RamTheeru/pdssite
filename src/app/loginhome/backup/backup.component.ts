import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { SweetService } from "../../sweet.service";
import { ViewService } from "../../view.service";
import { PdsApiService } from "../../pds-api.service";
import { APIResult } from "../../models/apiresult";
import { DbBackupInfo } from "../../models/dbbackupinfo";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
@Component({
  selector: "app-backup",
  templateUrl: "./backup.component.html",
  styleUrls: ["./backup.component.css"]
})
export class BackupComponent implements OnInit, OnDestroy {
  backups: DbBackupInfo[] = [];
  tkn: string = "";
  load: boolean = false;
  private subsc: Subscription;
  constructor(
    private api: PdsApiService,
    private vServ: ViewService,
    private router: Router,
    private _swServ: SweetService
  ) {}

  ngOnInit() {
    this.subsc = this.vServ.utoken.subscribe((val: string) => {
      this.tkn = val;
    });
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.tkn = this.vServ.getToken();
    }
    this.api.getBackups(this.tkn).subscribe(
      (data: APIResult) => {
        console.log(data);
        let status: Boolean = data.status;
        let m: string = data.message;
        if (status) {
          this.backups = data.dbBackups;
        } else {
          this._swServ.showErrorMessage("Error!!", m);
        }
        if (this.backups.length > 0) {
          this.backups.forEach(el => {
            el.fileName = el.fileName.replace(".sql", "");
          });
        }
      },
      err => {
        //console.log(err.message);
        this._swServ.showErrorMessage("Network Error!!!", err.message);
      }
    );
  }
  handleUnauthorizedrequest() {
    this._swServ.showErrorMessage(
      "Invalid Request!!!",
      "Unable to process request with invalid token, Please login again!!!"
    );
  }
  restore(evnt, val) {
    // var nam = evnt.target.id;
    // console.log(nam);
    //console.log(val);
    var nam = val.filePath;
    console.log(nam);
    if (this.tkn == null || this.tkn == undefined || this.tkn == "") {
      this.handleUnauthorizedrequest();
    } else if (nam !== "" || nam !== undefined || nam !== null) {
      swal({
        title: "Are you sure?",
        text: "Do you want to restore database with this file?",
        type: "warning",
        showConfirmButton: true,
        showCancelButton: true
      }).then(willDelete => {
        if (willDelete.value) {
          this.load = true;
          this.api.restore(nam, this.tkn).subscribe(
            (data: APIResult) => {
              console.log(data);
              this.load = false;
              let status: Boolean = data.status;
              let m: string = data.message;
              if (status) {
                this._swServ.showSuccessMessage("Sucess!!", m);
                this.router.navigate([`/login`]);
              } else {
                this._swServ.showErrorMessage("Error!!", m);
              }
            },
            err => {
              //console.log(err.message);
              this._swServ.showErrorMessage("Network Error!!!", err.message);
            }
          );
        } else {
          this._swServ.showErrorMessage("Canelled", "");
        }
      });
    } else {
      this._swServ.showErrorMessage(
        "Error!!",
        "unable to restore, misssing file path"
      );
    }
  }
  ngOnDestroy() {
    this.subsc.unsubscribe();
  }
}
