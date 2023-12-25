import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponentsComponent } from './calendar-components.component';

describe('CalendarComponentsComponent', () => {
  let component: CalendarComponentsComponent;
  let fixture: ComponentFixture<CalendarComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarComponentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
