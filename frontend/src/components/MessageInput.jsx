import React from 'react';
import VoiceControls from './VoiceControls';

const MessageInput = ({ text, setText, scenario, setScenario, targetEmotion, setTargetEmotion, format, setFormat, onDetect, onRewrite, isDetecting, isRewriting }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-4 mb-2">
        <select
          value={targetEmotion}
          onChange={(e) => setTargetEmotion(e.target.value)}
          className="flex-1 p-3 rounded-xl border border-slate-200 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 bg-white text-slate-700 font-medium"
        >
          <option value="Professional">💼 Professional</option>
          <option value="Friendly">👋 Friendly</option>
          <option value="Empathetic">🤝 Empathetic</option>
          <option value="Direct">🎯 Direct</option>
        </select>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="flex-1 p-3 rounded-xl border border-slate-200 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 bg-white text-slate-700 font-medium"
        >
          <option value="Email">📧 Email</option>
          <option value="Chat/Text">💬 Chat/Text</option>
          <option value="Short Response">⚡ Short Response</option>
        </select>
      </div>

      <div className="relative group">
        <textarea
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Scenario / Context (Optional, e.g., 'Tell my boss I will be late because of traffic')"
          className="w-full h-20 p-4 rounded-2xl border border-slate-200 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 resize-none bg-slate-50/50 transition-all text-slate-700 text-sm placeholder:text-slate-400 mb-1"
        />
      </div>

      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or speak an original message that might sound rude..."
          className="w-full h-36 p-5 pb-16 rounded-2xl border border-slate-200 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 resize-none bg-slate-50/50 transition-all text-slate-700 text-lg placeholder:text-slate-400"
        />
        <div className="absolute bottom-4 right-4">
          {/* Passing onTranscript to update the textarea text */}
          <VoiceControls onTranscript={(transcript) => setText(prev => prev ? prev + ' ' + transcript : transcript)} />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onDetect}
          disabled={!text.trim() || isDetecting || isRewriting}
          className="flex-1 py-3.5 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isDetecting ? 'Detecting...' : 'Detect Emotion'}
        </button>
        <button
          onClick={onRewrite}
          disabled={(!text.trim() && !scenario.trim()) || isDetecting || isRewriting}
          className="flex-1 py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
        >
          {isRewriting ? 'Rewriting...' : 'Rewrite Message'}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
