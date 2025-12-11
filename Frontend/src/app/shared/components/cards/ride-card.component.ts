import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ride-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-card.component.html',
  styleUrls: ['./ride-card.component.scss']
})
export class RideCardComponent {
  @Input() userName: string = 'Daniel David';
  @Input() userAvatar: string = 'https://api.builder.io/api/v1/image/assets/TEMP/69b5b1a33198532344ca438f48446cca2256fabc?width=96';
  @Input() rating: number = 4.8;
  @Input() fromLocation: string = 'Buna Ziua';
  @Input() toLocation: string = 'CREIC';
  @Input() departureTime: string = 'Today, 3:00 PM';
  @Input() seatsAvailable: number = 3;
  @Input() totalSeats: number = 4;
  @Input() price: string = '7 RON';
  @Output() cardClick = new EventEmitter<void>();

  onCardClick() {
    this.cardClick.emit();
  }

  truncateLocation(location: string): string {
    if (location && location.length > 12) {
      return location.substring(0, 12) + '...';
    }
    return location;
  }
}
