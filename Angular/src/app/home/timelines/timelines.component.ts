import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-timelines",
  templateUrl: "./timelines.component.html",
  styleUrls: ["./timelines.component.css"]
})
export class TimelinesComponent implements OnInit {
  timelineForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const countryName = "";

    this.timelineForm = new FormGroup({
      "country": new FormControl(countryName)
    });
  }
}
