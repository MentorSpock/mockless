import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpHandler, HttpBackend } from '@angular/common/http';
import { MockHttpHandlerFactory } from 'mockless';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HttpHandler,
      useFactory: MockHttpHandlerFactory,
      deps: [HttpBackend]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
