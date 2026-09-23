import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Send } from 'lucide-react';

export default function App() {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos por defecto
  const [duration, setDuration] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const isNegative = seconds < 0;
    const abs = Math.abs(seconds);
    const m = Math.floor(abs / 60).toString().padStart(2, '0');
    const s = (abs % 60).toString().padStart(2, '0');
    return `${isNegative ? '-' : ''}${m}:${s}`;
  };

  const adjustTime = (seconds) => {
    setTimeLeft((prev) => prev + seconds);
    setDuration((prev) => prev + seconds);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(600);
    setDuration(600);
  };

  let colorClass = 'text-green-500';
  if (timeLeft <= 0) colorClass = 'text-red-500 bg-red-900/20';
  else if (timeLeft <= duration * 0.2) colorClass = 'text-yellow-500';

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      
      {/* Panel de Control (Izquierda) */}
      <div className="w-1/3 bg-gray-800 p-6 flex flex-col gap-6 border-r border-gray-700 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Panel de Control</h1>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Temporizador</h2>
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setIsRunning(!isRunning)} 
              className={`flex-1 py-3 rounded flex justify-center items-center gap-2 font-bold transition-colors ${isRunning ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'}`}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button 
              onClick={resetTimer} 
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 transition-colors rounded flex items-center justify-center"
            >
              <RotateCcw size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => adjustTime(60)} className="py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-1 transition-colors">
              <Plus size={16} /> 1 Min
            </button>
            <button onClick={() => adjustTime(-60)} className="py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-1 transition-colors">
              <Minus size={16} /> 1 Min
            </button>
            <button onClick={() => adjustTime(300)} className="py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-1 transition-colors">
              <Plus size={16} /> 5 Min
            </button>
            <button onClick={() => adjustTime(-300)} className="py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-1 transition-colors">
              <Minus size={16} /> 5 Min
            </button>
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Mensaje al Orador</h2>
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setDisplayMessage(messageInput)}
              placeholder="Ej. Concluye en 2 min" 
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              onClick={() => setDisplayMessage(messageInput)} 
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded flex items-center justify-center transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <button 
            onClick={() => {setMessageInput(''); setDisplayMessage('');}} 
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            Borrar Mensaje
          </button>
        </div>
      </div>

      {/* Pantalla del Orador (Derecha) */}
      <div className={`w-2/3 flex flex-col items-center justify-center p-8 transition-colors duration-500 ${colorClass}`}>
        <div className="text-[16vw] font-bold leading-none tabular-nums tracking-tighter">
          {formatTime(timeLeft)}
        </div>
        
        {displayMessage && (
          <div className="mt-12 text-[4vw] font-semibold text-white bg-blue-600 px-10 py-4 rounded-3xl shadow-2xl animate-bounce text-center max-w-[90%]">
            {displayMessage}
          </div>
        )}
      </div>
      
    </div>
  );
}