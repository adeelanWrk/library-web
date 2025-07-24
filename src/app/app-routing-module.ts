import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksOverviewPageComponent } from './features/books/pages/books-overview-page/books-overview-page.component';
import { BooksGridPageComponent } from './features/books/pages/books-grid-page/books-grid-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: BooksOverviewPageComponent }, 
  // { path: 'summary', component: BooksSummaryPageComponent }, 
  { path: 'books', component: BooksGridPageComponent },
  { path: '**', redirectTo: '/overview' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }