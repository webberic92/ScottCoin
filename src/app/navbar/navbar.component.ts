import { Component, OnInit } from '@angular/core';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() {
    // document.body.addEventListener('click', toggleHamburger(), true);
  }

  ngOnInit(): void {
  }

}


