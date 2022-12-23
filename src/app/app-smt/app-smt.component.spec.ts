import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSmtComponent } from './app-smt.component';

describe('AppSmtComponent', () => {
  let component: AppSmtComponent;
  let fixture: ComponentFixture<AppSmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
