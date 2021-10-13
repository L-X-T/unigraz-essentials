import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlightService } from '../flight-search/flight.service';
import { Flight } from '../../entities/flight';
import { validateCity } from '../shared/validation/city-validator';

@Component({
  selector: 'flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css']
})
export class FlightEditComponent implements OnChanges, OnInit, OnDestroy {
  @Input() flight: Flight;

  editForm: FormGroup;

  message = '';

  constructor(private fb: FormBuilder, private flightService: FlightService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.warn('[FlightEditComponent] Changes!');
    console.log(changes);

    if (this.editForm && this.flight) {
      this.editForm.patchValue(this.flight);
    }
  }

  ngOnInit(): void {
    console.warn('[FlightEditComponent] Good morning!');

    this.editForm = this.fb.group({
      id: [1, [Validators.required]],
      from: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity]],
      to: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity]],
      date: ['', [Validators.required, Validators.minLength(33), Validators.maxLength(33)]]
    });
  }

  ngOnDestroy(): void {
    console.warn('[FlightEditComponent] Bye bye!');
  }

  save(): void {
    this.flightService.save(this.editForm.value).subscribe({
      next: () => {
        this.message = 'Success!';
      },
      error: (errResponse) => {
        console.error('Error', errResponse);
        this.message = 'Error!';
      }
    });
  }
}
