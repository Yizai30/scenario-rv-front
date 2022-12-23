import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarCirculateComponent } from './topbar-circulate.component';

describe('TopbarCirculateComponent', () => {
  let component: TopbarCirculateComponent;
  let fixture: ComponentFixture<TopbarCirculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopbarCirculateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarCirculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
