import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiMakerComponent } from './api-maker.component';

describe('ApiMakerComponent', () => {
  let component: ApiMakerComponent;
  let fixture: ComponentFixture<ApiMakerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApiMakerComponent]
    });
    fixture = TestBed.createComponent(ApiMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
