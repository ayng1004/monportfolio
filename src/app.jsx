import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';

// ============================================
// COMPOSANT: Navigation
// ============================================
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'projets', 'competences', 'experience', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Accueil', href: '#home' },
    { name: 'Projets', href: '#projets' },
    { name: 'Compétences', href: '#competences' },
    { name: 'Expérience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];
  
  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Amani Yangui
          </motion.h1>
          
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`relative text-gray-300 hover:text-white transition-colors ${
                  activeSection === item.href.slice(1) ? 'text-white' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                {activeSection === item.href.slice(1) && (
                  <motion.div 
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400"
                    layoutId="activeSection"
                  />
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// ============================================
// COMPOSANT: Hero Section avec Particules
// ============================================
function MorphingParticles() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialiser les particules
    const particleCount = 800;
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = Math.random() * 300 + 100;
      
      particlesRef.current.push({
        x: window.innerWidth / 2 + Math.cos(angle) * radius,
        y: window.innerHeight / 2 + Math.sin(angle) * radius,
        baseX: window.innerWidth / 2 + Math.cos(angle) * radius,
        baseY: window.innerHeight / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: Math.random() * 3 + 1,
        color: `hsl(${260 + Math.random() * 60}, 70%, ${50 + Math.random() * 20}%)`
      });
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle, index) => {
        const time = Date.now() * 0.001;
        const morphX = Math.sin(time + index * 0.01) * 50;
        const morphY = Math.cos(time + index * 0.01) * 50;
        
        const dx = mousePos.current.x - particle.x;
        const dy = mousePos.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          particle.vx += (dx / distance) * force * 0.5;
          particle.vy += (dy / distance) * force * 0.5;
        }
        
        particle.vx += (particle.baseX + morphX - particle.x) * 0.02;
        particle.vy += (particle.baseY + morphY - particle.y) * 0.02;
        
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ background: 'black' }}
    />
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      <MorphingParticles />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: 'linear-gradient(270deg, #8b5cf6, #ec4899, #3b82f6, #8b5cf6)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AMANI YANGUI
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl text-gray-300 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Développeuse Full-Stack
          </motion.p>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Créatrice d'Expériences Digitales Extraordinaires
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.a
              href="#projets"
              className="px-10 py-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-semibold text-lg shadow-2xl relative overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(139, 92, 246, 0.8)" }}
              whileTap={{ scale: 0.95 }}
            >
              Explorer mes projets
            </motion.a>
            
            <motion.a
              href="#contact"
              className="px-10 py-5 border-2 border-purple-500 rounded-full font-semibold text-lg"
              whileHover={{ scale: 1.05, borderColor: "#a78bfa" }}
              whileTap={{ scale: 0.95 }}
            >
              Me contacter
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-8 h-14 border-2 border-purple-400/50 rounded-full flex justify-center">
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full mt-2"
              animate={{ y: [0, 30, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// COMPOSANT: Projets avec Cartes 3D
// ============================================
function Phone3D({ project, isActive }) {
  return (
    <div className="relative w-32 h-64" style={{ transformStyle: 'preserve-3d' }}>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isActive ? [0, 360] : 0 }}
        transition={{ duration: 20, repeat: isActive ? Infinity : 0, ease: "linear" }}
      >
        <div 
          className="absolute w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl"
          style={{ backfaceVisibility: 'hidden', transform: 'translateZ(4px)' }}
        >
          <div className="absolute inset-2 bg-black rounded-xl overflow-hidden">
            <div className="h-full bg-gradient-to-br from-purple-600 to-blue-600 p-4">
              <div className="text-white text-xs font-bold mb-2">{project.title}</div>
              <div className="space-y-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-2 bg-white/20 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Laptop3D({ project, isActive }) {
  return (
    <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: isActive ? [-20, -10, -20] : -20,
          rotateY: isActive ? [0, 10, 0] : 0,
        }}
        transition={{ duration: 4, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      >
        <div className="relative w-64 h-40 bg-gray-900 rounded-t-lg" style={{ transformOrigin: 'bottom', transform: 'rotateX(20deg)' }}>
          <div className="absolute inset-2 bg-black rounded overflow-hidden">
            <div className="h-full bg-gradient-to-br from-green-600 to-blue-600 p-4">
              <div className="text-white text-sm font-bold mb-2">{project.title}</div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 bg-white/20 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-64 h-32 bg-gray-800 rounded-b-lg" style={{ transform: 'translateY(-1px)' }}>
          <div className="h-full p-4">
            <div className="h-16 bg-gray-700 rounded mb-2" />
            <div className="h-8 bg-gray-600 rounded" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, index, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className={`relative bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 ${
          isActive ? 'border-purple-400 shadow-2xl shadow-purple-500/50' : 'border-purple-500/30'
        }`}
        animate={{
          rotateX: isHovered ? -5 : 0,
          rotateY: isHovered ? 5 : 0,
          scale: isActive ? 1.05 : 1,
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex justify-center mb-6">
          {project.model === 'phone' ? <Phone3D project={project} isActive={isActive} /> : <Laptop3D project={project} isActive={isActive} />}
        </div>
        
        <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-purple-300 mb-4 text-sm">{project.tech}</p>
        
        {isHovered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-16 left-0 right-0 bg-black/90 backdrop-blur-xl rounded-lg p-3 text-center">
            <p className="text-white text-sm font-semibold">Cliquer pour explorer</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function ProjectsSection() {
  const [activeProject, setActiveProject] = useState(null);
  
  const projects = [
    {
      id: 1,
      title: "SnapShoot",
      tech: "React Native • Node.js • Docker",
      description: "Application sociale avec architecture microservices",
      model: "phone",
      features: ["Stories éphémères", "Chat temps réel", "Géolocalisation"]
    },
    {
      id: 2,
      title: "SupMap",
      tech: "React Native • Mapbox • PostGIS",
      description: "Navigation intelligente avec carte 3D",
      model: "phone",
      features: ["Carte 3D interactive", "Signalement d'incidents", "Navigation intelligente"]
    },
    {
      id: 3,
      title: "EventFlow SaaS",
      tech: "Node.js • PostgreSQL • React",
      description: "Plateforme de billetterie événementielle",
      model: "laptop",
      features: ["Gestion multi-événements", "Paiements sécurisés", "Analytics temps réel"]
    }
  ];
  
  return (
    <section id="projets" className="relative min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          className="text-5xl font-bold text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Projets Innovants
          </span>
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isActive={activeProject?.id === project.id}
              onClick={() => setActiveProject(activeProject?.id === project.id ? null : project)}
            />
          ))}
        </div>
        
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mt-12 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30"
            >
              <h3 className="text-3xl font-bold mb-4 text-white">{activeProject.title}</h3>
              <p className="text-gray-300 mb-6">{activeProject.description}</p>
              <div className="flex flex-wrap gap-4">
                {activeProject.features.map((feature, i) => (
                  <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-sm">{feature}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================
// COMPOSANT: Compétences
// ============================================
function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const skillCategories = [
    {
      name: "Frontend",
      color: "#61dafb",
      skills: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Three.js"]
    },
    {
      name: "Backend",
      color: "#68d391",
      skills: ["Node.js", "Python", "PHP", "Express", "Laravel"]
    },
    {
      name: "Database",
      color: "#4299e1",
      skills: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "PostGIS"]
    },
    {
      name: "DevOps",
      color: "#a78bfa",
      skills: ["Docker", "Git", "CI/CD", "Linux", "Nginx"]
    }
  ];
  
  return (
    <section id="competences" className="min-h-screen py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-5xl font-bold text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Univers Technologique
          </span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative cursor-pointer"
              onClick={() => setSelectedCategory(selectedCategory?.name === category.name ? null : category)}
            >
              <motion.div 
                className="p-8 rounded-2xl backdrop-blur-xl border-2 transition-all"
                style={{ 
                  borderColor: selectedCategory?.name === category.name ? category.color : category.color + '50',
                  background: `linear-gradient(135deg, ${category.color}10 0%, transparent 100%)`,
                  boxShadow: selectedCategory?.name === category.name ? `0 0 30px ${category.color}` : 'none'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: category.color }}>
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <motion.div
                      key={skill}
                      className="flex items-center gap-3"
                      whileHover={{ x: 10 }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-gray-300">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPOSANT: Expérience
// ============================================
function ExperienceSection() {
  const experiences = [
    {
      title: "Développeuse Full-Stack",
      company: "Quadribot",
      period: "Déc 2023 - Sept 2024",
      description: "Développement d'applications web de capteurs IoT avec Django REST et React",
      color: "#8b5cf6"
    },
    {
      title: "Bachelor Concepteur Développeur",
      company: "CESI École d'ingénieur",
      period: "Sept 2023 - Sept 2024",
      description: "Projet ministériel: Plateforme (RE)Sources avec Laravel & React Native",
      color: "#3b82f6"
    },
    {
      title: "BTS SIO SLAM",
      company: "École Nationale de Commerce",
      period: "Sept 2021 - Sept 2023",
      description: "Application GPS avec Leaflet & PostGIS",
      color: "#10b981"
    },
    {
      title: "Prépa Intégrée EPITA",
      company: "EPITA",
      period: "Sept 2020 - Sept 2021",
      description: "Développement de jeux 3D en C# et algorithmes de chiffrement",
      color: "#f59e0b"
    }
  ];
  
  return (
    <section id="experience" className="min-h-screen py-20 px-6 bg-gradient-to-b from-black to-purple-950/20">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-5xl font-bold text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Parcours
          </span>
        </motion.h2>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-transparent" />
          
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                <motion.div 
                  className="absolute left-6 w-4 h-4 rounded-full"
                  style={{ backgroundColor: exp.color }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur rounded-2xl p-6 border border-purple-500/20">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: exp.color }}>
                    {exp.title}
                  </h3>
                  <p className="text-gray-400 mb-2">{exp.company} • {exp.period}</p>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPOSANT: Contact avec effet Matrix
// ============================================
function MatrixRain() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let x = 0; x < columns; x++) {
      drops[x] = 1;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for(let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 35);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  );
}

function ContactSection() {
  const [hoveredButton, setHoveredButton] = useState(null);
  
  return (
    <section id="contact" className="min-h-screen py-20 px-6 bg-black relative overflow-hidden">
      <MatrixRain />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2 
          className="text-6xl font-bold mb-8"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            CONTACT
          </span>
        </motion.h2>
        
        <motion.p
          className="text-xl text-gray-300 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Établissons la connexion pour créer quelque chose d'extraordinaire
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-black/80 backdrop-blur-xl rounded-lg p-8 border border-green-500/50 font-mono max-w-2xl mx-auto mb-12"
          style={{ boxShadow: '0 0 50px rgba(0, 255, 0, 0.2)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500 text-sm ml-4">contact@amani.dev</span>
          </div>
          
          <div className="text-green-500 text-left space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              &gt; DEVELOPER: AMANI YANGUI
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              &gt; EMAIL: amani-yangui@live.fr
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              &gt; PHONE: 06.22.00.58.51
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              &gt; STATUS: READY TO CONNECT_
              <span className="animate-pulse">█</span>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="mailto:amani-yangui@live.fr"
            className="relative px-8 py-4 bg-green-500 text-black rounded-lg font-bold text-lg overflow-hidden group"
            onMouseEnter={() => setHoveredButton('email')}
            onMouseLeave={() => setHoveredButton(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">ENVOYER UN EMAIL</span>
            {hoveredButton === 'email' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.a>
          
          <motion.a
            href="tel:+33622005851"
            className="relative px-8 py-4 border-2 border-green-500 text-green-500 rounded-lg font-bold text-lg overflow-hidden"
            onMouseEnter={() => setHoveredButton('phone')}
            onMouseLeave={() => setHoveredButton(null)}
            whileHover={{ scale: 1.05, borderColor: "#10b981" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">APPELER</span>
            {hoveredButton === 'phone' && (
              <motion.div
                className="absolute inset-0 bg-green-500/10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.a>
        </motion.div>
        
        <motion.div
          className="mt-16 flex justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {['GitHub', 'LinkedIn', 'Twitter'].map((social, index) => (
            <motion.a
              key={social}
              href="#"
              className="w-14 h-14 border-2 border-green-500/50 rounded-lg flex items-center justify-center text-green-500 font-mono text-sm hover:border-green-500 hover:bg-green-500/10 transition-all"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {social.substring(0, 2)}
            </motion.a>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-500 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ boxShadow: '0 0 10px #00ff00' }}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================
// COMPOSANT PRINCIPAL: App
// ============================================
export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform-origin-left z-50"
        style={{ scaleX }}
      />
      
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  );
}