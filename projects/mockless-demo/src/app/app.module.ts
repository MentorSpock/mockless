import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpHandler, HttpBackend } from '@angular/common/http';
import { MockHttpHandlerFactory, MocklessModule, MocklessPanelComponent } from 'mockless';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';


const routes: Routes = [
  { path: 'mockless', component: MocklessPanelComponent },
  { path: '', component: DemoComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MocklessModule,
    FormsModule,
    RouterModule.forRoot(routes)
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
