import { NgModule } from '@angular/core';
import { RecordViewerComponent } from './record-viewer/record-viewer.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    RecordViewerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RecordViewerComponent
  ]
})
export class MocklessModule { }
