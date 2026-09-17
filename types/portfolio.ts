export type SocialLinks = {
  github: string;
  linkedin: string;
  instagram: string;
  email: string;
};

export type Profile = {
  name: string;
  role: string;
  shortRole: string;
  bio: string;
  location: string;
  profileImage: string;
  resumeUrl: string;
  socialLinks: SocialLinks;
};

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Tools"
  | "Other";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
};

export type Project = {
  id: string;
  title: string;
  type: string;
  description: string;
  image: string;
  liveUrl: string;
  githubUrl: string;
  skills: string[];
  featured: boolean;
};

export type EducationItem = {
  id: string;
  period: string;
  title: string;
  institution: string;
  description: string;
};

export type ExperienceItem = {
  id: string;
  period: string;
  title: string;
  company: string;
  description: string;
};

export type PortfolioData = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  education: EducationItem[];
  experience: ExperienceItem[];
};