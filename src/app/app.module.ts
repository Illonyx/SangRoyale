import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule }    from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';


import { AppComponent } from './app.component';
import { ExportComponent } from './export/export.component'

import { AppRoutingModule } from "./app-routing.module";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
	imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    FormsModule, ReactiveFormsModule,
    AppRoutingModule, 
    HttpClientModule, 
    MatCardModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatProgressBarModule, MatNativeDateModule, MatDatepickerModule, MatInputModule

  ],
  declarations: [
    AppComponent, 
    ExportComponent, PageNotFoundComponent
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
