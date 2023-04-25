import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ScatterPlotsComponent } from "./scatter-plots.component";

describe("ScatterPlotsComponent", () => {
    let component: ScatterPlotsComponent;
    let fixture: ComponentFixture<ScatterPlotsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ScatterPlotsComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ScatterPlotsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
