import { Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-radius',
  templateUrl: './radius.component.html',
  styleUrls: ['./radius.component.css']
})

export class RadiusComponent {
  enteredRadius = 1000;
@Output() radiusChanged = new EventEmitter<number>();
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  onInputChange($event) {
    this.enteredRadius = $event.value;
    this.radiusChanged.emit(this.enteredRadius);
   // this.showAllEventsInRadius();
  }
}
