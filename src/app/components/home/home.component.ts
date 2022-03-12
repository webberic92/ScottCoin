import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { decrement, increment, reset } from 'src/app/store/actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private store: Store<{ count: number }>) {
    this.count$ = store.select('count');
  }
  ngOnInit(): void {
  }

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




  count$: Observable<number> | undefined


  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }

}

