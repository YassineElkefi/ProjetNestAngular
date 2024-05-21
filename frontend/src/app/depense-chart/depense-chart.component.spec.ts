import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepenseChartComponent } from './depense-chart.component';

describe('DepenseChartComponent', () => {
  let component: DepenseChartComponent;
  let fixture: ComponentFixture<DepenseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepenseChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepenseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
