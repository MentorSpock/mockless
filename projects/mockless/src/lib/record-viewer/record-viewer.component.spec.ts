import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordViewerComponent } from './record-viewer.component';

describe('RecordViewerComponent', () => {
  let component: RecordViewerComponent;
  let fixture: ComponentFixture<RecordViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordViewerComponent]
    });
    fixture = TestBed.createComponent(RecordViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
