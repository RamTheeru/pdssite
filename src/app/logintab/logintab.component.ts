import { Component, OnInit } from '@angular/core';
import {Environment} from '../environment';
@Component({
  selector: 'app-logintab',
  templateUrl: './logintab.component.html',
  styleUrls: ['./logintab.component.css']
})
export class LogintabComponent implements OnInit {
   loginIcon : string = '';
  constructor() { }

  ngOnInit() {
    this.loginIcon = Environment.LoginIcon;
  }

}