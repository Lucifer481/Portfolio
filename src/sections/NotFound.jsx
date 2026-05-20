import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

const NotFound = ({ onGoHome }) => {
  const [logs, setLogs] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [visitorIp, setVisitorIp] = useState('127.0.0.1');

  useEffect(() => {
    const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 223) + 1);
    setVisitorIp(octets.join('.'));

    const bootSequence = [
      '[*] Initializing intrusion countermeasure subsystem...',
      `[!] ALERT: Security infraction logged at ${new Date().toISOString()}`,
      `[!] SOURCE_IP: ${octets.join('.')}`,
      `[!] REQUEST_URI: ${window.location.pathname}`,
      '[-] Error code: 404 (Resource Not Found / Access Restricted)',
      '[*] Running system diagnostics...',
      '[+] Honeypot active: LOGGING THREAT DATA',
      '[+] Status: FIREWALL INTEGRITY 100% | THREAT CONTAINED',
      '',
      'SYSTEM ADVICE: Return to safety or execute diagnostics.',
      ''
    ];

    let timer;
    let index = 0;
    const printLog = () => {
      if (index < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[index]]);
        index++;
        timer = setTimeout(printLog, 200);
      }
    };
    printLog();
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputVal.trim().toLowerCase();
      const nextLogs = [...logs, `visitor@intrusion-logs:~$ ${inputVal}`];
      
      if (cmd === 'help') {
        nextLogs.push(
          'Available commands:',
          '  diagnostics  - Verify firewall routing status',
          '  clear        - Clear console screen buffer',
          '  home         - Safe redirect to primary portfolio'
        );
      } else if (cmd === 'clear') {
        setLogs([]);
        setInputVal('');
        return;
      } else if (cmd === 'home' || cmd === 'exit') {
        onGoHome();
        return;
      } else if (cmd === 'diagnostics') {
        nextLogs.push(
          '[*] Analyzing firewall tables...',
          '[+] Port 22/tcp: FILTERED',
          '[+] Port 80/tcp: REDIRECTED TO HOME',
          '[+] Port 443/tcp: SECURED WITH SSL',
          '[+] Status: No active malware detected. Redirect recommended.'
        );
      } else {
        nextLogs.push(`sh: command not found: ${inputVal}. Type 'help' for command list.`);
      }
      
      setLogs(nextLogs);
      setInputVal('');
    }
  };

  return (
    <div className="min-h-screen bg-[#03000b] text-emerald-400 font-mono flex items-center justify-center p-6 relative overflow-hidden select-text">
      {/* Scanline overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,0,0.04),rgba(0,0,0,0),rgba(0,255,0,0.04))] bg-[size:100%_4px,6px_100%] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,rgba(0,0,0,0.9)_90%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-black/80 border border-emerald-500/30 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col h-[520px]"
      >
        {/* Terminal Header */}
        <div className="bg-emerald-950/20 border-b border-emerald-500/20 px-4 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-rose-500 font-bold text-xs uppercase tracking-widest">
              [ SECURE NODE SECURITY ]
            </span>
          </div>
          <div className="text-xs text-emerald-500/60 font-mono">
            IP: {visitorIp}
          </div>
        </div>

        {/* Console Log Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-2 text-sm text-left custom-scrollbar">
          <div className="text-rose-500 font-bold text-xl mb-4 text-center tracking-widest animate-pulse">
            [ ERROR 404: SITE GUARD BLOCK ]
          </div>
          
          {logs.map((log, i) => {
            let logColor = 'text-emerald-400';
            if (log.startsWith('[!]')) logColor = 'text-rose-500 font-bold';
            if (log.startsWith('[-]')) logColor = 'text-amber-500';
            if (log.startsWith('visitor@')) logColor = 'text-cyan-400';
            return (
              <pre key={i} className={`${logColor} break-all whitespace-pre-wrap font-mono leading-relaxed`}>
                {log}
              </pre>
            );
          })}

          <div className="text-cyan-400 flex items-center pt-2">
            <span>visitor@intrusion-logs:~$ &nbsp;</span>
            <input 
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-cyan-400 font-mono caret-cyan-400"
              autoFocus
              placeholder="Type 'help'..."
            />
          </div>
        </div>

        {/* Quick CTAs */}
        <div className="bg-emerald-950/10 border-t border-emerald-500/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-emerald-500/50">
            Intrusion logs logged to local honeypot blacklist.
          </span>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setLogs(prev => [
                  ...prev,
                  'visitor@intrusion-logs:~$ diagnostics',
                  '[*] Analyzing firewall tables...',
                  '[+] Port 22/tcp: FILTERED',
                  '[+] Port 80/tcp: REDIRECTED TO HOME',
                  '[+] Status: Integrity Verified. Redirect recommended.'
                ]);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold transition-colors cursor-pointer text-emerald-400"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Diagnostics
            </button>
            <button 
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Return Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
