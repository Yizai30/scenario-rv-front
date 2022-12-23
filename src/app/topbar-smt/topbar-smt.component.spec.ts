import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarSmtComponent } from './topbar-smt.component';

describe('TopbarSmtComponent', () => {
  let component: TopbarSmtComponent;
  let fixture: ComponentFixture<TopbarSmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopbarSmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarSmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
