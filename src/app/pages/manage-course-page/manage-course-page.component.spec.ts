import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCoursePageComponent } from './manage-course-page.component';

describe('ManageCoursePageComponent', () => {
  let component: ManageCoursePageComponent;
  let fixture: ComponentFixture<ManageCoursePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCoursePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCoursePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
