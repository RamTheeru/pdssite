import { Component, OnInit } from "@angular/core";
import { Environment } from "../environment";
import { ViewService } from "../view.service";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  img: string;
  constructor(private vServ: ViewService) {}

  ngOnInit() {
    this.img = Environment.MainLogo;
  }
}
