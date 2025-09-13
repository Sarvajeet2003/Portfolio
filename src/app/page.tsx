'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Mail, Phone, MapPin, Calendar, ChevronDown } from 'lucide-react';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'education', 'skills', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const experiences = [
    {
      title: "AI Engineer — Ekai Labs (Remote)",
      period: "May 2025 – August 2025",
      role: "MCP Server Developer",
      achievements: [
        "Developed a 1inch MCP server supporting cross-chain swaps using Fusion+ APIs and integrated the X402 payment gateway",
        "Enhanced Kuber, Ekai Labs' in-house AI-driven crypto wallet + UI, by adding new properties, improving UI/UX, and implementing context-preserving LLM conversations",
        "Integrated OpenRouter and Ollama support to extend LLM and model interoperability",
        "Built multiple DeFi-focused MCP servers including Tally MCP Server (DeFi analytics), Dune-1inch-MCP Server, and DeFi Analyzer MCP, providing real-time DeFi insights",
        "Collaborated with the team on authentication, security scanning, and modular design for production-grade robustness"
      ]
    },
    {
      title: "Research Assistant — FoodoScope, IIIT Delhi",
      period: "Aug 2023 – May 2025",
      role: "Machine Learning for Computational Gastronomy",
      achievements: [
        "Built ML models for allergen detection in a Protein Sequence",
        "Engineered a recipe recommendation system using collaborative filtering, deployed via Flask"
      ]
    },
    {
      title: "Backend Developer — Caliper Business Solutions, Bengaluru",
      period: "May 2023 – Jul 2023",
      role: "Backend Development & API Integration",
      achievements: [
        "Automated SMS alerts for adverse weather using Twilio API, reducing logistics delays by 30%",
        "Designed geo-fencing system with Django, improving truck route compliance by 25%"
      ]
    }
  ];

  const projects = [
    {
      title: "PerPlexity Local",
      period: "Mar 2025 - Apr 2025",
      description: "Open-source Perplexity-like AI search tool integrating DuckDuckGo and Ollama LLMs for local private response generation",
      features: [
        "Supports context-aware conversations",
        "YouTube transcript summarization",
        "Real-time response streaming"
      ],
      links: { code: "https://github.com/Sarvajeet2003/PerPlexity-Local" }
    },
    {
      title: "Moodipy: Emotion-Based Music Player",
      period: "Aug 2024 – Nov 2024",
      description: "Emotion recognition using deep learning on facial expressions with Spotify API integration",
      features: [
        "Real-time emotion-based music recommendations",
        "Deep learning facial expression analysis",
        "Spotify API integration"
      ],
      links: { code: "https://github.com/Sarvajeet2003/Moodipy" }
    },
    {
      title: "MedEase",
      period: "Dec 2024",
      description: "Machine learning model to predict hospital readmissions using FHIR API for data integration",
      features: [
        "FHIR API data integration",
        "OpenAI summary generator for patient insights",
        "Predictive analytics for healthcare"
      ],
      links: { code: "https://github.com/Sarvajeet2003/MedEase" }
    },
    {
      title: "AI News Bot",
      description: "Telegram bot that keeps you updated with the latest AI advancements from across the web",
      features: [
        "Real-time AI news updates",
        "Web scraping and content aggregation",
        "Telegram bot integration"
      ],
      links: { 
        code: "https://github.com/Sarvajeet2003/AI-News-Bot",
        demo: "https://t.me/A_eye_bot"
      }
    },
    {
      title: "Spotify Telegram Bot",
      description: "AI-powered Telegram bot integrated with Spotify for music control",
      features: [
        "Search for songs",
        "Fetch playlists",
        "Play music instantly"
      ],
      links: { demo: "https://t.me/spotify_bot" }
    }
  ];

  const skills = {
    "AI & GenAI Domains": [
      "Machine Learning", "Deep Learning", "Natural Language Processing", 
      "Computer Vision", "Generative AI Models", "LLMs", "Prompt Engineering"
    ],
    "Programming Languages": ["Python", "TypeScript", "Kotlin", "Java"],
    "AI Frameworks & Libraries": [
      "TensorFlow", "Keras", "PyTorch", "Hugging Face Transformers", 
      "scikit-learn", "OpenCV"
    ],
    "GenAI Tools & Platforms": ["Ollama", "OpenAI APIs", "LangChain", "n8n"],
    "DevOps & Collaboration": ["Docker", "Git", "REST APIs"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-slate-800 dark:text-white">
              Sarvajeeth U K
            </div>
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'education', 'skills', 'experience', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === section
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl">
              <img
                src="https://z-cdn-media.chatglm.cn/files/7640f2ba-cda4-4632-a183-7afd21cc7984_IMG_0684.jpg?auth_key=1789309865-12f985aae80744f3adeab6847ba40c85-0-5e24fc97d7d13604af300d40c41964a0"
                alt="Sarvajeeth U K"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
            Sarvajeeth U K
          </h1>
          
          <div className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              AI Engineer & Machine Learning Specialist
            </span>
          </div>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
            Passionate about building innovative AI solutions, specializing in Generative AI, LLMs, and 
            machine learning applications. Currently pursuing B.Tech in CSE at IIIT Delhi with a focus on 
            cutting-edge AI technologies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Get In Touch
            </Button>
            <Button 
              onClick={() => scrollToSection('projects')}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 px-8 py-3 text-lg"
            >
              View Projects
            </Button>
          </div>
          
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/Sarvajeet2003" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://leetcode.com/u/sarvajeeth21417/" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
              <ExternalLink className="w-6 h-6" />
            </a>
            <a href="mailto:sarvajeethuk@gmail.com" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
              <Mail className="w-6 h-6" />
            </a>
          </div>
          
          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-8 h-8 text-slate-400 mx-auto" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            About Me
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                I am a passionate AI Engineer and Machine Learning enthusiast currently pursuing my B.Tech in 
                Computer Science at IIIT Delhi. With a strong foundation in AI technologies and hands-on experience 
                in developing cutting-edge solutions, I am dedicated to pushing the boundaries of what's possible 
                with artificial intelligence.
              </p>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                My expertise spans across Machine Learning, Deep Learning, Natural Language Processing, and 
                Generative AI. I have worked on diverse projects ranging from emotion recognition systems to 
                AI-powered search tools and DeFi applications.
              </p>
              
              <p className="text-lg text-slate-600 dark:text-slate-300">
                When I'm not coding, you can find me playing chess, trekking, or exploring the latest 
                advancements in AI technology. I believe in continuous learning and am always excited to 
                take on new challenges that allow me to grow and contribute to the AI community.
              </p>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700 dark:text-slate-300">sarvajeeth21417@iiitd.ac.in</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700 dark:text-slate-300">+91-8310934161</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700 dark:text-slate-300">Delhi, India</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Education Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>2021 - 2025:</strong> B.Tech CSE, IIIT Delhi
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>2019 - 2021:</strong> BGS PU College, Mysuru (96.6%)
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>2009 - 2019:</strong> St. Joseph's Central School (95.6%)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Education
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Indraprastha Institute of Information Technology</CardTitle>
                <CardDescription>IIIT Delhi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Dec 2021 – May 2025</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white">B.Tech in Computer Science</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Specializing in Artificial Intelligence and Machine Learning
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">BGS PU College</CardTitle>
                <CardDescription>Mysuru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">2019 – 2021</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white">Pre-University</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Karnataka Board of Secondary School
                  </p>
                  <Badge variant="secondary" className="mt-2">Score: 96.6%</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">St. Joseph's Central School</CardTitle>
                <CardDescription>Mysuru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">2009 – 2019</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white">Class I - X</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Central Board of Secondary Education (CBSE)
                  </p>
                  <Badge variant="secondary" className="mt-2">Score: 95.6%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Technical Skills
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, skillList]) => (
              <Card key={category} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Experience
          </h2>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-xl">{exp.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-blue-600 dark:text-blue-400">
                        {exp.role}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{exp.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700 dark:text-slate-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Projects
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {project.period && (
                        <CardDescription className="text-sm">{project.period}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {project.features.map((feature, featIndex) => (
                      <div key={featIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    {project.links.code && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.links.code} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.links.demo && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Get In Touch
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Let's Connect</CardTitle>
                <CardDescription className="text-center">
                  I'm always interested in new opportunities and collaborations in the AI space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Email</p>
                        <p className="text-slate-600 dark:text-slate-400">sarvajeeth21417@iiitd.ac.in</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Phone</p>
                        <p className="text-slate-600 dark:text-slate-400">+91-8310934161</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">GitHub</p>
                        <a href="https://github.com/Sarvajeet2003" className="text-blue-600 hover:underline">
                          @Sarvajeeth_U_K
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">LeetCode</p>
                        <a href="https://leetcode.com/u/sarvajeeth21417/" className="text-blue-600 hover:underline">
                          @sarvajeeth_U_K
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    I'm passionate about AI and always open to discussing new opportunities, 
                    collaborations, or just interesting ideas in the field.
                  </p>
                  <Button 
                    onClick={() => window.open('mailto:sarvajeeth21417@iiitd.ac.in', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 mb-4">
            © 2024 Sarvajeeth U K. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}