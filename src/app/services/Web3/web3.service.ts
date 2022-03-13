import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import Web3 from "web3";

declare const window: any;


@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  window: any;
  currentRoute: any;
  private zone!: NgZone;

  constructor(private route: ActivatedRoute, private router: Router) {

    console.log(router.url);

    // router.events.filter((event: any) => event instanceof NavigationEnd)
    //   .subscribe((event: { url: any; }) => {
    //     this.currentRoute = event.url;
    //     console.log(event);
    //   });

    window.ethereum.on('accountsChanged', (accounts: string | any[]) => {
      // If user has locked/logout from MetaMask, this resets the accounts array to empty
      if (!accounts.length) {
        // logic to handle what happens once MetaMask is locked
        console.log("Changed.... not detected.")
        // location.reload();
        location.reload()
      }
      console.log("Changed.... new Address detected " + accounts[0])
      // location.reload();
      location.reload()
    });


  }
  private getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return [];
    }
  }

  public openMetamask = async () => {
    window.web3 = new Web3(window.ethereum);
    let addresses = await this.getAccounts();
    if (!addresses.length) {
      try {
        addresses = await window.ethereum.enable();
      } catch (e) {
        throw e;
      }
    }
    return addresses.length ? addresses[0] : null;
  };

  // reload() {

  // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  // this.router.onSameUrlNavigation = 'reload';
  // this.router.navigate(['./'], { relativeTo: this.route });
  // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  // this.router.onSameUrlNavigation = 'reload';
  // this.window.reload();
  // this.router.navigate(['./' + this.router.url], { relativeTo: this.route })
  //   this.zone.run(() => this.router.navigateByUrl('/' + this.router.url))
  // }
  // this.router.navigate(['./' + this.router.url])


  // }
}


