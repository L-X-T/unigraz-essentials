import { Component } from '@angular/core';

import { Flight } from '../../entities/flight';
import { FlightService } from '../shared/services/flight.service';

import { PATTERN } from '../../shared/const';
import { Router } from '@angular/router';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent {
  from = 'Graz';
  to = 'Hamburg';
  flights: Flight[] = [];
  flightToEdit: Flight;

  pattern = PATTERN;

  message: string;

  basket: Record<number, boolean> = {
    3: true,
    5: true
  };

  constructor(private flightService: FlightService, private router: Router) {}

  search(): void {
    this.flightService.find(this.from, this.to).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      }
    });
  }

  /*save(): void {
    this.flightService.save(this.flightToEdit).subscribe({
      next: (flight) => {
        this.flightToEdit = flight;
        this.message = 'Success!';
      },
      error: (errResponse) => {
        console.error('Error', errResponse);
        this.message = 'Error!';
      }
    });
  }*/

  delayFirstFlight(): void {
    if (this.flights.length > 0) {
      const ONE_MINUTE = 1000 * 60;
      const firstFlight = this.flights[0];
      const date = new Date(firstFlight.date);
      const newDate = new Date(date.getTime() + 15 * ONE_MINUTE);

      // mutable update
      firstFlight.date = newDate.toISOString();

      // immutable update
      // this.flights[0] = { ...firstFlight, date: newDate.toISOString() };
    }
  }

  onEdit(id: number) {
    this.router.navigate(['/flight-edit', id, { showDetails: true }]);
  }
}
