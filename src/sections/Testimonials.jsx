import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "CEO, TechStart",
    content: "Sushan completely transformed our web presence. The combination of his design skills and full-stack knowledge meant he delivered a product that was not only beautiful but incredibly fast and secure. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Creative Director",
    content: "Finding someone who understands both the technical security aspects and has an amazing eye for UI/UX is rare. Sushan's 3D-like glassmorphism designs gave our brand the premium feel we were desperately looking for.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "David Chen",
    role: "Cybersecurity Analyst",
    content: "Sushan's bug bounty background really shines through in his code. He spotted vulnerabilities in our architecture before they ever became an issue, all while building a seamless frontend interface.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, perspective: 1000 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[#030014]/30">
      {/* Background decoration */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-mono font-bold text-white mb-4">
            root@sushan:~# <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow-cyan">grep -r "recommend" reviews/</span>
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full mb-6" />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonialsData.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
              className="glass-card p-8 rounded-3xl relative transform-gpu transition-all duration-300 border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(0,255,255,0.05)] group"
            >
              <div className="absolute top-6 right-6 text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors">
                <Quote size={40} />
              </div>
              
              <p className="text-neutral-300 italic mb-8 relative z-10 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
