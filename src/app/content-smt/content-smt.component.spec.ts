import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSMTComponent } from './content-smt.component';

describe('ContentSMTComponent', () => {
  let component: ContentSMTComponent;
  let fixture: ComponentFixture<ContentSMTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentSMTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSMTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
