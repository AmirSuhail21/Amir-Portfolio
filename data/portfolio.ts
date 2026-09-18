import type { PortfolioData } from "@/types/portfolio";

export const portfolioData: PortfolioData = {
  profile: {
    name: "Amir Suhail",

    role: "BCA Final-Year Student & Full-Stack Web Developer",

    shortRole: "Full-Stack Web Developer",

    bio: "I build modern, responsive and scalable web applications with clean interfaces, practical functionality and a strong focus on user experience.",

    location: "India",

    profileImage: "",

    resumeUrl: "",

    socialLinks: {
      github: "https://github.com/AmirSuhail21",
      linkedin: "https://www.linkedin.com/in/amir-suhail-13a776338",
      instagram: "https://www.instagram.com/amir_suhail_2.1_/",
      whatsapp: "https://wa.me/918445939397",
      email: "mannuraien3@gmail.com",
    },
  },

  skills: [
    {
      id: "html5",
      name: "HTML5",
      category: "Frontend",
      description: "Semantic and accessible web page structure.",
    },
    {
      id: "css3",
      name: "CSS3",
      category: "Frontend",
      description: "Responsive layouts, animations and modern styling.",
    },
    {
      id: "javascript",
      name: "JavaScript",
      category: "Frontend",
      description: "Interactive and dynamic web applications.",
    },
    {
      id: "react",
      name: "React.js",
      category: "Frontend",
      description: "Component-based frontend application development.",
    },
    {
      id: "nextjs",
      name: "Next.js",
      category: "Frontend",
      description: "Modern full-stack React applications with Next.js.",
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Frontend",
      description: "Type-safe and maintainable JavaScript development.",
    },
    {
      id: "tailwind",
      name: "Tailwind CSS",
      category: "Frontend",
      description: "Utility-first responsive interface development.",
    },
    {
      id: "nodejs",
      name: "Node.js",
      category: "Backend",
      description: "Server-side JavaScript application development.",
    },
    {
      id: "express",
      name: "Express.js",
      category: "Backend",
      description: "Backend APIs and server-side application development.",
    },
    {
      id: "mongodb",
      name: "MongoDB",
      category: "Database",
      description: "NoSQL database development and data management.",
    },
    {
      id: "mysql",
      name: "MySQL",
      category: "Database",
      description: "Relational database design and queries.",
    },
    {
      id: "git",
      name: "Git & GitHub",
      category: "Tools",
      description: "Version control and collaborative development.",
    },
    {
      id: "angular",
      name: "Angular",
      category: "Frontend",
      description: "Component-based web application development with Angular.",
    },
  ],

  projects: [
    {
      id: "american-institute",
      title: "American Institute of English Language",
      type: "CLIENT / FREELANCE PROJECT",
      description:
        "A professional website developed for American Institute of English Language with course information, trainer details, gallery, contact information and a responsive modern interface.",
      image: "",
      liveUrl: "",
      githubUrl: "",
      skills: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
      featured: true,
    },

    {
      id: "wanderlust",
      title: "Wanderlust 🧳🏡",
      type: "FULL-STACK WEB APP",
      description:
        "An Airbnb-inspired property listing platform with authentication, property creation, categorized listings and pricing.",
      image: "",
      liveUrl: "https://wanderlust-xabx.onrender.com/listings",
      githubUrl: "",
      skills: ["Node.js", "Express.js", "MongoDB", "EJS"],
      featured: true,
    },

    {
      id: "weather-app",
      title: "Weather App",
      type: "REACT WEB APPLICATION",
      description:
        "A weather application that provides weather information through a clean and responsive interface using a weather API.",
      image: "",
      liveUrl: "",
      githubUrl: "",
      skills: ["React.js", "JavaScript", "REST API", "CSS3"],
      featured: false,
    },

    {
      id: "textutils",
      title: "TextUtils",
      type: "JAVASCRIPT PROJECT",
      description:
        "A text utility application that provides useful tools for formatting, analyzing and manipulating text.",
      image: "",
      liveUrl: "",
      githubUrl: "",
      skills: ["React.js", "JavaScript", "CSS3"],
      featured: false,
    },

    {
      id: "calculator",
      title: "Calculator",
      type: "JAVASCRIPT PROJECT",
      description:
        "A responsive calculator application built with a simple interface and interactive mathematical operations.",
      image: "",
      liveUrl: "",
      githubUrl: "",
      skills: ["JavaScript", "HTML5", "CSS3"],
      featured: false,
    },

    {
      id: "rock-paper-scissors",
      title: "Rock Paper Scissors",
      type: "JAVASCRIPT GAME",
      description:
        "A browser-based Rock Paper Scissors game with interactive gameplay and result tracking.",
      image: "",
      liveUrl: "",
      githubUrl: "",
      skills: ["JavaScript", "HTML5", "CSS3"],
      featured: false,
    },

    {
      id: "tic-tac-toe",
      title: "Tic Tac Toe",
      type: "JAVASCRIPT GAME",
      description:
        "A responsive Tic Tac Toe game featuring interactive player turns and win detection.",
      image: "",
      liveUrl: "",
      githubUrl: "",
      skills: ["JavaScript", "HTML5", "CSS3"],
      featured: false,
    },
  ],

  education: [
    {
      id: "bca",
      period: "Current",
      title: "Bachelor of Computer Applications (BCA)",
      institution: "BCA",
      description:
        "Currently pursuing Bachelor of Computer Applications with a focus on programming, web development and software development.",
    },
  ],

  experience: [
    {
      id: "personal-projects",
      period: "Current",
      title: "Web Developer",
      company: "Personal & Client Projects",
      description:
        "Building responsive and functional web applications using modern frontend and backend technologies.",
    },
    {
      id: "american-institute",
      period: "Client / Freelance",
      title: "Web Developer",
      company: "American Institute of English Language",
      description:
        "Developed a professional responsive website for an English language institute.",
    },
  ],
};