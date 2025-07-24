import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksOverviewPageComponent } from './features/books/pages/books-overview-page/books-overview-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: BooksOverviewPageComponent }, 
  // { path: 'summary', component: BooksSummaryPageComponent }, 
  { path: '**', redirectTo: '/overview' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }