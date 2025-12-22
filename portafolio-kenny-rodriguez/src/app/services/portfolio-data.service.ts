import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PortfolioData } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private selectedImageSource = new BehaviorSubject<string | null>(null);
  selectedImage$ = this.selectedImageSource.asObservable();

  openImage(imageUrl: string) {
    this.selectedImageSource.next(imageUrl);
  }

  closeImage() {
    this.selectedImageSource.next(null);
  }

  private data: PortfolioData = {
    title: "Kenny Alejandro Rodríguez Morocho | Portafolio",
    description: "Soy Kenny, un apasiando de la informática.",
    image: "/assets/foto_kenny.jpg",
    avatar: "/assets/foto_kenny.jpg",
    name: "Kenny Alejandro Rodríguez Morocho",
    skill: "Ingeniero de Software",
    location: "Milagro, Guayas, Ecuador",
    media: {
      email: "kennyrodriguezm2017@gmail.com",
      cv: "/assets/data/cv_kenny_rodriguez.pdf",
      github: "https://github.com/kenny-rodriguez-dev",
      likedin: "https://linkedin.com/in/kennyrodriguezm"
    },
    about: "Apasionado por transformar ideas en soluciones web robustas y centradas en el usuario. A lo largo de mi carrera, he liderado proyectos que van desde plataformas interactivas hasta complejas soluciones de comercio electrónico, siempre aplicando metodologías ágiles para garantizar la máxima calidad. Mi objetivo es crear código que no solo resuelva problemas, sino que también optimice procesos y genere un impacto positivo. Busco nuevos desafíos para seguir innovando y creciendo en el campo del desarrollo de software.",
    technologies: [
      {
        icon: "devicon-nodejs-plain",
        name: "Node.js"
      },
      {
        icon: "devicon-nextjs-original-wordmark",
        name: "Next.js"
      },
      {
        icon: "devicon-angular-plain",
        name: "Angular"
      },
      {
        icon: "devicon-html5-plain",
        name: "HTML"
      },
      {
        icon: "devicon-css3-plain",
        name: "CSS"
      },
      {
        icon: "devicon-javascript-plain",
        name: "Javascript"
      },
      {
        icon: "devicon-typescript-plain",
        name: "Typescript"
      },
      {
        icon: "devicon-react-original",
        name: "React"
      },
      {
        icon: "devicon-tailwindcss-original",
        name: "Tailwind CSS"
      },
      {
        icon: "devicon-materialui-plain",
        name: "Material UI"
      },
      {
        icon: "devicon-dotnetcore-plain",
        name: ".NET"
      },
      {
        icon: "devicon-csharp-plain",
        name: "C#"
      },
      {
        icon: "devicon-microsoftsqlserver-plain",
        name: "Microsoft SQL Server"
      },
      {
        icon: "devicon-django-plain",
        name: "Django"
      },
      {
        icon: "devicon-python-plain",
        name: "Python"
      },
      {
        icon: "devicon-postgresql-plain",
        name: "PostgreSQL"
      },
      {
        icon: "devicon-postman-plain",
        name: "Postman"
      },
      {
        icon: "devicon-git-plain",
        name: "Git"
      },
      {
        icon: "devicon-github-original",
        name: "GitHub"
      },
      {
        icon: "devicon-azure-plain",
        name: "Microsoft Azure"
      }
    ],
    experience: [
      {
        icon: "user-star",
        title: "Proyecto Freelance",
        subtitle: "Frontend Engineer & UI Developer ",
        description: "Desarrollé una plataforma web personalizada enfocada en la identidad visual y la optimización de la experiencia de usuario.",
        date: "abril 2025 - noviembre 2025"
      },
      {
        icon: "building-2",
        title: "La Casa del Retenedor y Zapatillas de Freno",
        subtitle: "E-commerce Full Stack Developer",
        description: "Codifiqué una plataforma de comercio electrónico integral para la administración eficiente de inventarios, ventas y facturación en tiempo real.",
        date: "octubre 2024 - agosto 2025"
      },
      {
        icon: "university",
        title: "Universidad Estatal de Milagro",
        subtitle: "Full Stack & IoT Developer",
        description: "Implementé un sistema de gestión académica con integración de códigos QR para automatizar el control de visitas y agendas.",
        date: "septiembre 2023 - febrero 2024"
      },
      {
        icon: "hospital",
        title: "Centro Médico Vitalcen",
        subtitle: "Web Solutions Developer & SEO Specialist",
        description: "Diseñé un portal corporativo institucional para digitalizar el catálogo de servicios médicos y mejorar su visibilidad en buscadores.",
        date: "noviembre 2022 - enero 2023"
      },
    ],
    projects: [
      {
        icon: "monitor-smartphone",
        title: "Scriptor",
        subtitle: "Sitio web de recursos para currículums",
        description: "Como un proyecto freelance, elaboré un sitio web para brindar a los usuarios un recurso informativo sobre la elaboración de currículums. El objetivo fue crear una plataforma de recursos visualmente atractiva y fácil de navegar, que ofreciera artículos y guías de calidad para profesionales.",
        technologies: [
          {
            icon: "devicon-nodejs-plain",
            name: "Node.js"
          },
          {
            icon: "devicon-nextjs-original-wordmark",
            name: "Next.js"
          },
          {
            icon: "devicon-react-original",
            name: "React"
          },
          {
            icon: "devicon-tailwindcss-original",
            name: "Tailwind CSS"
          },
          {
            icon: "devicon-materialui-plain",
            name: "Material UI"
          }
        ],
        image: "/assets/captura_scriptor.png",
        url: "https://scriptor-2025.vercel.app/",
        github: "https://github.com/kenny-rodriguez-dev/Scriptor-2025"
      },
      {
        icon: "monitor-cog",
        title: "MiSgro",
        subtitle: "Aplicación web E-commerce",
        description: "Construí un prototipo de un sistema de comercio electrónico que permite una gestión integral de productos y facilita la compra de artículos en línea.",
        technologies: [
          {
            icon: "devicon-nodejs-plain",
            name: "Node.js"
          },
          {
            icon: "devicon-nextjs-original-wordmark",
            name: "Next.js"
          },
          {
            icon: "devicon-react-original",
            name: "React"
          },
          {
            icon: "devicon-tailwindcss-original",
            name: "Tailwind CSS"
          },
          {
            icon: "devicon-materialui-plain",
            name: "Material UI"
          },
          {
            icon: "devicon-dotnetcore-plain",
            name: ".NET"
          },
          {
            icon: "devicon-csharp-plain",
            name: "C#"
          },
          {
            icon: "devicon-microsoftsqlserver-plain",
            name: "Microsoft SQL Server"
          },
          {
            icon: "devicon-azure-plain",
            name: "Microsoft Azure"
          }
        ],
        image: "/assets/captura_misgro.png",
        url: "https://misgro-app-erbpecfqf8cpeafd.brazilsouth-01.azurewebsites.net/",
        github: "https://github.com/kenny-rodriguez-dev/MiSgro-2025"
      },
      {
        icon: "monitor-play",
        title: "Reserva a visitantes",
        subtitle: "Aplicación web de gestión de visitas",
        description: "Diseñé e implementé un sistema de agendamiento de citas para la Universidad Estatal de Milagro (UNEMI). La plataforma funciona como un prototipo intuitivo que permite a los estudiantes reservar eficientemente reuniones con docentes o personal administrativo, simplificando la coordinación y optimizando la gestión de tiempo para ambas partes.",
        technologies: [
          {
            icon: "devicon-django-plain",
            name: "Django"
          },
          {
            icon: "devicon-python-plain",
            name: "Python"
          },
          {
            icon: "devicon-postgresql-plain",
            name: "PostgreSQL"
          }
        ],
        image: "/assets/captura_reserva_a_visitantes.png",
        url: "https://reserva-a-visitantes-2024.onrender.com",
        github: "https://github.com/kenny-rodriguez-dev/Reserva-a-visitantes-2024"
      },
      {
        icon: "monitor",
        title: "Vitalcen",
        subtitle: "Sitio web estático para centro médico",
        description: "Desarrollé este sitio web para brindar a los pacientes acceso rápido a información clave como servicios, horarios y contacto, estableciendo una identidad profesional y confiable para la clínica.",
        technologies: [
          {
            icon: "devicon-html5-plain",
            name: "HTML"
          },
          {
            icon: "devicon-css3-plain",
            name: "CSS"
          },
          {
            icon: "devicon-javascript-plain",
            name: "Javascript"
          }
        ],
        image: "/assets/captura_vitalcen.png",
        url: "https://vitalcen.com/",
        github: "https://github.com/kenny-rodriguez-dev/Vitalcen-2023"
      }
    ],
    training: [
      {
        icon: "graduation-cap",
        title: "Universidad Estatal de Milagro",
        subtitle: "Ingeniero de Software",
        description: `Formación integral centrada en el ciclo de vida completo 
        del desarrollo de software (SDLC). Adquisición de competencias sólidas 
        en arquitectura de software, patrones de diseño, estructuras de datos y 
        algoritmia, complementada con la gestión de bases de datos y la aplicación 
        de metodologías ágiles para la creación de soluciones escalables.`,
        date: "2018 - 2024",
        location: "Milagro, Ecuador",
        certificate: "/assets/data/titulo.pdf"
      }
    ]
  };

  getData(): PortfolioData {
    return this.data;
  }
}
