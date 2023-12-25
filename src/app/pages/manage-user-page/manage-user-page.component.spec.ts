import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserPageComponent } from './manage-user-page.component';

describe('ManageUserPageComponent', () => {
  let component: ManageUserPageComponent;
  let fixture: ComponentFixture<ManageUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
