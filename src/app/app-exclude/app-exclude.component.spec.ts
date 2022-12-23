import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppExcludeComponent } from './app-exclude.component';

describe('AppExcludeComponent', () => {
  let component: AppExcludeComponent;
  let fixture: ComponentFixture<AppExcludeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppExcludeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppExcludeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
