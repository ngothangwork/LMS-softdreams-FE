import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login-page/components/login-page';
import { HomeComponent } from './features/home/pages/home-pages/home';

import { BookListComponent } from './features/book/pages/book-list-pages/book-list';
import { BookCreateComponent } from './features/book/pages/book-create-pages/book-create';
import { BookUpdateComponent } from './features/book/pages/book-update-pages/book-update';
import { BookCustomerListComponent } from './features/book/pages/book-customer-list-page/book-customer-list';
import { BookDetailComponent } from './features/book/pages/book-detail-pages/book-detail';

import { AuthorCreateComponent } from './features/author/pages/author-create-pages/author-create';
import { AuthorListComponent } from './features/author/pages/author-list-pages/author-list';
import { AuthorUpdateComponent } from './features/author/pages/author-update-pages/author-update';

import { CategoryCreateComponent } from './features/category/pages/category-create-page/category-create';
import { CategoryListComponent } from './features/category/pages/category-list-pages/category-list';

import { PublisherCreateComponent } from './features/publisher/pages/publisher-create-pages/publisher-create';
import { PublisherUpdateComponent } from './features/publisher/pages/publisher-update-pages/publisher-update';
import { PublisherListComponent } from './features/publisher/pages/publisher-list-page/publisher-list';
import {MainManagerComponent} from './features/manager/layout/main-manager';
import {AuthGuard} from './auth-guard';
import {BookDetailManagerComponent} from './features/book/pages/book-detail-manager-pages/book-detail-manager';
import {BorrowListComponent} from './features/borrow/pages/borrow-list-pages/borrow-list';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },

  {
    path: 'manager',
    component: MainManagerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'LIBRARIAN'] },
    children: [
      { path: 'books', component: BookListComponent, data: { roles: ['ADMIN', 'LIBRARIAN'] } },
      { path: 'books/create', component: BookCreateComponent, data: { roles: ['ADMIN', 'LIBRARIAN'] } },
      { path: 'books/update/:id', component: BookUpdateComponent, data: { roles: ['ADMIN', 'LIBRARIAN'] } },
      { path: 'books/detail/:id', component: BookDetailManagerComponent, data: { roles: ['ADMIN', 'LIBRARIAN'] } },

      { path: 'authors', component: AuthorListComponent, data: { roles: ['ADMIN'] } },
      { path: 'authors/create', component: AuthorCreateComponent, data: { roles: ['ADMIN'] } },
      { path: 'authors/update/:id', component: AuthorUpdateComponent, data: { roles: ['ADMIN'] } },

      { path: 'categories', component: CategoryListComponent, data: { roles: ['ADMIN'] } },
      { path: 'categories/create', component: CategoryCreateComponent, data: { roles: ['ADMIN'] } },

      { path: 'publishers', component: PublisherListComponent, data: { roles: ['ADMIN'] } },
      { path: 'publishers/create', component: PublisherCreateComponent, data: { roles: ['ADMIN'] } },
      { path: 'publishers/update/:id', component: PublisherUpdateComponent, data: { roles: ['ADMIN'] } },

      { path: 'borrows', component: BorrowListComponent, data: { roles: ['ADMIN', 'LIBRARIAN'] } },

      { path: '', redirectTo: 'books', pathMatch: 'full' }
    ]
  },


  { path: 'books/customer', component: BookCustomerListComponent },
  { path: 'books/customer/:id', component: BookListComponent },
  { path: 'books/customer/detail/:id', component: BookDetailComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
