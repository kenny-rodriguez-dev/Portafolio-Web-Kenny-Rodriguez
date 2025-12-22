import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, FileText, Github, Linkedin, Link, ShieldCheck, Terminal, Rabbit, BarChart4, BugOff, Backpack, GraduationCap, BoxSelect } from 'lucide-angular';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent {
  @Input() icon: string = '';
  @Input() url: string = '';
  @Input() text: string = '';
  @Input() solid: boolean = false;
  @Input() disableLink: boolean = false; // Nueva propiedad para deshabilitar enlaces

  iconMap: any = {
    'mail': Mail,
    'file-text': FileText,
    'github': Github,
    'linkedin': Linkedin,
    'link': Link,
    'shield-check': ShieldCheck,
    'terminal': Terminal,
    'rabbit': Rabbit,
    'bar-chart-4': BarChart4,
    'bug-off': BugOff,
    'backpack': Backpack,
    'graduation-cap': GraduationCap,
    'box-select': BoxSelect
  };

  get iconComponent() {
    return this.iconMap[this.icon] || BoxSelect;
  }
}
