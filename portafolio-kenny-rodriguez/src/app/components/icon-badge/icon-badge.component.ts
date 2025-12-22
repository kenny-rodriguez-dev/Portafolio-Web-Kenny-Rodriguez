import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule, Terminal, Rabbit, BarChart4, BugOff, Backpack, GraduationCap, BoxSelect,
  Hospital, Building2, Monitor, MonitorSmartphone, MonitorCog, MonitorPlay,
  University, UserStar
} from 'lucide-angular';

@Component({
  selector: 'app-icon-badge',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './icon-badge.component.html',
  styleUrls: ['./icon-badge.component.scss']
})
export class IconBadgeComponent {
  @Input() icon: string = '';

  iconMap: any = {
    'terminal': Terminal,
    'rabbit': Rabbit,
    'bar-chart-4': BarChart4,
    'bug-off': BugOff,
    'backpack': Backpack,
    'graduation-cap': GraduationCap,
    'box-select': BoxSelect,
    'hospital': Hospital,
    'building-2': Building2,
    'monitor': Monitor,
    'monitor-smartphone': MonitorSmartphone,
    'monitor-cog': MonitorCog,
    'monitor-play': MonitorPlay,
    'university': University,
    'user-star': UserStar,
  };

  get iconComponent() {
    return this.iconMap[this.icon] || BoxSelect;
  }
}
