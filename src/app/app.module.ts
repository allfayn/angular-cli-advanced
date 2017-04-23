import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ServiceWorkerService } from './shared/service-worker.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ServiceWorkerModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [ServiceWorkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
