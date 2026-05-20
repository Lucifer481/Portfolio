import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal as TerminalIcon } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

const subtitles = [
  "Full Stack Developer",
  "Cybersecurity Enthusiast",
  "UI/UX Designer",
  "Graphic Designer"
];

// Custom Decrypt Scrambler Component
const DecryptText = ({ text, delay = 0 }) => {
  const chars = '01#$@&%<>[]{}+-=*!?XYZabc';
  const [displayText, setDisplayText] = useState(() => {
    // Initialize with scrambled characters of the same length to prevent layout collapse (CLS)
    return text
      .split('')
      .map(char => char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])
      .join('');
  });

  useEffect(() => {
    let timer;
    let currentIteration = 0;
    const targetText = text;

    const startAnimation = () => {
      timer = setInterval(() => {
        setDisplayText(() => {
          return targetText
            .split('')
            .map((char, index) => {
              if (index < currentIteration) {
                return targetText[index];
              }
              if (char === ' ') return ' ';
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        });

        currentIteration += 1 / 6;
        if (currentIteration >= targetText.length + 1) {
          clearInterval(timer);
          setDisplayText(targetText);
        }
      }, 50);
    };

    const startDelay = setTimeout(startAnimation, delay);

    return () => {
      clearInterval(timer);
      clearTimeout(startDelay);
    };
  }, [text, delay]);

  return <span>{displayText}</span>;
};

// Hacker Terminal Simulator Component
const HackerTerminal = () => {
  const [logs, setLogs] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const terminalLogsRef = useRef(null);

  const commandQueue = [
    { input: 'nmap -sS -F sushanbhadel.com.np', outputs: [
      'Starting Nmap 7.92 ( https://nmap.org )',
      'Nmap scan report for sushanbhadel.com.np',
      'Host is up (0.045s latency).',
      'PORT    STATE SERVICE',
      '22/tcp  open  ssh',
      '80/tcp  open  http',
      '443/tcp open  https',
      'MAC Address: 48:1A:E2:B3:9C:FD (Security Core)',
      'Nmap done: 1 IP address scanned.'
    ]},
    { input: 'hydra -l sushan -P rockyou.txt ssh://localhost', outputs: [
      'Hydra v9.2-dev (c) 2021 by van Hauser/THC',
      '[DATA] attacking ssh://localhost:22',
      '[STATUS] 16.00 tries/min, 16 tries, 1 target',
      '[ERROR] SSH Banner exchange failed.',
      '[COMPLETED] SSH connection protected by core firewall.'
    ]},
    { input: 'secops --check-integrity', outputs: [
      '[*] Testing endpoint security...',
      '[+] SSL/TLS certificate: VALID',
      '[+] XSS protection filters: ACTIVE',
      '[+] SQL injection guards: STABLE',
      '[+] Status: ACCESS GRANTED. SECURE_CORE_ONLINE'
    ]}
  ];

  useEffect(() => {
    let active = true;
    let sequence = async () => {
      // Small bootup log
      if (!active) return;
      setLogs(['[SYSTEM] Initializing cybersecurity protocols...']);
      await new Promise(r => setTimeout(r, 1000));
      
      let qIndex = 0;
      while (active) {
        const cmd = commandQueue[qIndex];
        
        // Type the command letter by letter
        for (let i = 0; i <= cmd.input.length; i++) {
          if (!active) return;
          setCurrentInput(cmd.input.substring(0, i));
          await new Promise(r => setTimeout(r, 50));
        }
        
        await new Promise(r => setTimeout(r, 400));
        
        if (!active) return;
        setLogs(prev => [...prev, `$ ${cmd.input}`]);
        setCurrentInput('');
        
        // Print outputs line by line
        for (const line of cmd.outputs) {
          if (!active) return;
          setLogs(prev => [...prev, line]);
          await new Promise(r => setTimeout(r, 200));
        }
        
        await new Promise(r => setTimeout(r, 3000));
        
        // Clean logs if they exceed height to keep it readable
        if (!active) return;
        setLogs(prev => prev.slice(-15));
        
        qIndex = (qIndex + 1) % commandQueue.length;
      }
    };
    
    sequence();
    return () => {
      active = false;
    };
  }, []);

  // Update scrollTop directly to avoid window jumping
  useEffect(() => {
    if (terminalLogsRef.current) {
      terminalLogsRef.current.scrollTop = terminalLogsRef.current.scrollHeight;
    }
  }, [logs, currentInput]);

  return (
    <div className="w-full h-80 rounded-2xl bg-black/90 border border-cyan-500/20 shadow-[0_0_40px_rgba(0,255,255,0.1)] p-4 font-mono text-left flex flex-col justify-between overflow-hidden relative group hover:border-cyan-400/40 transition-colors">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
      
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-xs text-neutral-400 select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center gap-1">
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>sec-ops@sushan:~</span>
        </div>
        <div className="w-10" />
      </div>
      
      {/* Logs Output */}
      <div 
        ref={terminalLogsRef}
        className="flex-1 overflow-y-auto text-xs space-y-1.5 custom-scrollbar text-neutral-300 pr-1"
      >
        {logs.map((log, i) => {
          let logColor = 'text-neutral-300';
          if (log.startsWith('[+]') || log.includes('GRANTED')) logColor = 'text-emerald-400';
          if (log.startsWith('[ERROR]')) logColor = 'text-rose-500';
          if (log.startsWith('$')) logColor = 'text-cyan-400';
          return (
            <div key={i} className={`${logColor} break-all font-mono leading-relaxed`}>
              {log}
            </div>
          );
        })}
        <div className="text-cyan-400 flex items-center">
          <span>$&nbsp;</span>
          <span>{currentInput}</span>
          <span className="w-2 h-3.5 bg-cyan-400 animate-pulse ml-0.5" />
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % subtitles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#030014]">
      {/* 3D Background */}
      <ThreeBackground />
      
      {/* Radial overlay gradient for lighting depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(3,0,20,0.8)_80%)] pointer-events-none" />
      
      {/* Background neon grids */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Decrypt texts & Intros */}
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold uppercase tracking-wider text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              SYSTEM STATUS: SECURE | BUG HUNTING ACTIVE
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4 leading-tight">
              <span className="text-neutral-400 text-3xl md:text-4xl block font-mono font-normal">
                <DecryptText text="Hi, I'm" delay={200} />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500 text-glow-cyan">
                <DecryptText text="Sushan Bhadel" delay={600} />
              </span>
            </h1>

            <div className="h-10 overflow-hidden flex items-center text-left">
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="text-lg md:text-2xl font-mono tracking-wide text-neutral-300"
                >
                  &gt; <span className="text-cyan-400 font-bold">{subtitles[index]}</span>
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-neutral-400 text-md md:text-lg max-w-xl leading-relaxed"
            >
              Ethical Hacker and Cybersecurity Graduate mapping system vulnerabilities, building secure infrastructure, and developing premium full-stack interfaces.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <a
                href="#projects"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:scale-105 duration-300 w-full sm:w-auto justify-center cursor-pointer"
              >
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="flex items-center gap-2 px-8 py-4 glass text-white rounded-full font-bold border border-white/10 hover:bg-white/5 transition-all hover:scale-105 duration-300 w-full sm:w-auto justify-center cursor-pointer"
              >
                Contact Me
              </a>
            </motion.div>
          </div>

          {/* Right Column: Hacker Terminal Console */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="lg:col-span-5 w-full"
          >
            <HackerTerminal />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
