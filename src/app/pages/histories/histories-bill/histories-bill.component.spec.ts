import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriesBillComponent } from './histories-bill.component';

describe('HistoriesBillComponent', () => {
  let component: HistoriesBillComponent;
  let fixture: ComponentFixture<HistoriesBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriesBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriesBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
