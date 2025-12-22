import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Media } from '../../models/portfolio.models';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent {
  @Input() media!: Media;
}
