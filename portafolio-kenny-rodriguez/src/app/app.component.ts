import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from './services/portfolio-data.service';
import { PortfolioData } from './models/portfolio.models';
import { ParticleBackgroundComponent } from './components/particle-background/particle-background.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { TechStackComponent } from './components/tech-stack/tech-stack.component';
import { InfoSectionComponent } from './components/info-section/info-section.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ParticleBackgroundComponent,
    HeaderComponent,
    AboutComponent,
    TechStackComponent,
    InfoSectionComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data!: PortfolioData;
  private isBrowser: boolean;

  constructor(
    private portfolioService: PortfolioDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  selectedImage: string | null = null;
  isClosing: boolean = false;

  ngOnInit() {
    this.data = this.portfolioService.getData();
    if (this.isBrowser) {
      this.setPageMetadata();
    }

    this.portfolioService.selectedImage$.subscribe(image => {
      this.selectedImage = image;
    });
  }

  closeImageModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.portfolioService.closeImage();
      this.isClosing = false;
    }, 300); // 300ms matches animation duration
  }

  private setPageMetadata() {
    if (!this.isBrowser) return;

    document.title = this.data.title;

    // Set meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', this.data.description);
    }

    // Set Open Graph meta tags
    this.setMetaTag('og:title', this.data.title);
    this.setMetaTag('og:description', this.data.description);
    this.setMetaTag('og:image', this.data.image);
    this.setMetaTag('theme-color', '#1e64c8');
  }

  private setMetaTag(name: string, content: string) {
    if (!this.isBrowser) return;

    let meta = document.querySelector(`meta[property="${name}"]`) ||
      document.querySelector(`meta[name="${name}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      if (name.startsWith('og:')) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  }
}
