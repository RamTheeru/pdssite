import { Component, OnInit,Input } from '@angular/core';
//import { transition, style, animate, trigger } from '@angular/animations';

// const enterTransition = transition(':enter', [
//   style({
//     opacity: 0
//   }),
//   animate('1s ease-in', style({
//     opacity: 1
//   }))
// ]);

// const leaveTrans = transition(':leave', [
//   style({
//     opacity: 1
//   }),
//   animate('1s ease-out', style({
//     opacity: 0
//   }))
// ])

// const fadeIn = trigger('fadeIn', [
//   enterTransition
// ]);

// const fadeOut = trigger('fadeOut', [
//   leaveTrans
//  ]);
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
  //   animations: [
  //    fadeIn,
  //    fadeOut
  //  ]
})
export class LoadingComponent implements OnInit {
 @Input('deliver') loading:boolean = false;

  constructor() {

   }

  ngOnInit() {
    

  }

}