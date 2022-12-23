import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCirculateComponent } from './app-circulate.component';

describe('AppCirculateComponent', () => {
  let component: AppCirculateComponent;
  let fixture: ComponentFixture<AppCirculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppCirculateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCirculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
