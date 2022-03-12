import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  numToBuy: string = '0';
  totalPrice: string = '0';
  test: string = ''

  updatePrice(e: Event) { // without type info
    this.test = ''
    console.log("event " + e)
    this.numToBuy = String(e);
    this.totalPrice = (Number(this.numToBuy) * .001).toFixed(4)
    if (Number(this.numToBuy) >= 100000000000) {
      this.numToBuy = '0'
      this.totalPrice = '0'
    }
    if (isNaN(Number(this.totalPrice))) {
      console.log(this.totalPrice)
      this.numToBuy = '0';
      this.totalPrice = '0'
    }


  }


  buy() {
    console.log("BUY " + this.numToBuy + " For " + this.totalPrice + " BNB")
    this.test = "BUY " + this.numToBuy + " For " + this.totalPrice + " BNB"


  }


  // changeFn(e: { target: { value: string; }; }) {
  //   this.foo = e.target.value;
  // }
  // modelChangeFn(e: Event) {
  //   this.bar = String(e);
  // }
}
