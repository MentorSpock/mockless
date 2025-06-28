import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpHandler, HttpBackend } from '@angular/common/http';
import { MockHttpHandlerFactory, MocklessModule, RecordViewerComponent } from 'mockless';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ApiMakerComponent } from './api-maker/api-maker.component';


const routes: Routes = [
  { path: 'mockless-records', component: RecordViewerComponent },
  { path: '', component: ApiMakerComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ApiMakerComponent
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
