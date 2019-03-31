import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { ExportComponent } from './export/export.component'

import { AppRoutingModule } from "./app-routing.module";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
	imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule
  ],
  declarations: [
    AppComponent, 
    ExportComponent, PageNotFoundComponent
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
