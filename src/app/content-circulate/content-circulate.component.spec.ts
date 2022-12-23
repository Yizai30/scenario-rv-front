import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCirculateComponent } from './content-circulate.component';

describe('ContentCirculateComponent', () => {
  let component: ContentCirculateComponent;
  let fixture: ComponentFixture<ContentCirculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentCirculateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCirculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
