import { Component, OnInit,Input } from '@angular/core';
//import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-scrolling',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.css']
  // animations: [
  //   trigger('scroll', [
  //     state('on', style({left: '-100px'})),
  //     transition('* => *', [
  //       style({left: '-100px'}),
  //       animate(10000, style({left: '100%'}))
  //     ])
  //   ])
  // ]
})
export class ScrollingComponent implements OnInit {
 @Input('txt') text :string ='';
 state = 0;

  scrollDone() {
    this.state++;
  }
  constructor() { }

  ngOnInit() {
  }

}