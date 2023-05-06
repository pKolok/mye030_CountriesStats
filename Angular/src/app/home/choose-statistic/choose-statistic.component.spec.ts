import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseStatisticComponent } from './choose-statistic.component';

describe('ChooseStatisticComponent', () => {
  let component: ChooseStatisticComponent;
  let fixture: ComponentFixture<ChooseStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseStatisticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
