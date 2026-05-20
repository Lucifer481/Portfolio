import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, User, RefreshCw, Trash2, Mail, CheckCircle, Clock, ChevronLeft, LogOut } from 'lucide-react';

const Admin = ({ onGoHome }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  
  // Terminal Emulator State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    'Sushan OS [Version 1.0.4]',
    '(c) 2026 Sushan Bhadel. All rights security protected.',
    '',
    'Type "help" for a list of available CLI commands.',
    'root@sushan:~# '
  ]);

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  // Load messages if token exists
  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  const fetchMessages = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        addTerminalLog('Successfully fetched visitor messages from sqlite database.');
      } else {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          addTerminalLog('[-] Error: Session expired or invalid token. Logged out.');
        } else {
          throw new Error('Database connection query failure.');
        }
      }
    } catch (err) {
      addTerminalLog(`[-] Error loading messages: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const addTerminalLog = (logText) => {
    setTerminalHistory(prev => {
      // Remove last line (prompt), add the new log, and re-append the prompt line
      const historyCopy = [...prev];
      if (historyCopy[historyCopy.length - 1] === 'root@sushan:~# ') {
        historyCopy.pop();
      }
      return [...historyCopy, logText, 'root@sushan:~# '];
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setTerminalHistory([
          'Sushan OS [Version 1.0.4]',
          '(c) 2026 Sushan Bhadel. All rights security protected.',
          '',
          '[+] Authentication credentials matched successfully.',
          '[+] Session security tokens generated.',
          'root@sushan:~# '
        ]);
      } else {
        setLoginError(data.error || 'Authentication Failed.');
      }
    } catch (err) {
      setLoginError('Could not establish contact with full-stack daemon.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setUsername('');
    setPassword('');
    setMessages([]);
  };

  const toggleMessageStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg));
        addTerminalLog(`[+] Updated message status ID:${id} to ${newStatus}.`);
      } else {
        addTerminalLog(`[-] Failed to update status for message ID:${id}.`);
      }
    } catch (err) {
      addTerminalLog(`[-] Error updating message ID:${id}: ${err.message}`);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to purge this record from database storage?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== id));
        addTerminalLog(`[+] Purged message ID:${id} from database logs.`);
      } else {
        addTerminalLog(`[-] Failed to purge message ID:${id}.`);
      }
    } catch (err) {
      addTerminalLog(`[-] Error deleting message ID:${id}: ${err.message}`);
    }
  };

  const handleTerminalCommand = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    // Echo input command
    setTerminalHistory(prev => {
      const h = [...prev];
      if (h[h.length - 1] === 'root@sushan:~# ') {
        h[h.length - 1] = `root@sushan:~# ${terminalInput}`;
      }
      return h;
    });

    setTerminalInput('');

    // Handle CLI inputs
    switch (cmd) {
      case 'help':
        addTerminalLog(
          'Available commands:\n' +
          '  help      - Display this information listing.\n' +
          '  clear     - Wipe terminal screen log history.\n' +
          '  refresh   - Query the sqlite database for new items.\n' +
          '  status    - View system environment variables audit.\n' +
          '  logout    - Wipes token logs and exits the dashboard.\n' +
          '  whoami    - Display session user permissions info.'
        );
        break;
      case 'clear':
        setTerminalHistory(['root@sushan:~# ']);
        break;
      case 'refresh':
        addTerminalLog('Initiating SQLite select query sequence...');
        fetchMessages();
        break;
      case 'status':
        addTerminalLog(
          `SQLite Daemon: ACTIVE\n` +
          `Port Routing: 5000\n` +
          `Session User: ${username || 'admin'}\n` +
          `SMTP Relay: Enabled\n` +
          `Local System Time: ${new Date().toLocaleString()}`
        );
        break;
      case 'logout':
        addTerminalLog('Purging session tokens...');
        setTimeout(() => handleLogout(), 1000);
        break;
      case 'whoami':
        addTerminalLog(`User: admin\nAccess Level: ROOT_ADMINISTRATOR\nHost: sushan-cyber-sec-net`);
        break;
      default:
        addTerminalLog(`sh: command not found: ${cmd}. Type "help" for options.`);
    }
  };

  return (
    <div className="bg-[#030014] min-h-screen text-white select-text font-sans pb-20 pt-28 relative overflow-hidden">
      {/* Glow overlays */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 text-neutral-300 hover:text-cyan-400 transition-colors text-xs font-mono uppercase tracking-widest cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Go Back
          </button>
          
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-wider">
            root@sushan:~# <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow-cyan">inbox_daemon</span>
          </h1>

          {token && (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all text-xs font-mono uppercase tracking-widest cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!token ? (
            /* Login console interface */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="glass-card rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                    <Terminal className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                <h2 className="text-xl font-bold font-mono text-center mb-2 text-white">System Authentication</h2>
                <p className="text-xs text-neutral-400 font-mono text-center mb-8">Access restricted to authorized cyber administrators only.</p>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Identity
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#030014]/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                      placeholder="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" /> Passphrase
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#030014]/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                      placeholder="••••••••••••"
                    />
                  </div>

                  {loginError && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-mono text-xs text-glow-rose">
                      [-] ERROR: {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold tracking-wider text-sm hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
                  >
                    {isLoggingIn ? 'Decrypting Session Keys...' : 'Authenticate Profile'}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* Secure Admin Inbox Panel */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Terminal Console Block */}
              <div className="glass-card rounded-2xl border border-white/5 shadow-2xl p-6 font-mono text-xs text-neutral-300">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-neutral-500 ml-2">secure_session.sh</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Interactive Terminal</span>
                </div>
                
                <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-cyan-500/20 pr-2">
                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                      {line.startsWith('root@sushan') ? (
                        <span className="text-cyan-400 font-bold">{line}</span>
                      ) : line.startsWith('[-]') || line.includes('Error') ? (
                        <span className="text-rose-400">{line}</span>
                      ) : line.startsWith('[+]') || line.includes('Successfully') ? (
                        <span className="text-emerald-400">{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                <form onSubmit={handleTerminalCommand} className="flex items-center border-t border-white/5 pt-3 mt-3">
                  <span className="text-cyan-400 font-bold mr-2">root@sushan:~#</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent text-white border-none outline-none font-mono focus:ring-0 p-0"
                    placeholder="type shell commands (e.g. help, refresh, status)..."
                    autoFocus
                  />
                </form>
              </div>

              {/* Message Inbox list */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Database Messages Logs</h2>
                    <p className="text-xs text-neutral-400 font-mono">Found {messages.length} inquiries in SQLite database.</p>
                  </div>
                  
                  <button 
                    onClick={fetchMessages}
                    disabled={isFetching}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition-all border border-white/10 text-xs font-mono cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                    Sync Logs
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="glass-card rounded-2xl border border-white/5 p-12 text-center text-neutral-500 font-mono text-sm">
                    No visitor logs recorded in database. System status is clean.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`glass-card p-6 rounded-2xl border transition-all duration-300 ${
                          msg.status === 'unread' 
                            ? 'border-cyan-500/20 bg-cyan-950/5 shadow-[0_0_15px_rgba(0,255,255,0.03)]' 
                            : 'border-white/5 bg-transparent'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          
                          {/* Subject / Sender details */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              {msg.status === 'unread' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 text-glow-cyan">
                                  <Clock className="w-3 h-3" /> Unread
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-500/10 text-neutral-400 border border-neutral-400/10">
                                  <CheckCircle className="w-3 h-3" /> Audited
                                </span>
                              )}
                              <span className="text-xs text-neutral-400 font-mono">{msg.date}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white pt-1">{msg.subject}</h3>
                            <p className="text-sm text-neutral-300">
                              From: <span className="font-semibold text-neutral-100">{msg.name}</span> &lt;
                              <a href={`mailto:${msg.email}`} className="text-cyan-400 hover:underline">{msg.email}</a>&gt;
                            </p>
                          </div>

                          {/* Quick controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleMessageStatus(msg.id, msg.status)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                msg.status === 'unread'
                                  ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
                                  : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                              }`}
                              title={msg.status === 'unread' ? 'Mark Audited' : 'Mark Unread'}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            
                            <a
                              href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}
                              className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 rounded-xl transition-all cursor-pointer"
                              title="Send Email Reply"
                            >
                              <Mail className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>

                        {/* Content text */}
                        <div className="bg-[#030014]/50 border border-white/5 p-4 rounded-xl font-mono text-sm leading-relaxed text-neutral-300 whitespace-pre-wrap select-all selection:bg-cyan-500/30">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
