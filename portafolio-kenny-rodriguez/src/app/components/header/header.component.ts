import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioData } from '../../models/portfolio.models';
import { MediaComponent } from '../media/media.component';
import { LucideAngularModule, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MediaComponent, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() data!: PortfolioData;
  
  readonly MapPin = MapPin;
}
