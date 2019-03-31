import { RouterModule, Routes } from "@angular/router";
import { NgModule }             from '@angular/core';
import { ExportComponent } from "./export/export.component"
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component"


const routes: Routes = [
  { path: "export", component: ExportComponent },
  { path: '',   redirectTo: '/export', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes,  { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}