import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicacionComponent } from './medicacion.component';

describe('MedicacionComponent', () => {
  let component: MedicacionComponent;
  let fixture: ComponentFixture<MedicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
