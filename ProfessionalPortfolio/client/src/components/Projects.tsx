import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ExternalLink, Github, Book } from "lucide-react";

export function Projects() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: project1Ref, isVisible: project1Visible } = useScrollAnimation();
  const { ref: project2Ref, isVisible: project2Visible } = useScrollAnimation();
  const { ref: project3Ref, isVisible: project3Visible } = useScrollAnimation();
  const { ref: project4Ref, isVisible: project4Visible } = useScrollAnimation();

  const projects = [
    {
      title: "Full-Stack E-Commerce Platform",
      description: "A complete e-commerce solution with user authentication, product management, shopping cart, payment integration, and admin dashboard. Built with modern technologies and best practices.",
      image: "E-Commerce Platform",
      gradient: "var(--portfolio-gradient)",
      technologies: ["html", "Css", "Java script",],
      links: [
        { type: "demo", icon: <ExternalLink className="w-4 h-4" />, text: "Live Demo", href: "https://mye-comerce.netlify.app/" },
        { type: "github", icon: <Github className="w-4 h-4" />, text: "GitHub", href: "https://github.com/HARVINDER-FSD/javascript/tree/main/E-com" }
      ],
      ref: project1Ref,
      isVisible: project1Visible
    },
    {
      title: "Dance Academy",
      description: "A real-time collaborative task management application with team workspaces, drag-and-drop functionality, file attachments, and notifications. Features modern UI and seamless user experience.",
      image: "Dance Academy",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      technologies: ["Vue.js", "Socket.io", "Express", "PostgreSQL", "AWS S3"],
      links: [
        { type: "demo", icon: <ExternalLink className="w-4 h-4" />, text: "Live Demo", href: "https://myradancestudio.netlify.app" },
        { type: "github", icon: <Github className="w-4 h-4" />, text: "GitHub", href: "https://github.com/harvinder-singh/task-manager" }
      ],
      ref: project2Ref,
      isVisible: project2Visible
    },
    {
      title: "Weather Analytics Dashboard",
      description: "An interactive weather dashboard with location-based forecasts, historical data visualization, weather maps, and personalized alerts. Integrated with multiple weather APIs for accuracy.",
      image: "Weather Dashboard",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      technologies: ["React", "D3.js", "Weather API", "Chart.js", "Geolocation"],
      links: [
        { type: "demo", icon: <ExternalLink className="w-4 h-4" />, text: "Live Demo", href: "https://weather-dashboard-harvinder.netlify.app" },
        { type: "github", icon: <Github className="w-4 h-4" />, text: "GitHub", href: "https://github.com/harvinder-singh/weather-dashboard" }
      ],
      ref: project3Ref,
      isVisible: project3Visible
    },
    {
      title: "RESTful Social Media API",
      description: "A comprehensive social media backend API with user management, posts, comments, likes, followers system, and real-time notifications. Built with scalability and security in mind.",
      image: "Social Media API",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      technologies: ["Node.js", "Express", "MongoDB", "Redis", "JWT"],
      links: [
        { type: "docs", icon: <Book className="w-4 h-4" />, text: "Documentation", href: "https://api-docs-harvinder.gitbook.io/social-media-api" },
        { type: "github", icon: <Github className="w-4 h-4" />, text: "GitHub", href: "https://github.com/harvinder-singh/social-media-api" }
      ],
      ref: project4Ref,
      isVisible: project4Visible
    }
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <div 
          ref={headerRef}
          className={`section-header animate-on-scroll ${headerVisible ? 'animate' : ''}`}
        >
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A showcase of my recent work and personal projects that demonstrate my skills and passion for development
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div 
              key={index}
              ref={project.ref}
              className={`project-card animate-on-scroll ${project.isVisible ? 'animate' : ''}`}
            >
              <div 
                className="project-image" 
                style={{ background: project.gradient }}
              >
                {project.image}
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      className={`project-link ${link.type === 'demo' || link.type === 'docs' ? 'primary' : 'secondary'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.icon}
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
