import { Component, OnInit, Inject, Optional } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import { Employee } from "../../models/employee";
@Component({
  selector: "app-salaryslip",
  templateUrl: "./salaryslip.component.html",
  styleUrls: ["./salaryslip.component.css"]
})
export class SalaryslipComponent implements OnInit {
  salForm: FormGroup;
  month: number;
  empId: number = 0;
  emp: Employee;
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];
  //sending data
  constructor(@Inject(MAT_DIALOG_DATA) public data, private _fb: FormBuilder) {
    this.empId = data.empId;
    //console.log(this.empId);
  }

  ngOnInit() {
    //
    this.initForm();
  }
  initForm() {
    this.salForm = this._fb.group({
      ctc: new FormControl(""),
      conv: new FormControl({ value: "", disabled: true }),
      basic: new FormControl({ value: "", disabled: true }),
      hra: new FormControl({ value: "", disabled: true }),
      unre: new FormControl({ value: "", disabled: true }),
      spaw: new FormControl({ value: "", disabled: true }),
      netsal: new FormControl({ value: "", disabled: true }),
      mctc: new FormControl({ value: "", disabled: true }),
      grat: new FormControl({ value: "", disabled: true })
    });
  }
  onSubmit() {}
  focusOutFunction(val, event) {}
}
