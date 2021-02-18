import { Component, OnInit } from "@angular/core";
import { Environment } from "../../environment";
@Component({
  selector: "app-logindefaulthome",
  templateUrl: "./logindefaulthome.component.html",
  styleUrls: ["./logindefaulthome.component.css"]
})
export class LogindefaulthomeComponent implements OnInit {
  img: string;
  constructor() {}

  ngOnInit() {
    this.img = Environment.MainLogo;
  }
}
