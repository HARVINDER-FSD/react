import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Code, Mail } from "lucide-react";
import { TypingAnimation } from "./TypingAnimation";

export function Hero() {
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const roles = [
    "Full Stack Developer",
    "React Specialist", 
    "Node.js Expert",
    "Database Engineer",
    "Web Developer"
  ];

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div 
          ref={contentRef}
          className={`hero-content animate-on-scroll ${contentVisible ? 'animate' : ''}`}
        >
          <h1>Harvinder Singh</h1>
          <p className="subtitle">
            <TypingAnimation texts={roles} speed={80} deleteSpeed={40} delay={1500} />
          </p>
          <p className="description">
            Passionate about creating exceptional digital experiences through clean code and innovative solutions. 
            Specializing in modern web technologies and full-stack development with a focus on performance and user experience.
          </p>
          <div className="hero-actions">
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('projects')}
            >
              <Code className="w-5 h-5" />
              View My Work
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => scrollToSection('contact')}
            >
              <Mail className="w-5 h-5" />
              Get In Touch
            </button>
          </div>
        </div>
        <div 
          ref={imageRef}
          className={`hero-image animate-on-scroll ${imageVisible ? 'animate' : ''}`}
        >
          <div className="profile-card">
            <div className="profile-avatar">
              HS
            </div>
            <div className="profile-info">
              <h3>Harvinder Singh</h3>
              <p>Full Stack Developer</p>
              <div className="social-links">
                <a href="https://github.com/harvinder-singh" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://linkedin.com/in/harvinder-singh-dev" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://twitter.com/harvinder_dev" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="mailto:harvinder.singh.dev@gmail.com" className="social-link">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
