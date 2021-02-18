import { Component, OnInit } from '@angular/core';
import {Environment} from '../environment';
@Component({
  selector: 'app-abtus',
  templateUrl: './abtus.component.html',
  styleUrls: ['./abtus.component.css']
})
export class AbtusComponent implements OnInit {
  homeDeliveryPic : string = '';
aboutUsTextHead : string = '';
aboutUsText : string = '';
  constructor() { }

  ngOnInit() {
    this.homeDeliveryPic = Environment.HomeDeliveryPic;
    this.aboutUsTextHead = Environment.AboutusTextHeading;
    this.aboutUsText = Environment.AboutUsDescription;
  }

}