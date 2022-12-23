import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarExcludeComponent } from './topbar-exclude.component';

describe('TopbarExcludeComponent', () => {
  let component: TopbarExcludeComponent;
  let fixture: ComponentFixture<TopbarExcludeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopbarExcludeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarExcludeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
