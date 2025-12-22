export interface Media {
  email: string;
  cv: string;
  github: string;
  likedin: string;
}

export interface Technology {
  icon: string;
  name: string;
}

export interface Info {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  date?: string;
  location?: string;
  certificate?: string;
  technologies?: Technology[];
  image?: string;
  url?: string;
  github?: string;
}

export interface Extra {
  image: string;
  title: string;
  description: string;
  url: string;
}

export interface PortfolioData {
  title: string;
  description: string;
  image: string;
  avatar: string;
  name: string;
  skill: string;
  location: string;
  media: Media;
  about: string;
  technologies: Technology[];
  experience: Info[];
  projects: Info[];
  training: Info[];
}
