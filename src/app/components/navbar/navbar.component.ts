import { Component, OnInit } from '@angular/core';
import bscContract from "src/app/services/Solidity/contract.service"

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  contractName: string = '';

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.contractName = await bscContract.methods.name().call()
    } catch (e) {
      console.log(e)

    }
  }

}


