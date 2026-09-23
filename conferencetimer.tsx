import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Plus, Minus, MessageSquare, 
  Trash2, PlusCircle, AlertTriangle, MonitorPlay, FastForward
} from 'lucide-react';

export default function ConferenceTimer() {
  // Initial demo segments
  const [segments, setSegments] = useState([
    { id: 1, title: 'Opening Keynote', speaker: 'Jane Smith', duration: 5 },
    { id: 2, title: 'Q&A Session', speaker: 'Audience', duration: 2 },
    { id: 3, title: 'Closing Remarks', speaker: 'John Doe', duration: 3 }
  ]);

  const [activeSegmentId, setActiveSegmentId] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  // Message feature states
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isMessageFlashing, setIsMessageFlashing] = useState(false);
  
  // New segment form state
  const [newSegment, setNewSegment] = useState({ title: '', speaker: '', duration: '' });

  // Handle the countdown timer
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const isNegative = totalSeconds < 0;
    const absSeconds = Math.abs(totalSeconds);
    const minutes = Math.floor(absSeconds / 60);
    const seconds = absSeconds % 60;
    
    return `${isNegative ? '-' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const activeSegment = segments.find(s => s.id === activeSegmentId) || segments[0];
  const totalSeconds = (activeSegment?.duration || 0) * 60;

  // Determine stage display color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 0) return 'text-red-500';
    if (timeRemaining <= totalSeconds * 0.2) return 'text-yellow-400';
    return 'text-green-500';
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(totalSeconds);
  };

  const adjustTime = (amountInSeconds) => {
    setTimeRemaining(prev => prev + amountInSeconds);
  };

  const loadSegment = (id) => {
    const seg = segments.find(s => s.id === id);
    if (seg) {
      setActiveSegmentId(id);
      setTimeRemaining(seg.duration * 60);
      setIsRunning(false);
      setIsMessageVisible(false);
    }
  };

  const handleAddSegment = (e) => {
    e.preventDefault();
    if (!newSegment.title || !newSegment.duration) return;
    
    const newId = (segments[segments.length - 1]?.id || 0) + 1;
    const duration = parseFloat(newSegment.duration);
    
    if (isNaN(duration)) return;

    setSegments([...segments, { id: newId, title: newSegment.title, speaker: newSegment.speaker, duration }]);
    setNewSegment({ title: '', speaker: '', duration: '' });
  };

  const deleteSegment = (id) => {
    if (segments.length <= 1) return; // Prevent deleting last segment
    const updated = segments.filter(s => s.id !== id);
    setSegments(updated);
    if (activeSegmentId === id) {
      loadSegment(updated[0].id);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-slate-200 overflow-hidden font-sans">
      
      {/* LEFT PANEL: Control Center */}
      <div className="w-1/3 min-w-[400px] h-full bg-gray-950 border-r border-gray-800 flex flex-col shadow-2xl z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3">
          <MonitorPlay className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold text-white tracking-wide">Stage Control</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {}
          {/* Controls: Playback & Adjustments */}
          <section className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timer Controls</h2>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={toggleTimer}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                  isRunning ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'
                }`}
              >
                {isRunning ? <Pause className="w-8 h-8 mb-2" /> : <Play className="w-8 h-8 mb-2" />}
                <span className="text-sm font-medium">{isRunning ? 'PAUSE' : 'START'}</span>
              </button>
              
              <button 
                onClick={resetTimer}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
              >
                <RotateCcw className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">RESET</span>
              </button>

              <button 
                onClick={() => {
                  const currentIndex = segments.findIndex(s => s.id === activeSegmentId);
                  if (currentIndex < segments.length - 1) {
                    loadSegment(segments[currentIndex + 1].id);
                  }
                }}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-800 text-indigo-400 hover:bg-gray-700 transition-all"
              >
                <FastForward className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">NEXT</span>
              </button>
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <button onClick={() => adjustTime(-60)} className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
                <Minus className="w-4 h-4" /> 1m
              </button>
              <button onClick={() => adjustTime(60)} className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
                <Plus className="w-4 h-4" /> 1m
              </button>
              <button onClick={() => adjustTime(300)} className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
                <Plus className="w-4 h-4" /> 5m
              </button>
            </div>
          </section>

          {}
          {/* Stage Message Control */}
          <section className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Stage Message
            </h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Type a message to the speaker..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsMessageVisible(!isMessageVisible)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isMessageVisible ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
                >
                  {isMessageVisible ? 'Hide Message' : 'Show Message'}
                </button>
                <button 
                  onClick={() => setIsMessageFlashing(!isMessageFlashing)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isMessageFlashing ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
                >
                  {isMessageFlashing ? 'Stop Flashing' : 'Flash Alert'}
                </button>
              </div>
            </div>
          </section>

          {}
          {/* Agenda / Segments */}
          <section className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Agenda</h2>
            
            <div className="space-y-2">
              {segments.map((seg) => (
                <div 
                  key={seg.id} 
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    activeSegmentId === seg.id 
                      ? 'bg-indigo-900/30 border-indigo-500/50' 
                      : 'bg-gray-800/50 border-gray-800 hover:bg-gray-800 hover:border-gray-700'
                  }`}
                  onClick={() => loadSegment(seg.id)}
                >
                  <div>
                    <h3 className={`font-semibold ${activeSegmentId === seg.id ? 'text-indigo-300' : 'text-gray-200'}`}>
                      {seg.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                      <span>{seg.speaker || 'No speaker'}</span>
                      <span>•</span>
                      <span>{seg.duration} min</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {activeSegmentId === seg.id && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSegment(seg.id); }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all rounded-md hover:bg-gray-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Segment Form */}
            <form onSubmit={handleAddSegment} className="bg-gray-800/30 rounded-xl p-4 border border-gray-800 border-dashed">
              <div className="space-y-3">
                <input 
                  type="text" required placeholder="Segment Title" 
                  value={newSegment.title} onChange={e => setNewSegment({...newSegment, title: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <div className="flex gap-2">
                  <input 
                    type="text" placeholder="Speaker" 
                    value={newSegment.speaker} onChange={e => setNewSegment({...newSegment, speaker: e.target.value})}
                    className="w-2/3 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <input 
                    type="number" required placeholder="Min" min="1"
                    value={newSegment.duration} onChange={e => setNewSegment({...newSegment, duration: e.target.value})}
                    className="w-1/3 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm font-medium transition-colors">
                  <PlusCircle className="w-4 h-4" /> Add Segment
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>

      {}
      {/* RIGHT PANEL: Stage Display */}
      <div className="flex-1 bg-black flex flex-col relative">
        
        {/* Stage Header Info */}
        <div className="p-8 flex justify-between items-start opacity-70">
          <div>
            <h2 className="text-4xl font-bold text-gray-400">{activeSegment?.title}</h2>
            {activeSegment?.speaker && (
              <p className="text-2xl text-gray-500 mt-2">{activeSegment.speaker}</p>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-xl text-gray-500">Scheduled</p>
            <p className="text-2xl text-gray-400 font-mono">{activeSegment?.duration}:00</p>
          </div>
        </div>

        {/* Main Countdown Timer */}
        <div className="flex-1 flex items-center justify-center -mt-16">
          <div 
            className={`font-mono font-bold tracking-tighter transition-colors duration-500 ${getTimerColor()}`} 
            style={{ fontSize: '20vw', lineHeight: '1' }}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>
        
        {/* Progress Bar at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gray-900">
          <div 
            className={`h-full transition-all duration-1000 ${
              timeRemaining > 0 
                ? (timeRemaining <= totalSeconds * 0.2 ? 'bg-yellow-400' : 'bg-green-500') 
                : 'bg-red-600'
            }`}
            style={{ 
              width: `${Math.min(100, Math.max(0, (timeRemaining / totalSeconds) * 100))}%` 
            }}
          />
        </div>

        {}
        {/* Message Overlay */}
        {(isMessageVisible && message) && (
          <div className="absolute bottom-16 left-0 w-full px-12 flex justify-center pointer-events-none">
            <div className={`
              max-w-4xl w-full text-center p-8 rounded-3xl backdrop-blur-md shadow-2xl border-4
              ${isMessageFlashing 
                ? 'bg-rose-600/90 border-rose-400 text-white animate-pulse' 
                : 'bg-indigo-900/90 border-indigo-400 text-white'}
            `}>
              {isMessageFlashing && <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-80" />}
              <p className="text-5xl font-bold leading-tight">{message}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}