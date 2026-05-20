import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, ShieldAlert, Target, Palette, Video, Cpu } from 'lucide-react';
import { FaReact, FaJs } from 'react-icons/fa';

const skillCategories = [
  {
    name: 'Full Stack Development',
    desc: 'Building highly secure and performant production-ready MERN/Next.js WebApps.',
    icon: Terminal,
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(0, 255, 255, 0.3)'
  },
  {
    name: 'React.js',
    desc: 'Crafting responsive user interfaces with complex state & smooth animations.',
    icon: FaReact,
    color: 'from-blue-400 to-indigo-500',
    glow: 'rgba(59, 130, 246, 0.3)'
  },
  {
    name: 'JavaScript',
    desc: 'Deep scripting logic, asynchronous flows, and algorithmic challenges solver.',
    icon: FaJs,
    color: 'from-yellow-400 to-amber-500',
    glow: 'rgba(234, 179, 8, 0.3)'
  },
  {
    name: 'UI/UX Design',
    desc: 'Creating high-fidelity interactive wireframes, user journeys, and prototypes.',
    icon: Cpu,
    color: 'from-purple-400 to-pink-500',
    glow: 'rgba(168, 85, 247, 0.3)'
  },
  {
    name: 'Graphic Design',
    desc: 'Designing creative social media visuals, high-quality vectors, and banners.',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    glow: 'rgba(244, 63, 94, 0.3)'
  },
  {
    name: 'Video Editing',
    desc: 'Assembling dynamic cinematic trailers, gaming montages, and content storytelling.',
    icon: Video,
    color: 'from-red-500 to-orange-500',
    glow: 'rgba(239, 68, 68, 0.3)'
  },
  {
    name: 'Ethical Hacking',
    desc: 'Active network scanning, penetration testing, and identifying security loopholes.',
    icon: ShieldAlert,
    color: 'from-green-400 to-emerald-500',
    glow: 'rgba(34, 197, 94, 0.3)'
  },
  {
    name: 'Cybersecurity',
    desc: 'Assessing system defense, secure coding patterns, and network architecture.',
    icon: Shield,
    color: 'from-teal-400 to-cyan-500',
    glow: 'rgba(20, 184, 166, 0.3)'
  },
  {
    name: 'Bug Bounty Hunting',
    desc: 'Independent vulnerability hunting and web penetration testing in free time.',
    icon: Target,
    color: 'from-emerald-400 to-teal-500',
    glow: 'rgba(16, 185, 129, 0.3)'
  }
];

const iconMap = {
  Terminal,
  Shield,
  ShieldAlert,
  Target,
  Palette,
  Video,
  Cpu,
  FaReact,
  FaJs
};

const Skills = () => {
  const [skills, setSkills] = React.useState(skillCategories);

  React.useEffect(() => {
    fetch('/api/skills')
      .then(res => {
        if (!res.ok) throw new Error('API issue');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
        }
      })
      .catch(err => console.log('[API] Using local skills fallback.', err));
  }, []);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[#030014]/30">
      {/* Glow effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-mono font-bold text-white mb-4">
            root@sushan:~# <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow-cyan">nmap -sV localhost</span>
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full mb-6" />
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Hover over the cards to experience their 3D interactive physics and neon field glows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const Icon = typeof skill.icon === 'string' ? (iconMap[skill.icon] || Terminal) : skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30, perspective: 1000 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  rotateX: 10, 
                  rotateY: -10, 
                  scale: 1.03,
                  boxShadow: `0 0 30px ${skill.glow}`
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="glass-card p-8 rounded-3xl relative border border-white/5 transform-gpu group cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Neon glow effect inside the card */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-3xl" />
                
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.color} p-[1px] flex items-center justify-center mb-6 shadow-lg`}>
                    <div className="w-full h-full bg-[#030014] rounded-2xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {skill.name}
                  </h3>
                </div>

                <p className="text-neutral-400 text-sm leading-relaxed mt-2">
                  {skill.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
