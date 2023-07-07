import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedPopupComponent } from './completed-popup.component';

describe('CompletedPopupComponent', () => {
  let component: CompletedPopupComponent;
  let fixture: ComponentFixture<CompletedPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletedPopupComponent]
    });
    fixture = TestBed.createComponent(CompletedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
