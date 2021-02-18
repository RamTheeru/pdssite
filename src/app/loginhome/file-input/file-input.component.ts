import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "file-input",
  templateUrl: "file-input.component.html"
})
export class FileInputComponent {
  @ViewChild("labelImport")
  labelImport: ElementRef;

  formImport: FormGroup;
  fileToUpload: File = null;

  constructor() {
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
  }
}
