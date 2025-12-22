import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Info } from '../../models/portfolio.models';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import { IconBadgeComponent } from '../icon-badge/icon-badge.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-info-detail',
  standalone: true,
  imports: [CommonModule, IconBadgeComponent, IconButtonComponent],
  templateUrl: './info-detail.component.html',
  styleUrls: ['./info-detail.component.scss']
})
export class InfoDetailComponent {
  @Input() info!: Info;

  constructor(private portfolioService: PortfolioDataService) { }

  onImageClick() {
    if (this.info.image) {
      this.portfolioService.openImage(this.info.image);
    }
  }
}
