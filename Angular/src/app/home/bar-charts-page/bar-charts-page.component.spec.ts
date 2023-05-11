import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BarChartsPageComponent } from "./bar-charts-page.component";

describe("BarChartsComponent", () => {
    let component: BarChartsPageComponent;
    let fixture: ComponentFixture<BarChartsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ BarChartsPageComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BarChartsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
