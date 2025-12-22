import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  baseSpeed: number;
  vx: number;
  vy: number;
  radius: number;
  originalRadius: number;
  opacity: number;
  originalOpacity: number;
  color: { r: number; g: number; b: number };
  pulsePhase: number;
  energy: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
  trailLength: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  speed: number;
  color: { r: number; g: number; b: number };
}

interface CodeBurst {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  char: string;
  color: { r: number; g: number; b: number };
}

interface NetworkPulse {
  start: { x: number; y: number };
  end: { x: number; y: number };
  progress: number;
  life: number;
  color: { r: number; g: number; b: number };
}

@Component({
  selector: 'app-particle-background',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #particleCanvas class="particle-canvas"></canvas>`,
  styleUrls: ['./particle-background.component.scss']
})
export class ParticleBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: null as number | null, y: null as number | null, radius: 140 };
  private animationId?: number;
  private ripples: Ripple[] = [];
  private codeBursts: CodeBurst[] = [];
  private networkPulses: NetworkPulse[] = [];
  private isMouseDown = false;
  private mouseDownTime = 0;
  private isMobile = false;
  private particleCount = 150;
  private maxDistance = 140;
  private codeChars = ['0', '1', '{', '}', '<', '>', '/', '*', '+', '-', '=', ';', '(', ')'];
  private isBrowser: boolean;
  private touchTimeout?: number;
  private touchStartY = 0;
  private touchStartX = 0;
  private isScrolling = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkMobileDevice();
      this.particleCount = this.isMobile ? 35 : 150;
      this.maxDistance = this.isMobile ? 80 : 140;
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d')!;
      this.resizeCanvas();
      this.createParticles();
      this.setupEventListeners();
      this.animate();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }
      this.removeEventListeners();
    }
  }

  private checkMobileDevice() {
    if (!this.isBrowser) return;
    
    this.isMobile = 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  private resizeCanvas() {
    if (!this.isBrowser) return;
    
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const canvas = this.canvasRef.nativeElement;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseSpeed: this.isMobile ? 0.05 : 0.15 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * (this.isMobile ? 0.05 : 0.15 + Math.random() * 0.4),
      vy: (Math.random() - 0.5) * (this.isMobile ? 0.05 : 0.15 + Math.random() * 0.4),
      radius: this.isMobile ? Math.random() * 2 + 1.5 : Math.random() * 4 + 2.5,
      originalRadius: this.isMobile ? Math.random() * 2 + 1.5 : Math.random() * 4 + 2.5,
      opacity: this.isMobile ? Math.random() * 0.4 + 0.2 : Math.random() * 0.7 + 0.3,
      originalOpacity: this.isMobile ? Math.random() * 0.4 + 0.2 : Math.random() * 0.7 + 0.3,
      color: { r: 30, g: 100, b: 200 },
      pulsePhase: Math.random() * Math.PI * 2,
      energy: 0,
      trail: [],
      trailLength: this.isMobile ? 2 : 5
    };
  }

  private updateParticle(particle: Particle) {
    const canvas = this.canvasRef.nativeElement;
    
    if (!this.isMobile) {
      particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity * 0.3 });
      if (particle.trail.length > particle.trailLength) {
        particle.trail.shift();
      }
    }
    
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    particle.pulsePhase += this.isMobile ? 0.015 : 0.025;
    
    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8;
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8;
    
    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
    
    if (this.mouse.x && this.mouse.y) {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.mouse.radius) {
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        
        if (this.isMouseDown) {
          particle.vx += Math.cos(angle) * force * (this.isMobile ? 0.15 : 0.2);
          particle.vy += Math.sin(angle) * force * (this.isMobile ? 0.15 : 0.2);
          particle.radius = particle.originalRadius * (1 + force * (this.isMobile ? 2 : 4));
          particle.color = {
            r: 100 + force * 155,
            g: 180 + force * 75,
            b: 255
          };
          particle.energy = Math.min(1, particle.energy + force * 0.15);
        } else {
          const repulsionForce = force * (this.isMobile ? 0.05 : 0.1);
          particle.vx -= Math.cos(angle) * repulsionForce;
          particle.vy -= Math.sin(angle) * repulsionForce;
          particle.radius = particle.originalRadius * (1 + force * (this.isMobile ? 1.5 : 2));
          particle.color = {
            r: 30 + force * 120,
            g: 100 + force * 180,
            b: 200 + force * 55
          };
        }
        particle.opacity = Math.min(1, particle.originalOpacity + force * 0.6);
      } else {
        particle.radius = particle.radius * 0.95 + particle.originalRadius * 0.05;
        particle.opacity = particle.opacity * 0.95 + particle.originalOpacity * 0.05;
        particle.color.r = particle.color.r * 0.95 + 30 * 0.05;
        particle.color.g = particle.color.g * 0.95 + 100 * 0.05;
        particle.color.b = particle.color.b * 0.95 + 200 * 0.05;
        particle.energy *= 0.92;
      }
    }
    
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (speed < particle.baseSpeed * 0.7) {
      particle.vx += (Math.random() - 0.5) * (this.isMobile ? 0.08 : 0.15);
      particle.vy += (Math.random() - 0.5) * (this.isMobile ? 0.08 : 0.15);
    }
    
    const maxSpeed = this.isMobile ? 1.5 : 2;
    particle.vx = Math.max(-maxSpeed, Math.min(maxSpeed, particle.vx * 0.995));
    particle.vy = Math.max(-maxSpeed, Math.min(maxSpeed, particle.vy * 0.995));
  }

  private drawParticle(particle: Particle) {
    if (!this.isMobile && particle.trail.length > 0) {
      particle.trail.forEach((point, index) => {
        const trailOpacity = point.opacity * (index / particle.trail.length);
        const trailRadius = particle.originalRadius * 0.5 * (index / particle.trail.length);
        
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, trailRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${trailOpacity})`;
        this.ctx.fill();
      });
    }
    
    const pulseSize = Math.sin(particle.pulsePhase) * 0.4 * particle.energy;
    const currentRadius = particle.radius + pulseSize;
    
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
    
    const gradient = this.ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, currentRadius * 3
    );
    
    gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.opacity})`);
    gradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.opacity * 0.4})`);
    gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    if (particle.energy > 0.2 && !this.isMobile) {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, currentRadius + 8, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(${Math.min(255, particle.color.r + 80)}, ${Math.min(255, particle.color.g + 80)}, 255, ${particle.energy * 0.6})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }

  private connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.maxDistance) {
          const opacity = (this.maxDistance - distance) / this.maxDistance * (this.isMobile ? 0.2 : 0.5);
          const energyBoost = (this.particles[i].energy + this.particles[j].energy) * 0.4;
          
          this.ctx.strokeStyle = `rgba(80, 150, 255, ${opacity + energyBoost})`;
          this.ctx.lineWidth = (this.isMobile ? 0.8 : 1.5) + energyBoost * 2.5;
          
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          
          if (!this.isMobile && Math.random() < 0.0005) {
            this.createNetworkPulse(this.particles[i], this.particles[j]);
          }
        }
      }
    }
  }

  private createNetworkPulse(particle1: Particle, particle2: Particle) {
    this.networkPulses.push({
      start: { x: particle1.x, y: particle1.y },
      end: { x: particle2.x, y: particle2.y },
      progress: 0,
      life: 1,
      color: { r: 0, g: 212, b: 255 }
    });
  }

  private createClickEffect(x: number, y: number) {
    const waveCount = this.isMobile ? 2 : 4;
    for (let i = 0; i < waveCount; i++) {
      setTimeout(() => {
        this.ripples.push({
          x,
          y,
          radius: 0,
          maxRadius: (this.isMobile ? 100 : 150) + i * (this.isMobile ? 30 : 50),
          life: 1,
          speed: this.isMobile ? 3 : 5,
          color: i % 2 === 0 ? { r: 0, g: 212, b: 255 } : { r: 255, g: 107, b: 53 }
        });
      }, i * (this.isMobile ? 80 : 120));
    }
  }

  private spawnCodeElements(x: number, y: number) {
    const spawnCount = this.isMobile ? 3 : 5;
    for (let i = 0; i < spawnCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.isMobile ? 0.8 + Math.random() * 1.2 : 0.5 + Math.random() * 1.5;
      
      this.codeBursts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: this.isMobile ? 0.015 : 0.01,
        char: this.codeChars[Math.floor(Math.random() * this.codeChars.length)],
        color: {
          r: 0 + Math.random() * 100,
          g: 212 + Math.random() * 43,
          b: 255
        }
      });
    }
  }

  private updateEffects() {
    this.ripples = this.ripples.filter(ripple => {
      ripple.radius += ripple.speed;
      ripple.life = 1 - (ripple.radius / ripple.maxRadius);
      
      if (ripple.life > 0) {
        this.ctx.beginPath();
        this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(${ripple.color.r}, ${ripple.color.g}, ${ripple.color.b}, ${ripple.life * (this.isMobile ? 0.5 : 0.8)})`;
        this.ctx.lineWidth = (this.isMobile ? 2.5 : 3) * ripple.life;
        this.ctx.stroke();
        return true;
      }
      return false;
    });

    this.codeBursts = this.codeBursts.filter(burst => {
      burst.x += burst.vx;
      burst.y += burst.vy;
      burst.life -= burst.decay;
      burst.vx *= 0.98;
      burst.vy *= 0.98;
      
      if (burst.life > 0) {
        this.ctx.font = `bold ${burst.life * (this.isMobile ? 20 : 24)}px 'Fira Code', 'Courier New', monospace`;
        this.ctx.fillStyle = `rgba(${burst.color.r}, ${burst.color.g}, ${burst.color.b}, ${burst.life})`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(burst.char, burst.x, burst.y);
        return true;
      }
      return false;
    });

    if (!this.isMobile) {
      this.networkPulses = this.networkPulses.filter(pulse => {
        pulse.progress += 0.03;
        pulse.life -= 0.02;
        
        if (pulse.life > 0 && pulse.progress < 1) {
          const x = pulse.start.x + (pulse.end.x - pulse.start.x) * pulse.progress;
          const y = pulse.start.y + (pulse.end.y - pulse.start.y) * pulse.progress;
          
          this.ctx.beginPath();
          this.ctx.arc(x, y, 3, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${pulse.life})`;
          this.ctx.fill();
          
          const trailLength = 10;
          for (let i = 1; i <= trailLength; i++) {
            const trailProgress = Math.max(0, pulse.progress - i * 0.02);
            const trailX = pulse.start.x + (pulse.end.x - pulse.start.x) * trailProgress;
            const trailY = pulse.start.y + (pulse.end.y - pulse.start.y) * trailProgress;
            const trailOpacity = pulse.life * (1 - i / trailLength) * 0.5;
            
            this.ctx.beginPath();
            this.ctx.arc(trailX, trailY, 1.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${trailOpacity})`;
            this.ctx.fill();
          }
          return true;
        }
        return false;
      });
    }
  }

  private drawCursor() {
    if (this.mouse.x && this.mouse.y && !this.isMobile) {
      const time = Date.now() * 0.01;
      const pulse = Math.sin(time) * 8;
      const baseSize = 25;
      const size = baseSize + pulse;
      
      const intensity = 0.3 + (this.isMouseDown ? Math.min(this.mouseDownTime * 0.02, 0.7) : 0);
      
      const gradient = this.ctx.createRadialGradient(
        this.mouse.x, this.mouse.y, 0,
        this.mouse.x, this.mouse.y, size * 2.5
      );
      
      if (this.isMouseDown) {
        gradient.addColorStop(0, `rgba(255, 107, 53, ${intensity})`);
        gradient.addColorStop(0.5, `rgba(0, 212, 255, ${intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(30, 100, 200, 0)');
      } else {
        gradient.addColorStop(0, `rgba(0, 212, 255, ${intensity})`);
        gradient.addColorStop(0.5, `rgba(135, 206, 250, ${intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(30, 100, 200, 0)');
      }
      
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, size * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, size, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.isMouseDown ?
        `rgba(255, 107, 53, ${0.8 + intensity * 0.2})` :
        `rgba(0, 212, 255, ${0.7 + intensity * 0.3})`;
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
      
      if (this.isMouseDown && this.mouseDownTime > 10) {
        const sparkles = 6;
        for (let i = 0; i < sparkles; i++) {
          const angle = (i / sparkles) * Math.PI * 2 + time * 0.5;
          const sparkleX = this.mouse.x + Math.cos(angle) * (size + 15);
          const sparkleY = this.mouse.y + Math.sin(angle) * (size + 15);
          
          this.ctx.beginPath();
          this.ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(255, 107, 53, ${intensity * 0.8})`;
          this.ctx.fill();
        }
      }
    }
  }

  private animate = () => {
    if (!this.isBrowser) return;
    
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (this.isMouseDown) {
      this.mouseDownTime++;
      if (this.mouse.x && this.mouse.y) {
        if (this.mouseDownTime % (this.isMobile ? 8 : 6) === 0) {
          this.spawnCodeElements(this.mouse.x, this.mouse.y);
        }
      }
    } else {
      this.mouseDownTime = Math.max(0, this.mouseDownTime - 3);
    }
    
    this.particles.forEach(p => {
      this.updateParticle(p);
      this.drawParticle(p);
    });
    
    this.connectParticles();
    this.updateEffects();
    this.drawCursor();
    
    this.animationId = requestAnimationFrame(this.animate);
  }

  private setupEventListeners() {
    if (!this.isBrowser) return;
    
    window.addEventListener('resize', this.onResize);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseleave', this.onMouseLeave);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    
    // Touch events con passive true para permitir scroll
    document.addEventListener('touchstart', this.onTouchStart, { passive: true });
    document.addEventListener('touchmove', this.onTouchMove, { passive: true });
    document.addEventListener('touchend', this.onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', this.onTouchCancel, { passive: true });
    
    window.addEventListener('orientationchange', this.onOrientationChange);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private removeEventListeners() {
    if (!this.isBrowser) return;
    
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseleave', this.onMouseLeave);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('touchcancel', this.onTouchCancel);
    window.removeEventListener('orientationchange', this.onOrientationChange);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private onResize = () => {
    this.resizeCanvas();
    this.createParticles();
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isMobile) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }
  }

  private onMouseLeave = () => {
    if (!this.isMobile) {
      this.mouse.x = null;
      this.mouse.y = null;
      this.isMouseDown = false;
      if (this.isBrowser) {
        document.body.classList.remove('clicking');
      }
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    if (!this.isMobile) {
      this.isMouseDown = true;
      this.mouseDownTime = 0;
      if (this.isBrowser) {
        document.body.classList.add('clicking');
      }
      this.createClickEffect(e.clientX, e.clientY);
    }
  }

  private onMouseUp = () => {
    if (!this.isMobile) {
      this.isMouseDown = false;
      if (this.isBrowser) {
        document.body.classList.remove('clicking');
      }
    }
  }

  private onTouchStart = (e: TouchEvent) => {
    if (this.isMobile && e.touches.length === 1) {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.isScrolling = false;
      
      // Activar efectos inmediatamente
      this.mouse.x = touch.clientX;
      this.mouse.y = touch.clientY;
      this.isMouseDown = true;
      this.mouseDownTime = 0;
      
      if (this.isBrowser) {
        document.body.classList.add('clicking');
      }
      
      this.createClickEffect(touch.clientX, touch.clientY);
    }
  }

  private onTouchMove = (e: TouchEvent) => {
    if (this.isMobile && e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStartX);
      const deltaY = Math.abs(touch.clientY - this.touchStartY);
      
      // Si se mueve más de 10px, es scroll
      if (deltaX > 10 || deltaY > 10) {
        this.isScrolling = true;
        this.isMouseDown = false;
        if (this.isBrowser) {
          document.body.classList.remove('clicking');
        }
        this.mouse.x = null;
        this.mouse.y = null;
      } else if (!this.isScrolling) {
        // Si no está scrolleando, actualizar posición del mouse
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;
      }
    }
  }

  private onTouchEnd = (e: TouchEvent) => {
    if (this.isMobile) {
      this.isMouseDown = false;
      this.isScrolling = false;
      
      if (this.isBrowser) {
        document.body.classList.remove('clicking');
      }
      
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }
      
      this.touchTimeout = window.setTimeout(() => {
        this.mouse.x = null;
        this.mouse.y = null;
      }, 200);
    }
  }

  private onTouchCancel = () => {
    if (this.isMobile) {
      this.isMouseDown = false;
      this.isScrolling = false;
      if (this.isBrowser) {
        document.body.classList.remove('clicking');
      }
      this.mouse.x = null;
      this.mouse.y = null;
    }
  }

  private onOrientationChange = () => {
    setTimeout(() => {
      this.resizeCanvas();
      this.createParticles();
    }, 100);
  }

  private onVisibilityChange = () => {
    if (!this.isBrowser) return;
    
    if (document.hidden) {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    } else {
      this.animate();
    }
  }
}
