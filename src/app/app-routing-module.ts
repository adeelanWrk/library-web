import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksOverviewPageComponent } from './features/books/pages/books-overview-page/books-overview-page.component';
import { BooksGridPageComponent } from './features/books/pages/books-grid-page/books-grid-page.component';
import { AuthorsGridPageComponent } from './features/authors/components/authors-grid-page/authors-grid-page.component';
import { BooksOverviewMuiComponent } from './features/books/pages/books-overview-mui/books-overview-mui.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: BooksOverviewPageComponent }, 
  { path: 'authors', component: AuthorsGridPageComponent }, 
  { path: 'books', component: BooksGridPageComponent },
  { path: 'overview-mui', component: BooksOverviewMuiComponent },
  { path: '**', redirectTo: '/overview' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }