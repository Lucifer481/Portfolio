import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#030014]/50">
      {/* Decorative neon cyan light */}
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-mono font-bold text-white mb-4">
            root@sushan:~# <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow-cyan">cat whoami.txt</span>
          </h2>
          <div className="w-20 h-1 bg-cyan-500 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-6 text-neutral-300 text-lg leading-relaxed"
          >
            <p className="text-xl text-neutral-100 font-semibold tracking-wide border-l-4 border-cyan-400 pl-4">
              I am a Cybersecurity Graduate, Ethical Hacker, and Creator from Bhaktapur, Nepal.
            </p>
            <p>
              Graduated with a BSc Hons (Ethical Hacking and Cyber Security) from <span className="text-white font-medium">Softwarica College of IT and Ecommerce</span>. I am extremely passionate about improving my security assessment and coding capabilities, discovering system loopholes, and writing clean full-stack code.
            </p>
            <p>
              I participate in bug bounty programs in my free time to secure open-source applications, while also building highly customized, fast, and secure web environments with modern design systems.
            </p>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4 text-sm font-mono text-neutral-400">
              <div>
                <span className="text-cyan-400">LOCATION:</span> Bhaktapur, Nepal
              </div>
              <div>
                <span className="text-cyan-400">ALUMNI:</span> Softwarica IT College of Ecommerce
              </div>
              <div>
                <span className="text-cyan-400">AGE:</span> 22 Years
              </div>
              <div>
                <span className="text-cyan-400">STATUS:</span> Daily Challenges Ready
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, perspective: 1000 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, rotateX: 3, rotateY: -3 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            {/* Hologram Card Overlay */}
            <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-card p-2 transform-gpu border border-cyan-500/20 holo-overlay shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              <div className="w-full h-full bg-neutral-950 rounded-2xl overflow-hidden relative group">
                <img
                  src="/profile/j.jpeg"
                  alt="Sushan Bhadel"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
              </div>
            </div>

            {/* Floating Cyber Stats */}
            <div className="absolute -bottom-6 -left-6 glass px-6 py-4 rounded-2xl shadow-[0_0_15px_rgba(189,0,255,0.2)] border border-purple-500/30">
              <p className="text-3xl font-extrabold text-white text-glow-purple">100%</p>
              <p className="text-xs text-neutral-400 font-mono">DEDICATION</p>
            </div>
            <div className="absolute -top-6 -right-6 glass px-6 py-4 rounded-2xl shadow-[0_0_15px_rgba(0,255,255,0.2)] border border-cyan-500/30">
              <p className="text-3xl font-extrabold text-white text-glow-cyan">Active</p>
              <p className="text-xs text-neutral-400 font-mono">BUG BOUNTY</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
