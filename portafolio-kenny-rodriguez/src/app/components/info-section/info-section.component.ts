import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Info } from '../../models/portfolio.models';
import { InfoDetailComponent } from '../info-detail/info-detail.component';

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [CommonModule, InfoDetailComponent],
  templateUrl: './info-section.component.html',
  styleUrls: ['./info-section.component.scss']
})
export class InfoSectionComponent {
  @Input() title: string = '';
  @Input() items: Info[] = [];
}
