import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlatViewComponent } from './components/flat-view/flat-view.component';
import { NewFlatComponent } from './components/new-flat/new-flat.component';

@NgModule({
  declarations: [
    AppComponent,
    FlatViewComponent,
    NewFlatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
