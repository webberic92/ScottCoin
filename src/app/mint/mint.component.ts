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
    console.log()
    if (isNaN(Number(e))) {
      this.numToBuy = '0'
      this.totalPrice = '0'
    } else {
      this.numToBuy = String(e);
      this.totalPrice = (Number(this.numToBuy) * .001).toFixed(4)
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
