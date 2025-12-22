import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Extra } from '../../models/portfolio.models';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent {
  @Input() extra!: Extra;

  openUrl() {
    if (this.extra.url) {
      window.open(this.extra.url, '_blank', 'noopener,noreferrer');
    }
  }
}
