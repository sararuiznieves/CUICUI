import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CUICUI';
  email: string | null = null;
  name: string | null = null;
  avatar: string | null = null;

  constructor(private router: Router) {
    this.loadUserData();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUserData();
      });
  }

  private loadUserData(): void {
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.avatar = localStorage.getItem('avatar');
    console.log('APP name:', this.name);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout(): void {
    localStorage.removeItem('userSessionId');
    localStorage.removeItem('email');
    localStorage.removeItem('name');

    this.email = null;
    this.name = null;

    this.router.navigate(['/login']);
  }
}