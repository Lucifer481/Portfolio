import React from 'react';
import { motion } from 'framer-motion';

const journeyData = [
  {
    id: 1,
    year: '2023 - Present',
    role: 'Independent Bug Bounty Hunter',
    company: 'Self-Employed / Platforms',
    description: 'Securing web applications by discovering critical vulnerabilities. Actively researching exploits, crafting write-ups, and helping protect corporate infrastructures.',
    type: 'experience'
  },
  {
    id: 2,
    year: '2022 - 2025',
    role: 'BSc Hons (Ethical Hacking & Cyber Security)',
    company: 'Softwarica College of IT and Ecommerce',
    description: 'Completed comprehensive theoretical and practical studies in penetration testing, digital forensics, defensive security, database security, and network defense.',
    type: 'education'
  },
  {
    id: 3,
    year: '2022 - Present',
    role: 'Freelance Graphic Designer & Full-Stack Developer',
    company: 'Self-Employed',
    description: 'Building custom websites and graphic designs for various clients, delivering interactive UI/UX features, branding, and promotional banners.',
    type: 'experience'
  },
  {
    id: 4,
    year: '2021 - 2022 (Nov)',
    role: 'Assistant Manager (Networking)',
    company: 'Websurfer Company',
    description: 'Managed network operations, assisted clients with routing troubleshooting, configured networking setups, and maintained quality service standards.',
    type: 'experience'
  },
  {
    id: 5,
    year: '2020 - 2022',
    role: 'Computer Science in Management',
    company: 'SANN International College',
    description: 'Completed higher secondary education focusing on software fundamentals, database queries, and introductory scripting.',
    type: 'education'
  }
];

const Experience = () => {
  const [experiences, setExperiences] = React.useState(journeyData);

  React.useEffect(() => {
    fetch('/api/experiences')
      .then(res => {
        if (!res.ok) throw new Error('API issue');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setExperiences(data);
        }
      })
      .catch(err => console.log('[API] Using local experiences fallback.', err));
  }, []);

  return (
    <section id="experience" className="py-24 relative bg-[#030014]/50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl md:text-4xl font-mono font-bold text-white mb-4">
            root@sushan:~# <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow-cyan">cat journey.log</span>
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full mb-6" />
          <p className="text-neutral-400 text-sm max-w-lg mx-auto font-mono">
            A chronological log of my academic path and commercial activities.
          </p>
        </motion.div>

        <div className="relative">
          {/* Glowing Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-indigo-950 shadow-[0_0_15px_rgba(0,255,255,0.3)]" />

          <div className="space-y-12">
            {experiences.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot with Pulse Effect */}
                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#030014] border-2 border-cyan-400 mt-1.5 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.8)]">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                </div>

                {/* Content card */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'
                }`}>
                  <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.05)] duration-300">
                    <span className="text-cyan-400 font-mono text-xs tracking-wider mb-2 block uppercase font-bold">
                      {item.year}
                    </span>
                    <span className="inline-block px-3 py-1 text-[10px] uppercase font-mono rounded-md bg-white/5 border border-white/10 text-neutral-400 mb-3">
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400">
                      {item.role}
                    </h3>
                    <p className="text-neutral-400 text-sm font-semibold mb-4">
                      {item.company}
                    </p>
                    <p className="text-neutral-300 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
