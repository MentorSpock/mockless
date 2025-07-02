import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MocklessPanelComponent } from './mockless-panel.component';

describe('MocklessPanelComponent', () => {
  let component: MocklessPanelComponent;
  let fixture: ComponentFixture<MocklessPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MocklessPanelComponent]
    });
    fixture = TestBed.createComponent(MocklessPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
