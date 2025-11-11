import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, AppHeaderComponent, SidePanelComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  isPanelOpen = false;

  onMenuOpen() {
    this.isPanelOpen = true;
  }

  onPanelClosed() {
    this.isPanelOpen = false;
  }
}
