import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LineChartsPageComponent } from "./line-charts-page.component";

describe("TimelinesComponent", () => {
    let component: LineChartsPageComponent;
    let fixture: ComponentFixture<LineChartsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ LineChartsPageComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LineChartsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
