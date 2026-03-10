import React, { useState } from 'react';
import { detectEmotion, rewriteMessage } from './services/api';
import MessageInput from './components/MessageInput';
import ResultDisplay from './components/ResultDisplay';
import { MessageSquare } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [scenario, setScenario] = useState('');
  const [emotion, setEmotion] = useState('');
  const [rewritten, setRewritten] = useState('');
  const [targetEmotion, setTargetEmotion] = useState('Professional');
  const [format, setFormat] = useState('Email');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [error, setError] = useState('');

  const handleDetect = async () => {
    if (!text.trim()) return;
    try {
      setIsDetecting(true);
      setError('');
      setEmotion('');
      const data = await detectEmotion(text);
      setEmotion(data.emotion);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to detect emotion. Ensure backend is running.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleRewrite = async () => {
    // allow rewrite if there's either text OR a scenario
    if (!text.trim() && !scenario.trim()) return;
    try {
      setIsRewriting(true);
      setError('');
      setEmotion('');
      setRewritten('');
      const data = await rewriteMessage(text, targetEmotion, format, scenario);
      if (data.detected_emotion) {
        setEmotion(data.detected_emotion);
      }
      setRewritten(data.rewritten_message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to rewrite message. Ensure backend is running.');
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-slate-50 font-sans relative overflow-hidden">

      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>

      {/* Main Container */}
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-10 relative z-10">

        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/40 mb-6 text-white transform -rotate-6 ring-4 ring-white">
            <MessageSquare size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Sentiment Formatter
          </h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Transform emotional or aggressive texts into polite, constructive, and calm messages automatically using AI.
          </p>
        </div>

        <MessageInput
          text={text}
          setText={setText}
          scenario={scenario}
          setScenario={setScenario}
          targetEmotion={targetEmotion}
          setTargetEmotion={setTargetEmotion}
          format={format}
          setFormat={setFormat}
          onDetect={handleDetect}
          onRewrite={handleRewrite}
          isDetecting={isDetecting}
          isRewriting={isRewriting}
        />

        {error && (
          <div className="mt-6 p-4 text-red-600 bg-red-50 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <ResultDisplay
          emotion={emotion}
          rewrittenMessage={rewritten}
        />

      </div>
    </div>
  );
}

export default App;
