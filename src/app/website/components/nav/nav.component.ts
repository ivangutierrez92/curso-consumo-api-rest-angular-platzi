import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriesService } from 'src/app/services/categories.service';

import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  user: User | null = null;
  activeMenu = false;
  counter = 0;
  categories: Category[] = [];

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
    });
    this.getAllCategories();
    this.authService.user$.subscribe((data) => (this.user = data));
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService.loginAndGet('maria@mail.com', '12345').subscribe({
      next: () => (this.router.navigate(['/profile'])),
    });
  }

  getAllCategories() {
    this.categoriesService
      .getAll()
      .subscribe({ next: (data) => (this.categories = data) });
  }

  logout() {
    this.authService.logout();
    this.user = null;
    this.router.navigate(['/home']);
  }
}
