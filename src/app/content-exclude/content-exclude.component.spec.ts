import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentExcludeComponent } from './content-exclude.component';

describe('ContentExcludeComponent', () => {
  let component: ContentExcludeComponent;
  let fixture: ComponentFixture<ContentExcludeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentExcludeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentExcludeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
