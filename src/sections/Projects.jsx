import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { API_BASE } from '../config.js';

const projectsData = [
  {
    id: 1,
    title: 'Gaming cafe Website',
    category: 'Web Dev',
    image: '/projects/project1.png',
    tech: ['React', 'Web Design'],
    link: 'https://animated-sunburst-61a20d.netlify.app/',
  },
  {
    id: 2,
    title: 'Yakchhen Resturant web ',
    category: 'Web Dev',
    image: '/projects/project2.png',
    tech: ['Frontend', 'UI/UX'],
    link: 'https://luxury-stroopwafel-0ea598.netlify.app/',
  },
  {
    id: 3,
    title: 'LiveWebForTFC',
    category: 'Web Dev',
    image: '/projects/project3.png',
    tech: ['Web Dev', 'Design'],
    link: 'https://livewebfortfc.netlify.app/',
  },
  {
    id: 4,
    title: 'Gym Website sample',
    category: 'Web Dev',
    image: '/projects/project4.png',
    tech: ['HTML/CSS', 'JS'],
    link: 'https://meek-cendol-37479c.netlify.app/',
  },
  {
    id: 5,
    title: 'Robo-Wolf Esports Mascot Logo',
    category: 'Design',
    image: '/projects/logo.png',
    tech: ['Logo Design', 'Vector Illustrator', 'Branding'],
    isGallery: true,
    images: [
      '/projects/logo.png',
      '/projects/thumbnail.png',
      '/projects/poster.png',
      '/projects/banner.png',
      '/projects/gfx.png',
    ],
  },
  {
    id: 6,
    title: 'Gaming Aimbot YouTube Thumbnail',
    category: 'Design',
    image: '/projects/thumbnail.png',
    tech: ['YouTube Thumbnail', 'Photoshop', 'Esports'],
    isGallery: true,
    images: [
      '/projects/thumbnail.png',
      '/projects/logo.png',
      '/projects/poster.png',
      '/projects/banner.png',
      '/projects/gfx.png',
    ],
  },
  {
    id: 7,
    title: 'Cyber Defense Hackathon Poster',
    category: 'Design',
    image: '/projects/poster.png',
    tech: ['Poster Design', 'Social Media', 'CyberSec'],
    isGallery: true,
    images: [
      '/projects/poster.png',
      '/projects/thumbnail.png',
      '/projects/logo.png',
      '/projects/banner.png',
      '/projects/gfx.png',
    ],
  },
  {
    id: 8,
    title: 'Neon Cyberpunk Header Banner',
    category: 'Design',
    image: '/projects/banner.png',
    tech: ['Banner Design', 'Twitter Header', 'GFX'],
    isGallery: true,
    images: [
      '/projects/banner.png',
      '/projects/thumbnail.png',
      '/projects/logo.png',
      '/projects/poster.png',
      '/projects/gfx.png',
    ],
  },
  {
    id: 9,
    title: 'Synzx Creative Esports Headers',
    category: 'Design',
    image: '/projects/gfx.png',
    tech: ['GFX Design', 'Banners', 'Vectors'],
    isGallery: true,
    images: [
      '/projects/gfx.png',
      '/projects/thumbnail.png',
      '/projects/logo.png',
      '/projects/poster.png',
      '/projects/banner.png',
    ],
  },
];

const categories = ['All', 'Web Dev', 'Design'];

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [projects, setProjects] = useState(projectsData);

  React.useEffect(() => {
    fetch(`${API_BASE}/api/projects`)
      .then(res => {
        if (!res.ok) throw new Error('API issue');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(err => console.log('[API] Using local projects fallback.', err));
  }, []);

  const filteredProjects = projects.filter(project =>
    filter === 'All' ? true : project.category === filter
  );

  const openGallery = (project) => {
    setSelectedGallery(project);
    setCurrentImageIndex(0);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedGallery?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedGallery.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedGallery?.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedGallery.images.length - 1 : prev - 1));
    }
  };

  return (
    <section id="projects" className="py-24 relative bg-[#030014]/45 overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute right-0 bottom-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-4xl font-mono font-bold text-white mb-4">
              root@sushan:~# <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow-cyan">ls projects/</span>
            </h2>
            <div className="w-20 h-1 bg-cyan-500 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${filter === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(0,255,255,0.4)] border border-cyan-400/30'
                  : 'glass text-neutral-400 hover:text-white border border-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, perspective: 1000 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl overflow-hidden glass-card transform-gpu border border-white/5 shadow-2xl hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Neon scanline/overlay effect */}
                  <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    {project.isGallery ? (
                      <button
                        onClick={() => openGallery(project)}
                        className="p-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg cursor-pointer"
                        title="Open Gallery"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    ) : (
                      <>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                          title="Visit Website"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <a
                          href="https://github.com/Lucifer481"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-[#030014] text-white border border-white/10 rounded-full hover:scale-110 transition-transform shadow-lg"
                          title="View Source"
                        >
                          <FaGithub className="w-5 h-5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1 text-xs font-mono bg-white/5 text-neutral-300 rounded-full border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-lg"
            onClick={() => setSelectedGallery(null)}
          >
            <button
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-cyan-500 hover:text-white text-white rounded-full transition-colors z-50 cursor-pointer shadow-lg"
              onClick={() => setSelectedGallery(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              key={currentImageIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full h-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedGallery.images ? selectedGallery.images[currentImageIndex] : selectedGallery.image}
                alt={selectedGallery.title}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.25)] border border-cyan-500/30"
              />

              {selectedGallery.images && selectedGallery.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-[#030014]/80 hover:bg-cyan-500 text-white rounded-full transition-colors backdrop-blur-md border border-white/10 cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-[#030014]/80 hover:bg-cyan-500 text-white rounded-full transition-colors backdrop-blur-md border border-white/10 cursor-pointer shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-[#030014]/80 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                    {selectedGallery.images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-cyan-400 scale-125' : 'bg-white/30'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
