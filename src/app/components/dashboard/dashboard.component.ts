import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectIsLoggedIn } from '../../state/selector/auth.selectors';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user$: Observable<any>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private store: Store<{ user: any; auth: { isLoggedIn: boolean } }>,
  ) {
    this.user$ = this.store.select((state) => state.user.user);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }
}
