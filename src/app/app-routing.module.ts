import { RouterModule, Routes } from "@angular/router";
import { NgModule }             from '@angular/core';
import { ExportComponent } from "./export/export.component"
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component"
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: "export", component: ExportComponent },
  {path : 'home', component : HomeComponent},
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes,  { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}