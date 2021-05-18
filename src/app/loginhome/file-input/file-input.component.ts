import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PdsApiService } from "../../pds-api.service";
import { SweetService } from "../../sweet.service";
import { APIResult } from "../../models/apiresult";
@Component({
  selector: "file-input",
  templateUrl: "file-input.component.html"
})
export class FileInputComponent {
  @ViewChild("labelImport")
  labelImport: ElementRef;

  formImport: FormGroup;
  fileToUpload: File = null;

  constructor(private api:PdsApiService,private swServ:SweetService) {
    this.formImport = new FormGroup({
      importFile: new FormControl("", Validators.required)
    });
  }

  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(", ");
    this.fileToUpload = files.item(0);
  }

  import(): void {
    console.log("import " + this.fileToUpload.name);
    var formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
   this.api.uploadAttendanceFile(formData).subscribe(
    (data: APIResult) => {
      //console.log(data);
      let status: Boolean = data.status;
      let m: string = data.message;
      if (status) {
        //this.stations = data.stations;
        this.swServ.showSuccessMessage("Success!!", m);
      } else {
        this.swServ.showErrorMessage("Error!!", m);
      }
    },
    err => {
      //console.log(err.message);
      this.swServ.showErrorMessage("Network Error!!!", err.message);
    }
   )
  }
}
