import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { delay } from 'rxjs/operators';

import { Flight } from '../../entities/flight';
import { FlightService } from '../shared/services/flight.service';
import { validateCity } from '../shared/validation/city-validator';

@Component({
  selector: 'flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css']
})
export class FlightEditComponent implements OnChanges, OnInit, OnDestroy {
  @Input() flight: Flight;

  debug = true;
  id: string;
  showDetails: string;

  editForm: FormGroup;

  message = '';

  private isInitialized: Boolean;

  constructor(private fb: FormBuilder, private flightService: FlightService, private route: ActivatedRoute, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.debug) {
      console.warn('[FlightEditComponent] Changes!');
      console.log(changes);
    }

    if (!this.isInitialized) {
      this.editFormInit();
    }

    this.patchFormValue();
  }

  ngOnInit(): void {
    if (this.debug) {
      console.warn('[FlightEditComponent] Good morning!');
      this.route.url.subscribe((url) => console.log(url));
    }

    if (!this.isInitialized) {
      this.editFormInit();
    }

    this.route.params.subscribe((params) => this.onRouteParams(params));
  }

  ngOnDestroy(): void {
    if (this.debug) {
      console.warn('[FlightEditComponent] Bye bye!');
    }
  }

  save(): void {
    this.message = 'Is saving ...';

    const flightToSave: Flight = this.editForm.value;

    this.flightService
      .save(flightToSave)
      .pipe(delay(3000))
      .subscribe({
        next: (flight) => {
          this.flight = flight;
          this.message = 'Success saving! Navigating ...';
          this.patchFormValue();

          setTimeout(() => {
            this.router.navigate(['/flight-edit', this.flight.id, { showDetails: true }]);
          }, 3000);
        },
        error: (errResponse) => {
          console.error('Error', errResponse);
          this.message = 'Error saving!';
        }
      });
  }

  private editFormInit() {
    this.editForm = this.fb.group({
      id: [1, [Validators.required]],
      from: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity]],
      to: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity]],
      date: ['', [Validators.required, Validators.minLength(33), Validators.maxLength(33)]]
    });

    this.isInitialized = true;
  }

  private patchFormValue() {
    if (this.editForm && this.flight) {
      this.editForm.patchValue(this.flight);
    }
  }

  private onRouteParams(params: Params) {
    this.id = params['id'];
    this.showDetails = params['showDetails'];

    this.flightService.findById(this.id).subscribe({
      next: (flight) => {
        this.flight = flight;
        this.message = 'Success loading!';
        this.patchFormValue();
      },
      error: (err) => {
        this.message = 'Error Loading!';
      }
    });
  }
}
