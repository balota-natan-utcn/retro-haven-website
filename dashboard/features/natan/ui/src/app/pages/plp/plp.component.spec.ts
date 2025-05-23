import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlpComponent } from './plp.component';

describe('PlpComponent', () => {
  let component: PlpComponent;
  let fixture: ComponentFixture<PlpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
