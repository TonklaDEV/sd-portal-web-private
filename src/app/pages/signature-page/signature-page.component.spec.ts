import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturePageComponent } from './signature-page.component';

describe('SignaturePageComponent', () => {
  let component: SignaturePageComponent;
  let fixture: ComponentFixture<SignaturePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignaturePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignaturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
