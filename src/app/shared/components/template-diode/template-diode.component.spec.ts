import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDiodeComponent } from './template-diode.component';

describe('TemplateDiodeComponent', () => {
  let component: TemplateDiodeComponent;
  let fixture: ComponentFixture<TemplateDiodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateDiodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateDiodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
