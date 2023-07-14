import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotCompletedPopupComponent } from './not-completed-popup.component';

describe('NotCompletedPopupComponent', () => {
  let component: NotCompletedPopupComponent;
  let fixture: ComponentFixture<NotCompletedPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotCompletedPopupComponent]
    });
    fixture = TestBed.createComponent(NotCompletedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
