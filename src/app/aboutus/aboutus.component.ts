import { Component, OnInit } from '@angular/core';
import {Environment} from '../environment';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
vmPic : string = '';
visionHead : string = '';
visionText : string = '';
missionHead : string = '';
missionText : string = '';
  constructor() { }

  ngOnInit() {
     this.vmPic = Environment.VMPicture;
     this.visionHead = Environment.VisionHeading;
     this.visionText = Environment.VisionText;
     this.missionHead = Environment.MissionHeading;
     this.missionText = Environment.MissionText;
  }

}