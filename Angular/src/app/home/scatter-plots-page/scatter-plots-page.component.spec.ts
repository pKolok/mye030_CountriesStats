import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ScatterPlotsPageComponent } from "./scatter-plots-page.component";

describe("ScatterPlotsComponent", () => {
    let component: ScatterPlotsPageComponent;
    let fixture: ComponentFixture<ScatterPlotsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ScatterPlotsPageComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ScatterPlotsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
