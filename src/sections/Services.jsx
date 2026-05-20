import React from 'react';
import { motion } from 'framer-motion';
import { Code2, PenTool, Video, Paintbrush, ShieldCheck } from 'lucide-react';

const services = [
  {
    title: 'Website Development',
    description: 'Modern, fast, and responsive websites tailored to your brand using cutting-edge technologies.',
    icon: <Code2 className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-400'
  },
  {
    title: 'UI/UX Design',
    description: 'Intuitive and engaging user interfaces that prioritize user experience and aesthetic excellence.',
    icon: <PenTool className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-400'
  },
  {
    title: 'Video Editing',
    description: 'Cinematic video edits, engaging social media content, and professional post-production.',
    icon: <Video className="w-8 h-8" />,
    color: 'from-rose-500 to-orange-400'
  },
  {
    title: 'Graphic Design',
    description: 'Striking visual identities, social media assets, and branding materials that stand out.',
    icon: <Paintbrush className="w-8 h-8" />,
    color: 'from-emerald-500 to-teal-400'
  },
  {
    title: 'Cybersecurity & Ethical Hacking',
    description: 'Secure coding practices, vulnerability assessment, and responsible exploit disclosures.',
    icon: <ShieldCheck className="w-8 h-8" />,
    color: 'from-cyan-500 to-purple-500'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Services = () => {
  return (
    <section id="services" className="py-24 relative bg-[#030014]/40 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-mono font-bold text-white mb-4">
            root@sushan:~# <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow-cyan">systemctl list-services</span>
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full" />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="group relative glass-card p-8 rounded-3xl overflow-hidden transition-all duration-300 border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(0,255,255,0.05)]"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-[0.03] rounded-bl-full transition-opacity duration-300 group-hover:opacity-[0.08]`} />
              
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${service.color} bg-opacity-10 text-white mb-6 border border-white/10`}>
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
