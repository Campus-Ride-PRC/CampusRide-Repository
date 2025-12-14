import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BookingResponse, BookingStatus} from "../../../core/models/booking.model";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon
} from "@ionic/angular/standalone";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
  imports: [
    IonBadge,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardContent,
    CommonModule
  ]
})
export class BookingCardComponent  {


  @Input({required:true}) booking! : BookingResponse;
  @Output() cardClick = new EventEmitter<BookingResponse>();
   constructor() { }


  getStatusColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.ACCEPTED: return 'success';
      case BookingStatus.DECLINED: return 'danger';
      case BookingStatus.CANCELED: return 'medium';
      default: return 'medium';
    }
  }

  getStatusIcon(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return 'hourglass-outline';
      case BookingStatus.ACCEPTED: return 'checkmark-circle-outline';
      case BookingStatus.DECLINED:
      case BookingStatus.CANCELED: return 'close-circle-outline';
      default: return 'hourglass-outline';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onCardClick(): void {
    this.cardClick.emit(this.booking);
  }

}

