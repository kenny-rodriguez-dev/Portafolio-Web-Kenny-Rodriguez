import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Technology } from '../../models/portfolio.models';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack.component.html',
  styleUrls: ['./tech-stack.component.scss']
})
export class TechStackComponent {
  @Input() technologies: Technology[] = [];

  getFrontendTech(): Technology[] {
    const frontendNames = ['HTML', 'CSS', 'Javascript', 'Typescript', 'React', 'Angular', 'Next.js', 'Tailwind CSS', 'Material UI'];
    return this.technologies.filter(tech => 
      frontendNames.includes(tech.name)
    );
  }

  getBackendTech(): Technology[] {
    const backendNames = ['Node.js', '.NET', 'C#', 'Django', 'Python', 'Microsoft SQL Server', 'PostgreSQL'];
    return this.technologies.filter(tech => 
      backendNames.includes(tech.name)
    );
  }

  getToolsTech(): Technology[] {
    const toolsNames = ['Git', 'GitHub', 'Postman', 'Microsoft Azure'];
    return this.technologies.filter(tech => 
      toolsNames.includes(tech.name)
    );
  }
}
