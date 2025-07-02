import { NgModule } from '@angular/core';
import { RecordViewerComponent } from './record-viewer/record-viewer.component';
import { CommonModule } from '@angular/common';
import { MocklessPanelComponent } from './mockless-panel/mockless-panel.component';
import { FormsModule } from '@angular/forms';
import { ApiMakerComponent } from './api-maker/api-maker.component';



@NgModule({
  declarations: [
    RecordViewerComponent,
    ApiMakerComponent,
    MocklessPanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MocklessPanelComponent
  ]
})
export class MocklessModule { }
