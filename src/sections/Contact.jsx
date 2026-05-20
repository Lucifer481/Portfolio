import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! Forwarded to inbox & Gmail.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to submit message.');
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Error connecting to server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#030014]/40">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-mono font-bold text-white mb-4">
            root@sushan:~# <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow-cyan">nc -lvp 4444</span>
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full mb-6" />
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Ready to bring your ideas to life? Whether you need a secure website, graphic showcase, or have a bug bounty challenge, drop a line!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 bg-neutral-900/30 p-6 md:p-10 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <a href="mailto:bdlsushan2@gmail.com" className="flex items-center gap-4 text-neutral-300 hover:text-cyan-400 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors border border-white/10 group-hover:border-cyan-400/40">
                  <Mail className="w-5 h-5 text-neutral-400 group-hover:text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email Me</p>
                  <p className="font-medium">bdlsushan2@gmail.com</p>
                </div>
              </a>

              <a href="https://github.com/Lucifer481" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-neutral-300 hover:text-purple-400 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors border border-white/10 group-hover:border-purple-400/40">
                  <FaGithub className="w-5 h-5 text-neutral-400 group-hover:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Follow on GitHub</p>
                  <p className="font-medium">Lucifer481</p>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/sushan19230/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-neutral-300 hover:text-blue-400 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors border border-white/10 group-hover:border-blue-400/40">
                  <FaLinkedin className="w-5 h-5 text-neutral-400 group-hover:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Connect on LinkedIn</p>
                  <p className="font-medium">Sushan Bhadel</p>
                </div>
              </a>

              <a href="https://wa.me/9860662528" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-neutral-300 hover:text-emerald-400 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors border border-white/10 group-hover:border-emerald-400/40">
                  <MessageCircle className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">WhatsApp</p>
                  <p className="font-medium">+977 9860662528</p>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#030014]/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#030014]/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#030014]/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
                  placeholder="Website Development Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#030014]/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none font-sans"
                  placeholder="Tell me about your project..."
                />
              </div>

              {status.message && (
                <div className={`p-4 rounded-xl text-sm font-mono border ${
                  status.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {status.type === 'success' ? '[+] SUCCESS: ' : '[-] ERROR: '}
                  {status.message}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] cursor-pointer hover:scale-[1.01] duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Transmitting Inbound Message...' : 'Send Message'}
                {!isSubmitting && <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
