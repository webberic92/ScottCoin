import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { updateAddress, clearAddress } from 'src/app/store/actions';
import { Store } from '@ngrx/store';
import { Web3Service } from 'src/app/services/web3.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private store: Store<{ address: string }>, private web3: Web3Service) {
    this.address$ = store.select('address')
  }

  ngOnInit(): void {
  }



  address$: Observable<string> | undefined




  async updateAddress() {
    await this.web3.openMetamask().then(async (resp: any) => {
      this.store.dispatch(updateAddress({ address: resp }));
    })

  }

  clearAddress() {
    this.store.dispatch(clearAddress());
  }

}


