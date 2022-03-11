import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  // murderGang = () => {
  //   this.router.navigateByUrl('/murderGang');
  // };
  mint = () => {
    this.router.navigateByUrl('/mint');
  };
  manage = () => {
    this.router.navigateByUrl('/manage');
  };

  team = () => {
    this.router.navigateByUrl('/team');
  };

  roadmap = () => {
    this.router.navigateByUrl('/roadmap');
  };
}

