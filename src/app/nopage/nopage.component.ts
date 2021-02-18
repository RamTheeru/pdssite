import { Component, OnInit } from "@angular/core";
import { Environment } from "../environment";
@Component({
  selector: "app-nopage",
  templateUrl: "./nopage.component.html",
  styleUrls: ["./nopage.component.css"]
})
export class NopageComponent implements OnInit {
  img: string;
  constructor() {}

  ngOnInit() {
    this.img = Environment.NoFoundPic;
  }
}
