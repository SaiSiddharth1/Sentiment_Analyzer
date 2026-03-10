import React from 'react';
import VoiceControls from './VoiceControls';

// Pre-define colors to map to Tailwind classes securely
const emotionColors = {
  anger: 'bg-red-50 text-red-700 border-red-200 shadow-red-500/10 ring-red-500/20',
  joy: 'bg-green-50 text-green-700 border-green-200 shadow-green-500/10 ring-green-500/20',
  sadness: 'bg-blue-50 text-blue-700 border-blue-200 shadow-blue-500/10 ring-blue-500/20',
  neutral: 'bg-slate-50 text-slate-700 border-slate-200 shadow-slate-500/10 ring-slate-500/20',
  fear: 'bg-purple-50 text-purple-700 border-purple-200 shadow-purple-500/10 ring-purple-500/20',
  surprise: 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-500/10 ring-yellow-500/20'
};

const ResultDisplay = ({ emotion, rewrittenMessage }) => {
  if (!emotion && !rewrittenMessage) return null;

  return (
    <div className="w-full mt-8 space-y-6 animate-in">
      {emotion && (
        <div className="flex items-center gap-3 justify-center py-2">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest pl-1">
            Detected Tone:
          </span>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border capitalize shadow-sm ring-1 ring-inset ${emotionColors[emotion] || emotionColors.neutral}`}>
            {emotion}
          </span>
        </div>
      )}

      {rewrittenMessage && (
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-lg shadow-slate-200/50 relative">
          <div className="absolute -top-3 left-6 px-3 py-0.5 bg-slate-800 text-xs font-bold text-white uppercase tracking-wider rounded-full shadow-sm">
            Rewritten Version
          </div>
          <p className="text-slate-800 text-xl leading-relaxed font-medium pt-2 pb-6">
            {rewrittenMessage}
          </p>
          <div className="absolute bottom-4 right-4">
            <VoiceControls textToRead={rewrittenMessage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
