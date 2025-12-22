import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Extra } from '../../models/portfolio.models';
import { CardDetailComponent } from '../card-detail/card-detail.component';

@Component({
  selector: 'app-extra',
  standalone: true,
  imports: [CommonModule, CardDetailComponent],
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.scss']
})
export class ExtraComponent {
  @Input() extras: Extra[] = [];
}
